package com.acme.payment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

@Singleton
public class ReceiptService {

    private static final Logger log = LoggerFactory.getLogger(ReceiptService.class);

    private final S3Client s3Client;
    private final String receiptsBucketName;

    @Inject
    public ReceiptService(
            S3Client s3Client,
            @Named("ReceiptsBucketName") String receiptsBucketName) {
        this.s3Client = s3Client;
        this.receiptsBucketName = receiptsBucketName;
    }

    /**
     * Generate receipt and store in S3
     *
     * INTENTIONAL RISKS (for BlindSpot):
     * 1. S3 bucket might be public (no validation in code)
     * 2. No error handling if S3 upload fails
     * 3. No retry logic on S3 failures
     * 4. No encryption validation on S3 objects
     * 5. No validation that bucket exists
     */
    public void generateReceipt(String paymentId, String userId) {
        log.info("Generating receipt for payment: {}", paymentId);

        try {
            String receiptJson = createReceiptJson(paymentId, userId);
            String key = String.format("receipts/%s/%s.json", userId, paymentId);

            // Upload to S3 (RISK: no encryption validation)
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket(receiptsBucketName)
                    .key(key)
                    .build(),
                    RequestBody.fromString(receiptJson));

            log.info("Receipt stored in S3: s3://{}/{}", receiptsBucketName, key);

        } catch (Exception e) {
            log.error("Failed to generate receipt for payment: {}", paymentId, e);
            // RISK: Silent failure - no retry
        }
    }

    private String createReceiptJson(String paymentId, String userId) {
        return String.format(
            "{\"paymentId\":\"%s\",\"userId\":\"%s\",\"timestamp\":%d}",
            paymentId, userId, System.currentTimeMillis()
        );
    }
}
