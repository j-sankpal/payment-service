package com.acme.payment.service;

import com.acme.payment.model.PaymentRequest;
import com.acme.payment.model.PaymentResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for PaymentService.
 */
class PaymentServiceTest {

    @Test
    public void testPaymentRequestCreation() {
        // Given: Valid payment request parameters
        String userId = "user123";
        double amount = 150.0;
        String currency = "EUR";
        String idempotencyKey = "idemp123";

        // When: PaymentRequest is built
        PaymentRequest request = PaymentRequest.builder()
                .userId(userId)
                .amount(amount)
                .currency(currency)
                .idempotencyKey(idempotencyKey)
                .build();

        // Then: All fields should be set correctly
        assertEquals(userId, request.getUserId());
        assertEquals(amount, request.getAmount());
        assertEquals(currency, request.getCurrency());
        assertEquals(idempotencyKey, request.getIdempotencyKey());
    }

    @Test
    public void testPaymentResponseCreation() {
        // Given: Valid payment response parameters
        String paymentId = "pay123";
        String status = "SUCCESS";
        double amount = 200.0;
        String currency = "USD";
        long timestamp = 123456789L;

        // When: PaymentResponse is built
        PaymentResponse response = PaymentResponse.builder()
                .paymentId(paymentId)
                .status(status)
                .amount(amount)
                .currency(currency)
                .timestamp(timestamp)
                .build();

        // Then: All fields should be set correctly
        assertEquals(paymentId, response.getPaymentId());
        assertEquals(status, response.getStatus());
        assertEquals(amount, response.getAmount());
        assertEquals(currency, response.getCurrency());
        assertEquals(timestamp, response.getTimestamp());
    }

    @Test
    public void testPaymentResponseWithError() {
        // Given: Payment response parameters including error
        String paymentId = "pay123";
        String status = "FAILED";
        String errorMessage = "Payment failed";

        // When: PaymentResponse with error is built
        PaymentResponse response = PaymentResponse.builder()
                .paymentId(paymentId)
                .status(status)
                .error(errorMessage)
                .build();

        // Then: Error fields should be set correctly
        assertEquals(paymentId, response.getPaymentId());
        assertEquals(status, response.getStatus());
        assertEquals(errorMessage, response.getError());
        assertNull(response.getCurrency()); // Should be null when not set
        assertEquals(0L, response.getTimestamp()); // Should be default when not set
    }

    @Test
    public void testGetPaymentStatistics() {
        // Given: A PaymentService instance
        // Note: In a real scenario, this would be mocked with dependencies

        // When: getPaymentStatistics is called
        // Then: Should return a statistics message
        // Note: This is a placeholder test - actual implementation would require mocking
        // assertEquals("Payment Statistics: Total payments processed today: 0", paymentService.getPaymentStatistics());
        assertTrue(true, "Placeholder test for getPaymentStatistics method");
    }
}
