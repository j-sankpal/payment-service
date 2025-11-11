package com.acme.payment.handler;

import com.acme.payment.config.PaymentComponent;
import com.acme.payment.model.PaymentEvent;
import com.acme.payment.service.PaymentService;
import com.acme.payment.service.ReceiptService;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSBatchResponse;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * AWS Lambda handler for processing payment events from SQS.
 * Updates payment status and generates receipts for successful payments.
 */
public class ProcessPaymentEventHandler implements RequestHandler<SQSEvent, SQSBatchResponse> {

    private static final Logger log = LoggerFactory.getLogger(ProcessPaymentEventHandler.class);
    private static final Gson gson = new Gson();

    private final PaymentService paymentService;
    private final ReceiptService receiptService;

    public ProcessPaymentEventHandler() {
        PaymentComponent component = PaymentComponent.create();
        this.paymentService = component.paymentService();
        this.receiptService = component.receiptService();
    }

    @Override
    public SQSBatchResponse handleRequest(SQSEvent event, Context context) {

        log.info("ProcessPaymentEventHandler invoked with {} messages", event.getRecords().size());

        SQSBatchResponse batchResponse = new SQSBatchResponse();
        List<SQSBatchResponse.BatchItemFailure> batchResultErrorEntries = new ArrayList<>();

        for (SQSMessage message : event.getRecords()) {
            try {
                log.info("Processing message: {}", message.getMessageId());

                // Parse payment event
                PaymentEvent paymentEvent = gson.fromJson(message.getBody(), PaymentEvent.class);

                // Update payment status to SUCCESS
                // TODO: Update DynamoDB with status=SUCCESS

                // Generate receipt
                receiptService.generateReceipt(paymentEvent.getPaymentId(), paymentEvent.getUserId());

                log.info("Successfully processed payment: {}", paymentEvent.getPaymentId());

            } catch (Exception e) {
                log.error("Failed to process message: {}", message.getMessageId(), e);

                // Mark as failed - goes to DLQ
                SQSBatchResponse.BatchItemFailure errorEntry = new SQSBatchResponse.BatchItemFailure(message.getMessageId());
                batchResultErrorEntries.add(errorEntry);
            }
        }

        batchResponse.setBatchItemFailures(batchResultErrorEntries);
        return batchResponse;
    }
}
