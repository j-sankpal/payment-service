import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Function } from 'aws-cdk-lib/aws-lambda';

/**
 * API interface following Interface Segregation Principle.
 * Defines only the API-related capabilities that clients need.
 */
export interface IApi {
  /** API Gateway REST API */
  readonly api: RestApi;

  /** Lambda functions deployed by this API construct */
  readonly functions: Function[];

  /**
   * Adds an endpoint to the API Gateway.
   * Follows Command pattern by encapsulating endpoint creation logic.
   *
   * @param path - The API path (e.g., '/payments')
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param handler - Lambda function to handle requests
   */
  addEndpoint(path: string, method: string, handler: Function): void;

  /**
   * Gets the API Gateway URL for the deployed API.
   * Useful for cross-stack references and testing.
   *
   * @returns The API Gateway URL
   */
  getApiUrl(): string;
}
