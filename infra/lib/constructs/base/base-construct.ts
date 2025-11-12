import { Construct } from 'constructs';
import { Tags } from 'aws-cdk-lib';

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
export abstract class BaseConstruct extends Construct {
  /** The deployment environment */
  protected readonly environment: string;
  /** The project name */
  protected readonly projectName: string;

  constructor(scope: Construct, id: string, props: BaseConstructProps) {
    super(scope, id);

    this.environment = props.environment;
    this.projectName = props.projectName;

    // Apply common tags to all resources in this construct
    this.applyCommonTags();

    // Validate construct configuration
    this.validateConfiguration();
  }

  /**
   * Applies common tags to all resources in this construct.
   * Follows DRY principle by centralizing tagging logic.
   */
  private applyCommonTags(): void {
    Tags.of(this).add('Environment', this.environment);
    Tags.of(this).add('Project', this.projectName);
    Tags.of(this).add('ManagedBy', 'CDK');
    Tags.of(this).add('CreatedAt', new Date().toISOString());
  }

  /**
   * Generates a standardized resource name following naming conventions.
   * Follows consistency principle for resource naming across environments.
   * Special handling for S3 buckets which require lowercase names.
   *
   * @param resourceType - The type of AWS resource (e.g., 'dynamodb', 'lambda')
   * @param resourceName - The specific resource name
   * @returns Standardized resource name
   */
  protected getResourceName(resourceType: string, resourceName: string): string {
    const baseName = `${this.projectName}-${this.environment}-${resourceType}-${resourceName}`;

    // S3 bucket names must be lowercase and follow specific rules
    if (resourceType === 's3') {
      return baseName.toLowerCase();
    }

    return baseName;
  }

  /**
   * Generates a standardized resource ID for CDK constructs.
   * Ensures unique and consistent naming within the stack.
   *
   * @param resourceType - The type of AWS resource
   * @param resourceName - The specific resource name
   * @returns Standardized resource ID
   */
  protected getResourceId(resourceType: string, resourceName: string): string {
    return `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}`;
  }

  /**
   * Validates the construct configuration.
   * Template method pattern - subclasses can override for specific validation.
   * Follows Fail Fast principle by validating early.
   */
  protected validateConfiguration(): void {
    if (!this.environment || this.environment.trim() === '') {
      throw new Error('Environment must be specified and non-empty');
    }

    if (!this.projectName || this.projectName.trim() === '') {
      throw new Error('Project name must be specified and non-empty');
    }

    // Validate environment name
    const validEnvironments = ['alpha', 'beta', 'prod'];
    if (validEnvironments.indexOf(this.environment.toLowerCase()) === -1) {
      throw new Error(`Invalid environment: ${this.environment}. Must be one of: ${validEnvironments.join(', ')}`);
    }
  }

  /**
   * Gets the environment-specific configuration.
   * Strategy pattern - different environments can have different configurations.
   *
   * @returns Environment-specific configuration object
   */
  protected getEnvironmentConfig(): Record<string, any> {
    const baseConfig = {
      projectName: this.projectName,
      environment: this.environment,
    };

    // Environment-specific configurations
    switch (this.environment.toLowerCase()) {
      case 'alpha':
        return {
          ...baseConfig,
          enableDetailedMonitoring: false,
          enableDeletionProtection: false,
          backupRetentionDays: 1,
        };

      case 'beta':
        return {
          ...baseConfig,
          enableDetailedMonitoring: true,
          enableDeletionProtection: false,
          backupRetentionDays: 7,
        };

      case 'prod':
        return {
          ...baseConfig,
          enableDetailedMonitoring: true,
          enableDeletionProtection: true,
          backupRetentionDays: 30,
        };

      default:
        return baseConfig;
    }
  }

  /**
   * Logs construct creation for debugging purposes.
   * Follows consistent logging pattern across all constructs.
   */
  protected logConstructCreation(): void {
    console.log(`Creating ${this.constructor.name} for ${this.projectName} in ${this.environment} environment`);
  }
}
