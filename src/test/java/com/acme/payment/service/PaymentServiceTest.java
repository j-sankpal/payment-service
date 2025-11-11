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
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(150.0)
                .currency("EUR")
                .idempotencyKey("idemp123")
                .build();

        assertEquals("user123", request.getUserId());
        assertEquals(150.0, request.getAmount());
        assertEquals("EUR", request.getCurrency());
        assertEquals("idemp123", request.getIdempotencyKey());
    }

    @Test
    public void testPaymentResponseCreation() {
        PaymentResponse response = PaymentResponse.builder()
                .paymentId("pay123")
                .status("SUCCESS")
                .amount(200.0)
                .currency("USD")
                .timestamp(123456789L)
                .build();

        assertEquals("pay123", response.getPaymentId());
        assertEquals("SUCCESS", response.getStatus());
        assertEquals(200.0, response.getAmount());
        assertEquals("USD", response.getCurrency());
        assertEquals(123456789L, response.getTimestamp());
    }

    @Test
    public void testPaymentResponseWithError() {
        PaymentResponse response = PaymentResponse.builder()
                .paymentId("pay123")
                .status("FAILED")
                .error("Payment failed")
                .build();

        assertEquals("pay123", response.getPaymentId());
        assertEquals("FAILED", response.getStatus());
        assertEquals("Payment failed", response.getError());
    }
}
