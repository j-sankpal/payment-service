package com.acme.payment.model;

import lombok.Getter;

/**
 * Custom exception for payment-related errors.
 */
@Getter
public class PaymentException extends RuntimeException {

    private final String errorCode;
    private final int httpStatus;

    public PaymentException(String message) {
        super(message);
        this.errorCode = "PAYMENT_ERROR";
        this.httpStatus = 500;
    }

    public PaymentException(String message, String errorCode, int httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public PaymentException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "PAYMENT_ERROR";
        this.httpStatus = 500;
    }
}
