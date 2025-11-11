package com.acme.payment.util;

import com.acme.payment.model.PaymentException;
import com.acme.payment.model.PaymentRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for PaymentValidator.
 */
class PaymentValidatorTest {

    @Test
    public void testValidatePaymentRequestValid() {
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
    public void testValidatePaymentRequestNullRequest() {
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(null));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("cannot be null"));
    }

    @Test
    public void testValidatePaymentRequestNullUserId() {
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
    public void testValidatePaymentRequestEmptyUserId() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("")
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
    public void testValidatePaymentRequestWhitespaceUserId() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("   ")
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
    public void testValidatePaymentRequestZeroAmount() {
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
    public void testValidatePaymentRequestNegativeAmount() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(-50.0)
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
    public void testValidatePaymentRequestAmountTooHigh() {
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

    @Test
    public void testValidatePaymentRequestInvalidCurrency() {
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
    public void testValidatePaymentRequestCurrencyWithSpaces() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency(" usd ")
                .idempotencyKey("key123")
                .build();

        // Should not throw exception - currency gets trimmed and uppercased
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentRequest(request));
    }

    @Test
    public void testValidatePaymentRequestLowercaseCurrency() {
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("usd")
                .idempotencyKey("key123")
                .build();

        // Should not throw exception - currency gets uppercased
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentRequest(request));
    }

    @Test
    public void testValidatePaymentIdValid() {
        String validUuid = "12345678-1234-1234-1234-123456789abc";
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentId(validUuid));
    }

    @Test
    public void testValidatePaymentIdValidUppercase() {
        String validUuid = "12345678-1234-1234-1234-123456789ABC";
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentId(validUuid));
    }

    @Test
    public void testValidatePaymentIdNull() {
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId(null));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Payment ID is required"));
    }

    @Test
    public void testValidatePaymentIdEmpty() {
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId(""));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Payment ID is required"));
    }

    @Test
    public void testValidatePaymentIdInvalidFormat() {
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId("invalid-uuid"));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Invalid payment ID format"));
    }

    @Test
    public void testValidatePaymentIdTooShort() {
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId("12345678-1234-1234-1234-123456789ab"));

        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Invalid payment ID format"));
    }
}
