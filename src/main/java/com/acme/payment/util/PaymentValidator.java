package com.acme.payment.util;

import com.acme.payment.model.PaymentException;
import com.acme.payment.model.PaymentRequest;

/**
 * Utility class for payment validation.
 */
public class PaymentValidator {

    /**
     * Validates a payment request.
     *
     * @param request the payment request to validate
     * @throws PaymentException if validation fails
     */
    public static void validatePaymentRequest(PaymentRequest request) {
        if (request == null) {
            throw new PaymentException("Payment request cannot be null", "VALIDATION_ERROR", 400);
        }

        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            throw new PaymentException("User ID is required", "VALIDATION_ERROR", 400);
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new PaymentException("Amount must be greater than zero", "VALIDATION_ERROR", 400);
        }

        if (request.getAmount() > 10000) {
            throw new PaymentException("Amount cannot exceed $10,000", "VALIDATION_ERROR", 400);
        }

        String currency = request.getCurrency();
        if (currency == null || currency.trim().isEmpty()) {
            throw new PaymentException("Currency is required", "VALIDATION_ERROR", 400);
        }

        // Normalize currency: trim and uppercase
        currency = currency.trim().toUpperCase();

        // Validate currency format (should be 3 uppercase letters)
        if (!currency.matches("^[A-Z]{3}$")) {
            throw new PaymentException("Currency must be a valid 3-letter code (e.g., USD, EUR)",
                                     "VALIDATION_ERROR", 400);
        }

        if (request.getIdempotencyKey() == null || request.getIdempotencyKey().trim().isEmpty()) {
            throw new PaymentException("Idempotency key is required", "VALIDATION_ERROR", 400);
        }
    }

    /**
     * Validates a payment ID format.
     *
     * @param paymentId the payment ID to validate
     * @throws PaymentException if validation fails
     */
    public static void validatePaymentId(String paymentId) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            throw new PaymentException("Payment ID is required", "VALIDATION_ERROR", 400);
        }

        // UUID format validation (allows both uppercase and lowercase hex)
        if (!paymentId.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
            throw new PaymentException("Invalid payment ID format", "VALIDATION_ERROR", 400);
        }
    }
}
