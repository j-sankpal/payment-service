package com.acme.payment.service;

import com.acme.payment.model.PaymentException;
import com.acme.payment.model.PaymentRequest;
import com.acme.payment.model.PaymentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import java.util.UUID;

/**
 * Service for handling payment operations including creation, retrieval, and event publishing.
 */
@Singleton
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final DynamoDbEnhancedClient dynamoDbClient;
    private final SnsClient snsClient;
    private final SqsClient sqsClient;
    private final IdempotencyService idempotencyService;

    private final String paymentsTableName;
    private final String paymentEventsTopicArn;
    private final String paymentQueueUrl;

    @Inject
    public PaymentService(
            DynamoDbEnhancedClient dynamoDbClient,
            SnsClient snsClient,
            SqsClient sqsClient,
            IdempotencyService idempotencyService,
            @Named("PaymentsTableName") String paymentsTableName,
            @Named("PaymentEventsTopicArn") String paymentEventsTopicArn,
            @Named("PaymentQueueUrl") String paymentQueueUrl) {

        this.dynamoDbClient = dynamoDbClient;
        this.snsClient = snsClient;
        this.sqsClient = sqsClient;
        this.idempotencyService = idempotencyService;
        this.paymentsTableName = paymentsTableName;
        this.paymentEventsTopicArn = paymentEventsTopicArn;
        this.paymentQueueUrl = paymentQueueUrl;
    }

    /**
     * Create payment and emit event
     *
     * INTENTIONAL RISKS (for BlindSpot):
     * 1. No timeout on this method (could hang)
     * 2. Idempotency check not enforced (duplicate payments possible)
     * 3. No DLQ on SQS queue (messages could be lost)
     * 4. No retry policy on SNS (could fail silently)
     * 5. No circuit breaker if DynamoDB is down
     */
    public PaymentResponse createPayment(PaymentRequest request) {
        String paymentId = UUID.randomUUID().toString();
        long timestamp = System.currentTimeMillis();

        log.info("Processing payment: {}", paymentId);

        try {
            // RISK: No idempotency check enforced
            String existingPaymentId = idempotencyService.getIdempotentPaymentId(request.getIdempotencyKey());
            if (existingPaymentId != null) {
                log.warn("Duplicate payment detected: {} -> {}", request.getIdempotencyKey(), existingPaymentId);
                return PaymentResponse.builder()
                        .paymentId(existingPaymentId)
                        .status("SUCCESS")
                        .amount(request.getAmount())
                        .currency(request.getCurrency())
                        .timestamp(timestamp)
                        .build();
            }

            // Store payment in DynamoDB with status=PENDING
            // TODO: Use dynamoDbClient to put item
            log.info("Stored payment in DynamoDB: {}", paymentId);

            // Publish to SNS (RISK: no retry policy)
            snsClient.publish(PublishRequest.builder()
                    .topicArn(paymentEventsTopicArn)
                    .message(createPaymentEventJson(paymentId, request, "PENDING"))
                    .build());
            log.info("Published to SNS: {}", paymentId);

            // Send to SQS (RISK: no DLQ configured in code)
            sqsClient.sendMessage(SendMessageRequest.builder()
                    .queueUrl(paymentQueueUrl)
                    .messageBody(createPaymentEventJson(paymentId, request, "PENDING"))
                    .build());
            log.info("Sent to SQS: {}", paymentId);

            // Store idempotency key
            idempotencyService.storeIdempotencyKey(request.getIdempotencyKey(), paymentId);

            return PaymentResponse.builder()
                    .paymentId(paymentId)
                    .status("PENDING")
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .timestamp(timestamp)
                    .build();

        } catch (Exception e) {
            log.error("Payment processing failed: {}", paymentId, e);
            return PaymentResponse.builder()
                    .paymentId(paymentId)
                    .status("FAILED")
                    .error(e.getMessage())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .timestamp(timestamp)
                    .build();
        }
    }

    /**
     * Retrieves a payment by its ID.
     *
     * @param paymentId the unique identifier of the payment
     * @return the payment response
     * @throws PaymentException if paymentId is invalid or payment not found
     */
    public PaymentResponse getPayment(String paymentId) {
        log.debug("Fetching payment: {}", paymentId);

        // Validate payment ID
        com.acme.payment.util.PaymentValidator.validatePaymentId(paymentId);

        // TODO: Query DynamoDB for paymentId
        // For now, simulate not found by throwing PaymentException directly
        log.warn("Payment not found in database: {}", paymentId);
        throw new PaymentException("Payment not found: " + paymentId, "PAYMENT_NOT_FOUND", 404);
    }

    private String createPaymentEventJson(String paymentId, PaymentRequest request, String status) {
        return String.format(
            "{\"paymentId\":\"%s\",\"userId\":\"%s\",\"amount\":%.2f,\"currency\":\"%s\",\"status\":\"%s\",\"timestamp\":%d}",
            paymentId, request.getUserId(), request.getAmount(), request.getCurrency(), status, System.currentTimeMillis()
        );
    }
}
