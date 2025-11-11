package com.acme.payment.model;

import lombok.Builder;
import lombok.Data;

/**
 * Represents a payment event for processing payment updates.
 */
@Data
@Builder
public class PaymentEvent {
    /**
     * The unique identifier of the payment.
     */
    private String paymentId;

    /**
     * The unique identifier of the user.
     */
    private String userId;

    /**
     * The amount of the payment.
     */
    private double amount;

    /**
     * The currency of the payment.
     */
    private String currency;

    /**
     * The status of the payment.
     */
    private String status;

    /**
     * The timestamp of the event.
     */
    private long timestamp;
}
