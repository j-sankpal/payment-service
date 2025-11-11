# Payment Service

A production-ready microservice for processing payments with AWS Lambda, API Gateway, DynamoDB, SQS, SNS, and S3.

**This repo is designed to be analyzed by BlindSpot AI agents to auto-generate integration tests.**

---

## **What This Is**

- **2 REST APIs** via API Gateway
  - `POST /payments` → CreatePaymentHandler Lambda
  - `GET /payments/{paymentId}` → GetPaymentHandler Lambda

- **Event Processing** via SQS → Lambda
  - ProcessPaymentEventHandler processes queued payments
  - Generates receipts in S3

- **Data Storage**
  - DynamoDB table stores payments
  - DynamoDB Streams trigger Lambda for receipts
  - S3 stores generated receipts

- **Event Publishing**
  - SNS topic broadcasts payment events
  - SQS queue processes them asynchronously

- **Dependency Injection**
  - Dagger 2 for compile-time DI (fast Lambda cold starts)
  - No Spring, no reflection overhead

---

## **Architecture Diagram**
```
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
   ┌───┴────────────────────┐
   │                        │
   ▼                        ▼
[POST /payments]    [GET /payments/{id}]
   │                        │
   ▼                        ▼
CreatePaymentHandler   GetPaymentHandler
   │                        │
   └─────────┬──────────────┘
             │
      ┌──────▼──────┐
      │  DynamoDB   │
      │  (payments) │
      └──────┬──────┘
             │
        ┌────┴────┐
        │ Streams │
        └────┬────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
 SQS Queue        SNS Topic
    │                 │
    │         ┌───────┘
    │         │
    ▼         ▼
ProcessPaymentEventHandler
    │
    ▼
ReceiptService
    │
    ▼
  S3 Bucket
 (receipts)
```

---

## **Prerequisites**

- Java 17+
- Gradle 7.6+
- Node.js 18+
- AWS CLI configured with credentials
- Docker (optional, for LocalStack testing)

---

## **Build**

### **Build Java Code**
```bash
# From project root
gradle clean build

# Create fat JAR for Lambda
gradle shadowJar

# Output: build/libs/payment-service-1.0.0-all.jar
```

### **Build CDK Infrastructure**
```bash
cd infra

# Install dependencies
npm install

# Verify CDK
npm run build

# Output: CDK app ready to deploy
```

---

## **Deploy to AWS**

### **Prerequisites**

1. **AWS Account** with credentials configured
2. **CDK Bootstrap** (one-time setup)
```bash
cd infra

# Bootstrap CDK (only once per account/region)
cdk bootstrap aws://ACCOUNT_ID/us-east-1
```

### **Deploy**
```bash
cd infra

# Synthesize CloudFormation template
cdk synth

# Deploy to AWS
cdk deploy

# Confirm deployment
# Output: Stack outputs with API Gateway URL
```

### **Get API URL**
```bash
aws cloudformation describe-stacks \
  --stack-name PaymentServiceStack \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text
```

---

## **Test Locally with LocalStack**

### **Start LocalStack**
```bash
# Run LocalStack Docker container
docker run -d \
  --name localstack \
  -p 4566:4566 \
  -e DEBUG=1 \
  -e SERVICES=dynamodb,sqs,sns,s3,apigateway,lambda \
  localstack/localstack:latest

# Verify it's running
curl http://localhost:4566/_localstack/health
```

### **Deploy to LocalStack**
```bash
cd infra

# Set LocalStack endpoint
export AWS_ENDPOINT_URL=http://localhost:4566

# Deploy (uses localstack profile if configured)
cdk deploy \
  --profile localstack \
  --no-rollback

# Or manually set credentials
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

cdk deploy --no-rollback
```

### **Test API Locally**
```bash
# Create payment
curl -X POST http://localhost:4566/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "amount": 99.99,
    "currency": "USD",
    "description": "Test payment",
    "idempotencyKey": "test-key-1"
  }'

# Response:
# {
#   "paymentId": "uuid-here",
#   "status": "PENDING",
#   "amount": 99.99,
#   "currency": "USD",
#   "timestamp": 1234567890
# }

# Get payment
curl -X GET http://localhost:4566/payments/uuid-here

# Response:
# {
#   "paymentId": "uuid-here",
#   "status": "PENDING",
#   "amount": 99.99,
#   "currency": "USD",
#   "timestamp": 1234567890
# }
```

