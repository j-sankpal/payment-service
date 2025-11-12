import { Construct } from 'constructs';
/**
 * Base construct properties that all constructs should extend.
 * Follows Interface Segregation Principle by providing only essential properties.
 */
export interface BaseConstructProps {
    /** The deployment environment (alpha, beta, prod) */
    readonly environment: string;
    /** The project name for resource naming */
    readonly projectName: string;
}
/**
 * Abstract base construct that provides common functionality for all CDK constructs.
 * Follows Single Responsibility Principle by handling only common construct concerns.
 * Follows Open/Closed Principle by allowing extension through inheritance.
 */
export declare abstract class BaseConstruct extends Construct {
    /** The deployment environment */
    protected readonly environment: string;
    /** The project name */
    protected readonly projectName: string;
    constructor(scope: Construct, id: string, props: BaseConstructProps);
    /**
     * Applies common tags to all resources in this construct.
     * Follows DRY principle by centralizing tagging logic.
     */
    private applyCommonTags;
    /**
     * Generates a standardized resource name following naming conventions.
     * Follows consistency principle for resource naming across environments.
     *
     * @param resourceType - The type of AWS resource (e.g., 'dynamodb', 'lambda')
     * @param resourceName - The specific resource name
     * @returns Standardized resource name
     */
    protected getResourceName(resourceType: string, resourceName: string): string;
    /**
     * Generates a standardized resource ID for CDK constructs.
     * Ensures unique and consistent naming within the stack.
     *
     * @param resourceType - The type of AWS resource
     * @param resourceName - The specific resource name
     * @returns Standardized resource ID
     */
    protected getResourceId(resourceType: string, resourceName: string): string;
    /**
     * Validates the construct configuration.
     * Template method pattern - subclasses can override for specific validation.
     * Follows Fail Fast principle by validating early.
     */
    protected validateConfiguration(): void;
    /**
     * Gets the environment-specific configuration.
     * Strategy pattern - different environments can have different configurations.
     *
     * @returns Environment-specific configuration object
     */
    protected getEnvironmentConfig(): Record<string, any>;
    /**
     * Logs construct creation for debugging purposes.
     * Follows consistent logging pattern across all constructs.
     */
    protected logConstructCreation(): void;
}
