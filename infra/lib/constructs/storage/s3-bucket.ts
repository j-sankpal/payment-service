import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
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
export class S3Bucket extends BaseConstruct {
  /** The S3 bucket */
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props: S3BucketProps) {
    super(scope, id, props);

    this.logConstructCreation();

    // Create S3 bucket with environment-specific configuration
    this.bucket = new Bucket(this, this.getResourceId('s3', 'bucket'), {
      bucketName: this.getResourceName('s3', props.bucketName),
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: this.getRemovalPolicy(),
      autoDeleteObjects: this.shouldAutoDeleteObjects(),
      versioned: props.enableVersioning ?? this.shouldEnableVersioning(),
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });

    // Add lifecycle rules for cost optimization
    if (this.environment !== 'prod') {
      this.bucket.addLifecycleRule({
        id: 'DeleteIncompleteMultipartUploads',
        abortIncompleteMultipartUploadAfter: Duration.days(7),
      });
    }

    // Add lifecycle rule for old versions in non-prod
    if (this.shouldEnableVersioning() && this.environment !== 'prod') {
      this.bucket.addLifecycleRule({
        id: 'DeleteOldVersions',
        noncurrentVersionExpiration: Duration.days(30),
      });
    }
  }

  /**
   * Determines the removal policy based on environment.
   * Alpha: Destroy (cost-effective), Beta/Prod: Retain (data safety)
   */
  private getRemovalPolicy(): RemovalPolicy {
    return this.environment === 'alpha' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN;
  }

  /**
   * Determines if objects should be auto-deleted on stack destruction.
   * Only enabled for alpha environment to avoid data loss.
   */
  private shouldAutoDeleteObjects(): boolean {
    return this.environment === 'alpha';
  }

  /**
   * Determines if versioning should be enabled.
   * Enabled for beta and prod environments for data protection.
   */
  private shouldEnableVersioning(): boolean {
    return ['beta', 'prod'].includes(this.environment);
  }
}