---

## **Project Structure**
```
payment-service/
├── src/
│   ├── main/java/com/acme/payment/
│   │   ├── handler/
│   │   │   ├── CreatePaymentHandler.java      # Lambda: POST /payments
│   │   │   ├── GetPaymentHandler.java         # Lambda: GET /payments/{id}
│   │   │   └── ProcessPaymentEventHandler.java # Lambda: Process SQS events
│   │   ├── service/
│   │   │   ├── PaymentService.java            # Business logic
│   │   │   ├── ReceiptService.java            # Generate receipts
│   │   │   └── IdempotencyService.java        # Prevent duplicates
│   │   ├── model/
│   │   │   ├── PaymentRequest.java
│   │   │   ├── PaymentResponse.java
│   │   │   └── PaymentEvent.java
│   │   ├── config/
│   │   │   ├── AwsModule.java                 # Dagger module
│   │   │   └── PaymentComponent.java          # Dagger component
│   │   └── util/
│   │       └── AwsClientFactory.java
│   └── test/
│       └── java/com/acme/payment/
│           └── (Integration tests - BlindSpot generates these!)
├── infra/
│   ├── lib/
│   │   ├── payment-service-stack.ts           # Main CDK Stack
│   │   ├── payment-api.ts                     # API Gateway
│   │   ├── payment-lambda.ts                  # Lambda functions
│   │   ├── payment-queue.ts                   # SQS queue
│   │   ├── payment-storage.ts                 # DynamoDB + S3
│   │   └── payment-topic.ts                   # SNS topic
│   ├── bin/
│   │   └── payment-service.ts                 # CDK app entry point
│   ├── package.json
│   └── tsconfig.json
├── build.gradle                               # Java build
├── settings.gradle
└── README.md
```

---

## **Intentional Risks (For BlindSpot to Detect)**

This code has **7+ integration failures** that BlindSpot agents should catch:

### **1. DynamoDB**
- ❌ Table has no backup configured
- ❌ No point-in-time recovery
- ❌ Streams enabled but no monitoring

### **2. SQS Queue**
- ❌ Dead-letter queue exists but no alarm
- ❌ No visibility into failed messages
- ❌ No retry backoff strategy in code

### **3. Lambda Functions**
- ❌ 30-second timeout (might be too short)
- ❌ No idempotency protection (duplicate charges possible)
- ❌ No circuit breaker for downstream failures

### **4. S3 Bucket**
- ❌ Bucket encryption not validated in code
- ❌ No lifecycle policy on receipts
- ❌ Public block not enforced in handlers

### **5. API Gateway**
- ❌ No rate limiting
- ❌ No authentication/authorization
- ❌ No input validation on request

### **6. Service Integration**
- ❌ No error handling if DynamoDB down
- ❌ No retry policy on SNS publish
- ❌ Silent failure on S3 upload errors

### **7. Security**
- ❌ No encryption on Lambda environment variables
- ❌ IAM roles not restricted enough
- ❌ No VPC for Lambda

---

## **BlindSpot Analysis**

This repo is designed to be analyzed by BlindSpot AI agents:

### **What BlindSpot Should Do**

1. **Analyzer Agent**: Extract topology from code
   - Find all Lambda handlers
   - Identify DynamoDB tables
   - Detect SNS topics, SQS queues, S3 buckets
   - Parse CDK infrastructure as code

2. **Detector Agent**: Identify integration risks
   - Missing DLQ → "Messages could be lost"
   - Lambda timeout too short → "Could cascade"
   - No idempotency → "Duplicate charges"
   - S3 not private → "Security risk"

3. **TestSmith Agent**: Generate JUnit5 tests
   - `testDynamoDBTableHasStreamsEnabled()`
   - `testSQSQueueHasDLQ()`
   - `testLambdaTimeoutNotTooShort()`
   - `testS3BucketNotPublic()`
   - `testPaymentIdempotencyEnforced()`
   - etc.

---

