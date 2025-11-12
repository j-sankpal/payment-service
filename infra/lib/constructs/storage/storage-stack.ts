import { Construct } from 'constructs';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { DynamoDbTable, DynamoDbTableProps } from './dynamodb-table';
import { S3Bucket, S3BucketProps } from './s3-bucket';
import { IStorage } from '../../interfaces/i-storage';
import { BaseConstruct, BaseConstructProps } from '../base/base-construct';

/**
 * Properties for storage stack construct.
 * Combines table and bucket configurations.
 */
export interface StorageStackProps extends BaseConstructProps {
  /** DynamoDB table configuration */
  readonly tableConfig: Omit<DynamoDbTableProps, keyof BaseConstructProps>;
  /** S3 bucket configuration */
  readonly bucketConfig: Omit<S3BucketProps, keyof BaseConstructProps>;
}

/**
 * Storage stack following Composition pattern and Single Responsibility Principle.
 * Composes DynamoDB table and S3 bucket into a cohesive storage layer.
 * Implements IStorage interface for dependency injection.
 */
export class StorageStack extends BaseConstruct implements IStorage {
  /** DynamoDB table for data persistence */
  public readonly table: DynamoDbTable['table'];

  /** S3 bucket for file storage */
  public readonly bucket: S3Bucket['bucket'];

  /** Reference to the DynamoDB table construct for advanced operations */
  private readonly tableConstruct: DynamoDbTable;

  /** Reference to the S3 bucket construct for advanced operations */
  private readonly bucketConstruct: S3Bucket;

  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    this.logConstructCreation();

    // Create DynamoDB table
    this.tableConstruct = new DynamoDbTable(this, 'DynamoDbTable', {
      ...props,
      ...props.tableConfig,
    });
    this.table = this.tableConstruct.table;

    // Create S3 bucket
    this.bucketConstruct = new S3Bucket(this, 'S3Bucket', {
      ...props,
      ...props.bucketConfig,
    });
    this.bucket = this.bucketConstruct.bucket;

    // Configure cross-resource permissions if needed
    this.configureCrossResourcePermissions();
  }

  /**
   * Grants read/write permissions to the specified identity.
   * Implements IStorage interface method.
   * Follows Principle of Least Privilege by granting minimal required permissions.
   *
   * @param identity - The identity to grant permissions to
   */
  public grantReadWrite(identity: IGrantable): void {
    // Grant DynamoDB permissions
    this.table.grantReadWriteData(identity);

    // Grant S3 permissions
    this.bucket.grantReadWrite(identity);
  }

  /**
   * Grants read-only permissions to the specified identity.
   * Useful for monitoring and analytics services.
   *
   * @param identity - The identity to grant permissions to
   */
  public grantReadOnly(identity: IGrantable): void {
    // Grant DynamoDB read permissions
    this.table.grantReadData(identity);

    // Grant S3 read permissions
    this.bucket.grantRead(identity);
  }

  /**
   * Grants write-only permissions to the specified identity.
   * Useful for services that only need to write data.
   *
   * @param identity - The identity to grant permissions to
   */
  public grantWriteOnly(identity: IGrantable): void {
    // Grant DynamoDB write permissions
    this.table.grantWriteData(identity);

    // Grant S3 write permissions
    this.bucket.grantWrite(identity);
  }

  /**
   * Configures permissions between storage resources if needed.
   * For example, DynamoDB streams writing to S3 or vice versa.
   * Currently empty but available for future cross-resource integrations.
   */
  private configureCrossResourcePermissions(): void {
    // Future: Configure permissions for DynamoDB streams to S3
    // Future: Configure permissions for S3 events to DynamoDB
  }

  /**
   * Gets the table name for external references.
   * Useful for cross-stack references and documentation.
   *
   * @returns The DynamoDB table name
   */
  public getTableName(): string {
    return this.table.tableName;
  }

  /**
   * Gets the bucket name for external references.
   * Useful for cross-stack references and documentation.
   *
   * @returns The S3 bucket name
   */
  public getBucketName(): string {
    return this.bucket.bucketName;
  }
}
