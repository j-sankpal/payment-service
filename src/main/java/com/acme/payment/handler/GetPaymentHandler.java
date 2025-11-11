package com.acme.payment.handler;

import com.acme.payment.config.PaymentComponent;
import com.acme.payment.model.PaymentException;
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
 * AWS Lambda handler for retrieving payments.
 * Handles API Gateway requests to fetch payment details by ID.
 */
public class GetPaymentHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final Logger log = LoggerFactory.getLogger(GetPaymentHandler.class);
    private static final Gson gson = new Gson();

    private final PaymentService paymentService;

    public GetPaymentHandler() {
        PaymentComponent component = PaymentComponent.create();
        this.paymentService = component.paymentService();
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent event, Context context) {

        log.info("GetPaymentHandler invoked with request ID: {}",
                context != null ? context.getAwsRequestId() : "unknown");

        try {
            // Validate input
            if (event == null) {
                log.warn("Received null event");
                return errorResponse(400, "Invalid request: event is null");
            }

            Map<String, String> pathParameters = event.getPathParameters();
            if (pathParameters == null) {
                log.warn("No path parameters provided");
                return errorResponse(400, "Missing path parameters");
            }

            // Extract paymentId from path
            String paymentId = pathParameters.get("paymentId");
            if (paymentId == null || paymentId.trim().isEmpty()) {
                log.warn("Missing paymentId in path parameters");
                return errorResponse(400, "Missing paymentId parameter");
            }

            // Get payment (this will throw PaymentException if not found)
            PaymentResponse response = paymentService.getPayment(paymentId);
            log.info("Successfully retrieved payment: {}", paymentId);

            return successResponse(200, response);

        } catch (PaymentException e) {
            log.warn("Payment retrieval failed: {}", e.getMessage());
            return errorResponse(e.getHttpStatus(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error retrieving payment", e);
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
