package com.acme.payment.config;

import dagger.Module;
import dagger.Provides;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sqs.SqsClient;

import javax.inject.Named;
import javax.inject.Singleton;
import java.net.URI;

@Module
public class AwsModule {

    @Provides
    @Singleton
    public DynamoDbEnhancedClient provideDynamoDbClient() {
        String endpoint = System.getenv("DYNAMODB_ENDPOINT");
        if (endpoint != null && !endpoint.isEmpty()) {
            return DynamoDbEnhancedClient.builder()
                    .dynamoDbClient(DynamoDbClient.builder()
                            .endpointOverride(URI.create(endpoint))
                            .region(Region.US_EAST_1)
                            .build())
                    .build();
        }
        return DynamoDbEnhancedClient.builder().build();
    }

    @Provides
    @Singleton
    public SqsClient provideSqsClient() {
        String endpoint = System.getenv("SQS_ENDPOINT");
        if (endpoint != null && !endpoint.isEmpty()) {
            return SqsClient.builder()
                    .endpointOverride(URI.create(endpoint))
                    .region(Region.US_EAST_1)
                    .build();
        }
        return SqsClient.builder().build();
    }

    @Provides
    @Singleton
    public SnsClient provideSnsClient() {
        String endpoint = System.getenv("SNS_ENDPOINT");
        if (endpoint != null && !endpoint.isEmpty()) {
            return SnsClient.builder()
                    .endpointOverride(URI.create(endpoint))
                    .region(Region.US_EAST_1)
                    .build();
        }
        return SnsClient.builder().build();
    }

    @Provides
    @Singleton
    public S3Client provideS3Client() {
        String endpoint = System.getenv("S3_ENDPOINT");
        if (endpoint != null && !endpoint.isEmpty()) {
            return S3Client.builder()
                    .endpointOverride(URI.create(endpoint))
                    .region(Region.US_EAST_1)
                    .build();
        }
        return S3Client.builder().build();
    }

    @Provides
    @Named("PaymentsTableName")
    public String providePaymentsTableName() {
        return System.getenv("PAYMENTS_TABLE_NAME");
    }

    @Provides
    @Named("PaymentEventsTopicArn")
    public String providePaymentEventsTopicArn() {
        return System.getenv("PAYMENT_EVENTS_TOPIC_ARN");
    }

    @Provides
    @Named("PaymentQueueUrl")
    public String providePaymentQueueUrl() {
        return System.getenv("PAYMENT_QUEUE_URL");
    }

    @Provides
    @Named("ReceiptsBucketName")
    public String provideReceiptsBucketName() {
        return System.getenv("PAYMENT_RECEIPTS_BUCKET_NAME");
    }
}
