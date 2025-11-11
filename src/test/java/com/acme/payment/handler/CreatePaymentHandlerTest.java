package com.acme.payment.handler;

import com.acme.payment.model.PaymentException;
import com.acme.payment.model.PaymentRequest;
import com.acme.payment.util.PaymentValidator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for CreatePaymentHandler.
 */
class CreatePaymentHandlerTest {

    @Test
    public void testValidRequest() {
        // Given: A valid payment request with all required fields
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: The request is created
        // Then: All fields should be set correctly
        assertNotNull(request);
        assertEquals("user123", request.getUserId());
        assertEquals(100.0, request.getAmount());
        assertEquals("USD", request.getCurrency());
        assertEquals("key123", request.getIdempotencyKey());
    }

    @Test
    public void testNullUserId() {
        // Given: A payment request with null userId
        PaymentRequest request = PaymentRequest.builder()
                .userId(null)
                .amount(100.0)
                .build();

        // When: The request is created
        // Then: userId should be null but amount should be set
        assertNull(request.getUserId());
        assertNotNull(request.getAmount());
        assertEquals(100.0, request.getAmount());
    }

    @Test
    public void testNullAmount() {
        // Given: A payment request with null amount
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(null)
                .build();

        // When: The request is created
        // Then: amount should be null but userId should be set
        assertNotNull(request.getUserId());
        assertEquals("user123", request.getUserId());
        assertNull(request.getAmount());
    }


}
