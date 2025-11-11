package com.acme.payment.handler;

import com.acme.payment.config.PaymentComponent;
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

        log.info("GetPaymentHandler invoked");

        try {
            // Extract paymentId from path
            String paymentId = event.getPathParameters().get("paymentId");

            if (paymentId == null || paymentId.isEmpty()) {
                return errorResponse(400, "Missing paymentId");
            }

            // Get payment
            PaymentResponse response = paymentService.getPayment(paymentId);

            if (response.getPaymentId() == null) {
                return errorResponse(404, "Payment not found");
            }

            return successResponse(200, response);

        } catch (Exception e) {
            log.error("Error fetching payment", e);
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
