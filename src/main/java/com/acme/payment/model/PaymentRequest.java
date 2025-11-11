package com.acme.payment.model;

import lombok.Builder;
import lombok.Data;

/**
 * Represents a payment request containing user and payment details.
 */
@Data
@Builder
public class PaymentRequest {
    /**
     * The unique identifier of the user making the payment.
     */
    private String userId;

    /**
     * The amount of the payment.
     */
    private Double amount;

    /**
     * The currency of the payment (e.g., "USD").
     */
    private String currency;

    /**
     * The idempotency key to ensure the payment is processed only once.
     */
    private String idempotencyKey;
}
