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
        // Given: A valid payment request with all required fields properly set
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        // Then: No exception should be thrown
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentRequest(request));
    }

    @Test
    public void testValidatePaymentRequestNullRequest() {
        // Given: A null payment request
        PaymentRequest request = null;

        // When: Payment request validation is attempted
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with appropriate error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("cannot be null"));
    }

    @Test
    public void testValidatePaymentRequestNullUserId() {
        // Given: A payment request with null userId
        PaymentRequest request = PaymentRequest.builder()
                .userId(null)
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with userId error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("User ID is required"));
    }

    @Test
    public void testValidatePaymentRequestEmptyUserId() {
        // Given: A payment request with empty userId string
        PaymentRequest request = PaymentRequest.builder()
                .userId("")
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with userId error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("User ID is required"));
    }

    @Test
    public void testValidatePaymentRequestWhitespaceUserId() {
        // Given: A payment request with whitespace-only userId
        PaymentRequest request = PaymentRequest.builder()
                .userId("   ")
                .amount(100.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with userId error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("User ID is required"));
    }

    @Test
    public void testValidatePaymentRequestZeroAmount() {
        // Given: A payment request with zero amount
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(0.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with amount error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("must be greater than zero"));
    }

    @Test
    public void testValidatePaymentRequestNegativeAmount() {
        // Given: A payment request with negative amount
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(-50.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with amount error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("must be greater than zero"));
    }

    @Test
    public void testValidatePaymentRequestAmountTooHigh() {
        // Given: A payment request with amount exceeding limit
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(15000.0)
                .currency("USD")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with amount limit error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("cannot exceed"));
    }

    @Test
    public void testValidatePaymentRequestInvalidCurrency() {
        // Given: A payment request with invalid currency format
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("INVALID")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentRequest(request));

        // Then: Validation should fail with currency format error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Currency must be a valid 3-letter code"));
    }

    @Test
    public void testValidatePaymentRequestCurrencyWithSpaces() {
        // Given: A payment request with currency containing spaces
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency(" usd ")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        // Then: Validation should pass (currency gets trimmed and uppercased)
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentRequest(request));
    }

    @Test
    public void testValidatePaymentRequestLowercaseCurrency() {
        // Given: A payment request with lowercase currency
        PaymentRequest request = PaymentRequest.builder()
                .userId("user123")
                .amount(100.0)
                .currency("usd")
                .idempotencyKey("key123")
                .build();

        // When: Payment request validation is performed
        // Then: Validation should pass (currency gets uppercased)
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentRequest(request));
    }

    @Test
    public void testValidatePaymentIdValid() {
        // Given: A valid lowercase UUID string
        String validUuid = "12345678-1234-1234-1234-123456789abc";

        // When: Payment ID validation is performed
        // Then: No exception should be thrown
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentId(validUuid));
    }

    @Test
    public void testValidatePaymentIdValidUppercase() {
        // Given: A valid uppercase UUID string
        String validUuid = "12345678-1234-1234-1234-123456789ABC";

        // When: Payment ID validation is performed
        // Then: No exception should be thrown
        assertDoesNotThrow(() -> PaymentValidator.validatePaymentId(validUuid));
    }

    @Test
    public void testValidatePaymentIdNull() {
        // Given: A null payment ID
        String paymentId = null;

        // When: Payment ID validation is attempted
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId(paymentId));

        // Then: Validation should fail with appropriate error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Payment ID is required"));
    }

    @Test
    public void testValidatePaymentIdEmpty() {
        // Given: An empty payment ID string
        String paymentId = "";

        // When: Payment ID validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId(paymentId));

        // Then: Validation should fail with required field error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Payment ID is required"));
    }

    @Test
    public void testValidatePaymentIdInvalidFormat() {
        // Given: An invalid UUID format string
        String paymentId = "invalid-uuid";

        // When: Payment ID validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId(paymentId));

        // Then: Validation should fail with format error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Invalid payment ID format"));
    }

    @Test
    public void testValidatePaymentIdTooShort() {
        // Given: A UUID string that is too short
        String paymentId = "12345678-1234-1234-1234-123456789ab";

        // When: Payment ID validation is performed
        PaymentException exception = assertThrows(PaymentException.class,
                () -> PaymentValidator.validatePaymentId(paymentId));

        // Then: Validation should fail with format error
        assertEquals("VALIDATION_ERROR", exception.getErrorCode());
        assertEquals(400, exception.getHttpStatus());
        assertTrue(exception.getMessage().contains("Invalid payment ID format"));
    }
}
