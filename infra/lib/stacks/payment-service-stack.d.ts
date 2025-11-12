import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IStorage } from '../interfaces/i-storage';
/**
 * Properties for PaymentServiceStack.
 * Extends standard StackProps with environment-specific configuration.
 */
export interface PaymentServiceStackProps extends StackProps {
    /** Deployment environment (alpha, beta, prod) */
    readonly environment: string;
}
/**
 * Main payment service stack following Composition Root pattern.
 * Acts as the entry point for all infrastructure components.
 * Follows Dependency Inversion Principle by depending on abstractions.
 */
export declare class PaymentServiceStack extends Stack {
    /** Storage layer interface for dependency injection */
    readonly storage: IStorage;
    constructor(scope: Construct, id: string, props: PaymentServiceStackProps);
    /**
     * Creates CloudFormation outputs for stack references.
     * Follows Infrastructure as Code best practices for cross-stack references.
     */
    private createOutputs;
    /**
     * Gets the stack name for consistent naming across outputs.
     * Uses CDK's built-in stack name property.
     */
    private getStackName;
}
