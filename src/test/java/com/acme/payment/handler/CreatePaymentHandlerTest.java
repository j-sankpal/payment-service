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

    @Test
    public void testPaymentValidatorValidRequest() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // Should not throw exception
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentRequest(request));
    }

    @Test
    public void testPaymentValidatorNullRequest() {
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(null));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("cannot be null"));
    }

    @Test
    public void testPaymentValidatorNullUserId() {
        PaymentRequest request = PaymentRequest.builder()
                .userId(null)
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("User ID is required"));
    }

    @Test
    public void testPaymentValidatorZeroAmount() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(0.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("must be greater than zero"));
    }

    @Test
    public void testPaymentValidatorInvalidCurrency() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("INVALID")
                .idempotencyKey("key123")
                .build();

        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Currency must be a valid 3-letter code"));
    }

    @Test
    public void testPaymentValidatorAmountTooHigh() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(15000.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("cannot exceed"));
    }
}
