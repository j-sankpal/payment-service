import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { BaseConstruct, BaseConstructProps } from '../base/base-construct';
/**
 * Properties for S3 bucket construct.
 * Extends base construct props with bucket-specific configuration.
 */
export interface S3BucketProps extends BaseConstructProps {
    /** Bucket name suffix */
    readonly bucketName: string;
    /** Whether to enable versioning */
    readonly enableVersioning?: boolean;
}
/**
 * S3 bucket construct following Single Responsibility Principle.
 * Handles only S3 bucket creation and configuration.
 */
export declare class S3Bucket extends BaseConstruct {
    /** The S3 bucket */
    readonly bucket: Bucket;
    constructor(scope: Construct, id: string, props: S3BucketProps);
    /**
     * Determines the removal policy based on environment.
     * Alpha: Destroy (cost-effective), Beta/Prod: Retain (data safety)
     */
    private getRemovalPolicy;
    /**
     * Determines if objects should be auto-deleted on stack destruction.
     * Only enabled for alpha environment to avoid data loss.
     */
    private shouldAutoDeleteObjects;
    /**
     * Determines if versioning should be enabled.
     * Enabled for beta and prod environments for data protection.
     */
    private shouldEnableVersioning;
}
