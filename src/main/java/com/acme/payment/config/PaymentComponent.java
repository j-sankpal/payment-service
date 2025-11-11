package com.acme.payment.config;

import com.acme.payment.service.IdempotencyService;
import com.acme.payment.service.PaymentService;
import com.acme.payment.service.ReceiptService;
import dagger.Component;
import javax.inject.Singleton;

@Singleton
@Component(modules = AwsModule.class)
public interface PaymentComponent {

    PaymentService paymentService();
    ReceiptService receiptService();
    IdempotencyService idempotencyService();

    static PaymentComponent create() {
        return DaggerPaymentComponent.create();
    }
}
