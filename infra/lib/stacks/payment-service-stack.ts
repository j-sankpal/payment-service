import { Stack, StackProps, CfnOutput, Environment } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StorageStack, StorageStackProps } from '../constructs/storage/storage-stack';
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
export class PaymentServiceStack extends Stack {
  /** Storage layer interface for dependency injection */
  public readonly storage: IStorage;

  constructor(scope: Construct, id: string, props: PaymentServiceStackProps) {
    super(scope, id, props);

    const { environment } = props;
    const projectName = 'PaymentService';

    // Create storage layer
    const storageStack = new StorageStack(this, 'Storage', {
      environment,
      projectName,
      tableConfig: {
        tableName: 'payments',
        partitionKey: 'id',
        sortKey: 'timestamp',
      },
      bucketConfig: {
        bucketName: 'receipts',
        enableVersioning: environment !== 'alpha',
      },
    });
    this.storage = storageStack;

    // TODO: Create messaging layer
    // TODO: Create API layer
    // TODO: Create monitoring layer

    // Create CloudFormation outputs for external references
    this.createOutputs();
  }

  /**
   * Creates CloudFormation outputs for stack references.
   * Follows Infrastructure as Code best practices for cross-stack references.
   */
  private createOutputs(): void {
    const stackName = this.getStackName();

    new CfnOutput(this, 'TableName', {
      value: this.storage.getTableName(),
      description: 'DynamoDB table name for payments',
      exportName: `${stackName}-TableName`,
    });

    new CfnOutput(this, 'BucketName', {
      value: this.storage.getBucketName(),
      description: 'S3 bucket name for receipts',
      exportName: `${stackName}-BucketName`,
    });

    new CfnOutput(this, 'TableArn', {
      value: this.storage.table.tableArn,
      description: 'DynamoDB table ARN',
      exportName: `${stackName}-TableArn`,
    });

    new CfnOutput(this, 'BucketArn', {
      value: this.storage.bucket.bucketArn,
      description: 'S3 bucket ARN',
      exportName: `${stackName}-BucketArn`,
    });
  }

  /**
   * Gets the stack name for consistent naming across outputs.
   * Uses CDK's built-in stack name property.
   */
  private getStackName(): string {
    return this.stackName || 'PaymentServiceStack';
  }
}
