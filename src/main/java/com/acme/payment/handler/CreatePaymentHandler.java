package com.acme.payment.handler;

import com.acme.payment.config.PaymentComponent;
import com.acme.payment.model.PaymentException;
import com.acme.payment.model.PaymentRequest;
import com.acme.payment.model.PaymentResponse;
import com.acme.payment.service.PaymentService;
import com.acme.payment.util.PaymentValidator;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
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

        log.info("CreatePaymentHandler invoked with request ID: {}",
                context != null ? context.getAwsRequestId() : "unknown");

        try {
            // Validate input
            if (event == null) {
                log.warn("Received null event");
                return errorResponse(400, "Invalid request: event is null");
            }

            String body = event.getBody();
            if (body == null || body.trim().isEmpty()) {
                log.warn("Received empty request body");
                return errorResponse(400, "Request body is required");
            }

            // Parse JSON request
            PaymentRequest request;
            try {
                request = gson.fromJson(body, PaymentRequest.class);
                log.debug("Parsed payment request for user: {}", request.getUserId());
            } catch (JsonSyntaxException e) {
                log.warn("Invalid JSON in request body: {}", e.getMessage());
                return errorResponse(400, "Invalid JSON format in request body");
            }

            // Validate payment request
            try {
                PaymentValidator.validatePaymentRequest(request);
            } catch (PaymentException e) {
                log.warn("Payment validation failed: {}", e.getMessage());
                return errorResponse(e.getHttpStatus(), e.getMessage());
            }

            // Process payment
            PaymentResponse response = paymentService.createPayment(request);
            log.info("Successfully created payment: {}", response.getPaymentId());

            // Return response
            return successResponse(201, response);

        } catch (PaymentException e) {
            log.error("Payment business logic error: {}", e.getMessage(), e);
            return errorResponse(e.getHttpStatus(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error processing payment request", e);
            return errorResponse(500, "Internal server error");
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
