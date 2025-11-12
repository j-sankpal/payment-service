import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Bucket } from 'aws-cdk-lib/aws-s3';
/**
 * Storage interface following Interface Segregation Principle.
 * Defines only the storage-related capabilities that clients need.
 */
export interface IStorage {
    /** DynamoDB table for data persistence */
    readonly table: Table;
    /** S3 bucket for file storage */
    readonly bucket: Bucket;
    /**
     * Grants read/write permissions to the specified identity.
     * Follows Principle of Least Privilege by allowing granular permission grants.
     *
     * @param identity - The identity to grant permissions to
     */
    grantReadWrite(identity: IGrantable): void;
    /**
     * Gets the DynamoDB table name for external references.
     * Useful for cross-stack references and documentation.
     *
     * @returns The DynamoDB table name
     */
    getTableName(): string;
    /**
     * Gets the S3 bucket name for external references.
     * Useful for cross-stack references and documentation.
     *
     * @returns The S3 bucket name
     */
    getBucketName(): string;
}
