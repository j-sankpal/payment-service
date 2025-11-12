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
export declare class StorageStack extends BaseConstruct implements IStorage {
    /** DynamoDB table for data persistence */
    readonly table: DynamoDbTable['table'];
    /** S3 bucket for file storage */
    readonly bucket: S3Bucket['bucket'];
    /** Reference to the DynamoDB table construct for advanced operations */
    private readonly tableConstruct;
    /** Reference to the S3 bucket construct for advanced operations */
    private readonly bucketConstruct;
    constructor(scope: Construct, id: string, props: StorageStackProps);
    /**
     * Grants read/write permissions to the specified identity.
     * Implements IStorage interface method.
     * Follows Principle of Least Privilege by granting minimal required permissions.
     *
     * @param identity - The identity to grant permissions to
     */
    grantReadWrite(identity: IGrantable): void;
    /**
     * Grants read-only permissions to the specified identity.
     * Useful for monitoring and analytics services.
     *
     * @param identity - The identity to grant permissions to
     */
    grantReadOnly(identity: IGrantable): void;
    /**
     * Grants write-only permissions to the specified identity.
     * Useful for services that only need to write data.
     *
     * @param identity - The identity to grant permissions to
     */
    grantWriteOnly(identity: IGrantable): void;
    /**
     * Configures permissions between storage resources if needed.
     * For example, DynamoDB streams writing to S3 or vice versa.
     * Currently empty but available for future cross-resource integrations.
     */
    private configureCrossResourcePermissions;
    /**
     * Gets the table name for external references.
     * Useful for cross-stack references and documentation.
     *
     * @returns The DynamoDB table name
     */
    getTableName(): string;
    /**
     * Gets the bucket name for external references.
     * Useful for cross-stack references and documentation.
     *
     * @returns The S3 bucket name
     */
    getBucketName(): string;
}
