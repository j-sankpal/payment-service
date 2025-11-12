import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, StreamViewType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { BaseConstruct, BaseConstructProps } from '../base/base-construct';

/**
 * Properties for DynamoDB table construct.
 * Extends base construct props with table-specific configuration.
 */
export interface DynamoDbTableProps extends BaseConstructProps {
  /** Table name suffix */
  readonly tableName: string;
  /** Partition key name */
  readonly partitionKey: string;
  /** Sort key name (optional) */
  readonly sortKey?: string;
}

/**
 * DynamoDB table construct following Single Responsibility Principle.
 * Handles only DynamoDB table creation and configuration.
 */
export class DynamoDbTable extends BaseConstruct {
  /** The DynamoDB table */
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: DynamoDbTableProps) {
    super(scope, id, props);

    this.logConstructCreation();

    // Create DynamoDB table with environment-specific configuration
    this.table = new Table(this, this.getResourceId('dynamodb', 'table'), {
      tableName: this.getResourceName('dynamodb', props.tableName),
      partitionKey: {
        name: props.partitionKey,
        type: AttributeType.STRING,
      },
      sortKey: props.sortKey ? {
        name: props.sortKey,
        type: AttributeType.STRING,
      } : undefined,
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      removalPolicy: this.getRemovalPolicy(),
      pointInTimeRecovery: this.shouldEnablePointInTimeRecovery(),
      stream: this.shouldEnableStreams() ? StreamViewType.NEW_AND_OLD_IMAGES : undefined,
    });

    // Add Global Secondary Index for status-based queries
    this.table.addGlobalSecondaryIndex({
      indexName: 'StatusIndex',
      partitionKey: {
        name: 'status',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt', // Use different name to avoid conflict
        type: AttributeType.NUMBER,
      },
    });
  }

  /**
   * Determines the removal policy based on environment.
   * Alpha: Destroy (cost-effective), Beta/Prod: Retain (data safety)
   */
  private getRemovalPolicy(): RemovalPolicy {
    return this.environment === 'alpha' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN;
  }

  /**
   * Determines if point-in-time recovery should be enabled.
   * Only enabled for production environment.
   */
  private shouldEnablePointInTimeRecovery(): boolean {
    return this.environment === 'prod';
  }

  /**
   * Determines if DynamoDB streams should be enabled.
   * Enabled for beta and prod environments.
   */
  private shouldEnableStreams(): boolean {
    return ['beta', 'prod'].includes(this.environment);
  }
}