## **Running BlindSpot Against This Code**
```bash
# Assuming BlindSpot is installed/running
blindspot analyze payment-service/

# Output:
# 🔍 Analyzing payment-service...
# ✅ Extracted topology:
#    - 3 Lambda handlers
#    - 1 DynamoDB table
#    - 1 SQS queue
#    - 1 SNS topic
#    - 1 S3 bucket
#
# ⚠️  Detected 7 risks:
#    - missing_dlq_monitoring
#    - lambda_timeout_too_short
#    - no_idempotency_protection
#    - s3_not_validated_private
#    - no_encryption_on_env_vars
#    - no_circuit_breaker
#    - no_input_validation
#
# ✨ Generated 12 JUnit5 tests:
#    - test/integration/DynamoDBResilientTests.java
#    - test/integration/SQSResilientTests.java
#    - test/integration/LambdaResilientTests.java
#    - test/integration/S3SecurityTests.java
#    - test/integration/IdempotencyTests.java
```

---

## **Local Development**

### **Run Java Build**
```bash
# Build
gradle clean build

# Run tests
gradle test

# Watch for changes
gradle build --continuous
```

### **Debug Lambda Locally (SAM CLI)**
```bash
# Install SAM CLI
pip install aws-sam-cli

# Create SAM template (optional)
sam init

# Run Lambda locally
sam local start-api

# Invoke specific Lambda
sam local invoke CreatePaymentHandler \
  --event events/payment-event.json
```

---

## **Environment Variables**

When deployed, Lambdas receive these environment variables (from CDK):
```
PAYMENTS_TABLE_NAME=payments
PAYMENT_EVENTS_TOPIC_ARN=arn:aws:sns:us-east-1:ACCOUNT:payment-events
PAYMENT_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/ACCOUNT/payment-queue
PAYMENT_RECEIPTS_BUCKET_NAME=payment-receipts-ACCOUNT
DYNAMODB_ENDPOINT=http://localhost:8000  (local testing)
SQS_ENDPOINT=http://localhost:4566  (local testing)
```

---

## **Monitoring & Logs**

### **CloudWatch Logs**
```bash
# View Lambda logs
aws logs tail /aws/lambda/CreatePaymentHandler --follow

# View SQS DLQ
aws sqs receive-message \
  --queue-url https://sqs.us-east-1.amazonaws.com/ACCOUNT/payment-queue-dlq

# View DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedWriteCapacityUnits \
  --dimensions Name=TableName,Value=payments
```

### **X-Ray (Optional)**

Add X-Ray tracing to see full request path:
```bash
# Enable X-Ray in CDK
# handler.addEnvironment('AWS_XRAY_CONTEXT_MISSING', 'LOG_ERROR');

# View traces
aws xray get-service-graph --start-time $(date -d '1 hour ago' +%s)
```

---

## **Cleanup**

### **Delete AWS Stack**
```bash
cd infra

# Destroy all resources
cdk destroy

# Confirm: Yes
```

### **Stop LocalStack**
```bash
docker stop localstack
docker rm localstack
```

---

## **Troubleshooting**

### **Lambda Handler Not Found**
```
Error: Could not find handler
```

Fix: Ensure handler path is correct in CDK:
```typescript
handler: 'com.acme.payment.handler.CreatePaymentHandler'
```

### **DynamoDB Table Not Found**
```
Error: Requested resource not found
```

Fix: Ensure `PAYMENTS_TABLE_NAME` env var is set:
```bash
export PAYMENTS_TABLE_NAME=payments
```

### **SQS Message Goes to DLQ**
```
Message failed to process
```

Fix: Check logs:
```bash
aws logs tail /aws/lambda/ProcessPaymentEventHandler --follow
```

---

## **Next Steps**

1. **Build**: `gradle shadowJar`
2. **Deploy**: `cdk deploy` (AWS) or `docker run localstack` (local)
3. **Test**: `curl POST /payments ...`
4. **Analyze**: Run BlindSpot agents against this code
5. **Tests**: BlindSpot generates JUnit5 integration tests
6. **Verify**: `gradle test`

---

## **License**

MIT

---

## **Questions?**

This repo is a demo for BlindSpot AI test generation.
