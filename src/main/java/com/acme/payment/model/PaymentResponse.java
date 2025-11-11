package com.acme.payment.model;

import lombok.Builder;
import lombok.Data;

/**
 * Represents a payment response containing the result of a payment operation.
 */
@Data
@Builder
public class PaymentResponse {
    /**
     * The unique identifier of the payment.
     */
    private String paymentId;

    /**
     * The status of the payment (e.g., "SUCCESS", "FAILED").
     */
    private String status;

    /**
     * The amount of the payment.
     */
    private double amount;

    /**
     * The currency of the payment.
     */
    private String currency;

    /**
     * The timestamp when the payment was processed.
     */
    private long timestamp;

    /**
     * The error message if the payment failed.
     */
    private String error;
}
