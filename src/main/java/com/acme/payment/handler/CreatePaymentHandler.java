package com.acme.payment.handler;

import com.acme.payment.config.PaymentComponent;
import com.acme.payment.model.PaymentRequest;
import com.acme.payment.model.PaymentResponse;
import com.acme.payment.service.PaymentService;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * AWS Lambda handler for creating payments.
 * Handles API Gateway requests to process payment creation.
 */
public class CreatePaymentHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final Logger log = LoggerFactory.getLogger(CreatePaymentHandler.class);
    private static final Gson gson = new Gson();

    private final PaymentService paymentService;

    public CreatePaymentHandler() {
        // Initialize Dagger component
        PaymentComponent component = PaymentComponent.create();
        this.paymentService = component.paymentService();
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent event, Context context) {

        log.info("CreatePaymentHandler invoked");

        try {
            // Parse request
            String body = event.getBody();
            PaymentRequest request = gson.fromJson(body, PaymentRequest.class);

            // RISK: No validation on request fields
            if (request.getUserId() == null || request.getAmount() == null) {
                return errorResponse(400, "Missing required fields");
            }

            // Process payment
            PaymentResponse response = paymentService.createPayment(request);

            // Return response
            return successResponse(201, response);

        } catch (Exception e) {
            log.error("Error processing payment", e);
            return errorResponse(500, e.getMessage());
        }
    }

    private APIGatewayProxyResponseEvent successResponse(int statusCode, PaymentResponse body) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(statusCode);
        response.setBody(gson.toJson(body));
        response.setHeaders(Map.of("Content-Type", "application/json"));
        return response;
    }

    private APIGatewayProxyResponseEvent errorResponse(int statusCode, String message) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(statusCode);
        response.setBody(gson.toJson(Map.of("error", message)));
        response.setHeaders(Map.of("Content-Type", "application/json"));
        return response;
    }
}
