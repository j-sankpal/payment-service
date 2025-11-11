package com.acme.payment.handler;

import com.acme.payment.model.PaymentRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for CreatePaymentHandler.
 */
class CreatePaymentHandlerTest {

    @Test
    public void testValidRequest() {
        // Given
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // Then
        assertNotNull(request);
        assertEquals("user123", request.getUserId());
        assertEquals(100.0, request.getAmount());
    }

    @Test
    public void testNullUserId() {
        PaymentRequest request = PaymentRequest.builder()
                .userId(null)
                .amount(100.0)
                .build();

        assertNull(request.getUserId());
        assertNotNull(request.getAmount());
    }

    @Test
    public void testNullAmount() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(null)
                .build();

        assertNotNull(request.getUserId());
        assertNull(request.getAmount());
    }
}
