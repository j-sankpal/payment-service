"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Bucket = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const base_construct_1 = require("../base/base-construct");
/**
 * S3 bucket construct following Single Responsibility Principle.
 * Handles only S3 bucket creation and configuration.
 */
class S3Bucket extends base_construct_1.BaseConstruct {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.logConstructCreation();
        // Create S3 bucket with environment-specific configuration
        this.bucket = new aws_s3_1.Bucket(this, this.getResourceId('s3', 'bucket'), {
            bucketName: this.getResourceName('s3', props.bucketName),
            encryption: aws_s3_1.BucketEncryption.S3_MANAGED,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: this.getRemovalPolicy(),
            autoDeleteObjects: this.shouldAutoDeleteObjects(),
            versioned: props.enableVersioning ?? this.shouldEnableVersioning(),
            objectOwnership: aws_s3_1.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        });
        // Add lifecycle rules for cost optimization
        if (this.environment !== 'prod') {
            this.bucket.addLifecycleRule({
                id: 'DeleteIncompleteMultipartUploads',
                abortIncompleteMultipartUploadAfter: aws_cdk_lib_1.Duration.days(7),
            });
        }
        // Add lifecycle rule for old versions in non-prod
        if (this.shouldEnableVersioning() && this.environment !== 'prod') {
            this.bucket.addLifecycleRule({
                id: 'DeleteOldVersions',
                noncurrentVersionExpiration: aws_cdk_lib_1.Duration.days(30),
            });
        }
    }
    /**
     * Determines the removal policy based on environment.
     * Alpha: Destroy (cost-effective), Beta/Prod: Retain (data safety)
     */
    getRemovalPolicy() {
        return this.environment === 'alpha' ? aws_cdk_lib_1.RemovalPolicy.DESTROY : aws_cdk_lib_1.RemovalPolicy.RETAIN;
    }
    /**
     * Determines if objects should be auto-deleted on stack destruction.
     * Only enabled for alpha environment to avoid data loss.
     */
    shouldAutoDeleteObjects() {
        return this.environment === 'alpha';
    }
    /**
     * Determines if versioning should be enabled.
     * Enabled for beta and prod environments for data protection.
     */
    shouldEnableVersioning() {
        return ['beta', 'prod'].includes(this.environment);
    }
}
exports.S3Bucket = S3Bucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtYnVja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFzRDtBQUN0RCwrQ0FBa0c7QUFFbEcsMkRBQTJFO0FBYTNFOzs7R0FHRztBQUNILE1BQWEsUUFBUyxTQUFRLDhCQUFhO0lBSXpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFFNUIsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1lBQ2pFLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ3hELFVBQVUsRUFBRSx5QkFBZ0IsQ0FBQyxVQUFVO1lBQ3ZDLGlCQUFpQixFQUFFLDBCQUFpQixDQUFDLFNBQVM7WUFDOUMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN0QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDakQsU0FBUyxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDbEUsZUFBZSxFQUFFLHdCQUFlLENBQUMscUJBQXFCO1NBQ3ZELENBQUMsQ0FBQztRQUVILDRDQUE0QztRQUM1QyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDM0IsRUFBRSxFQUFFLGtDQUFrQztnQkFDdEMsbUNBQW1DLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3RELENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxrREFBa0Q7UUFDbEQsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ2pFLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzNCLEVBQUUsRUFBRSxtQkFBbUI7Z0JBQ3ZCLDJCQUEyQixFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUMvQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGdCQUFnQjtRQUN0QixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQywyQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsMkJBQWEsQ0FBQyxNQUFNLENBQUM7SUFDckYsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHVCQUF1QjtRQUM3QixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7O09BR0c7SUFDSyxzQkFBc0I7UUFDNUIsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JELENBQUM7Q0FDRjtBQTVERCw0QkE0REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEJsb2NrUHVibGljQWNjZXNzLCBCdWNrZXQsIEJ1Y2tldEVuY3J5cHRpb24sIE9iamVjdE93bmVyc2hpcCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJhc2VDb25zdHJ1Y3QsIEJhc2VDb25zdHJ1Y3RQcm9wcyB9IGZyb20gJy4uL2Jhc2UvYmFzZS1jb25zdHJ1Y3QnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIFMzIGJ1Y2tldCBjb25zdHJ1Y3QuXG4gKiBFeHRlbmRzIGJhc2UgY29uc3RydWN0IHByb3BzIHdpdGggYnVja2V0LXNwZWNpZmljIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUzNCdWNrZXRQcm9wcyBleHRlbmRzIEJhc2VDb25zdHJ1Y3RQcm9wcyB7XG4gIC8qKiBCdWNrZXQgbmFtZSBzdWZmaXggKi9cbiAgcmVhZG9ubHkgYnVja2V0TmFtZTogc3RyaW5nO1xuICAvKiogV2hldGhlciB0byBlbmFibGUgdmVyc2lvbmluZyAqL1xuICByZWFkb25seSBlbmFibGVWZXJzaW9uaW5nPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBTMyBidWNrZXQgY29uc3RydWN0IGZvbGxvd2luZyBTaW5nbGUgUmVzcG9uc2liaWxpdHkgUHJpbmNpcGxlLlxuICogSGFuZGxlcyBvbmx5IFMzIGJ1Y2tldCBjcmVhdGlvbiBhbmQgY29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFMzQnVja2V0IGV4dGVuZHMgQmFzZUNvbnN0cnVjdCB7XG4gIC8qKiBUaGUgUzMgYnVja2V0ICovXG4gIHB1YmxpYyByZWFkb25seSBidWNrZXQ6IEJ1Y2tldDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUzNCdWNrZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy5sb2dDb25zdHJ1Y3RDcmVhdGlvbigpO1xuXG4gICAgLy8gQ3JlYXRlIFMzIGJ1Y2tldCB3aXRoIGVudmlyb25tZW50LXNwZWNpZmljIGNvbmZpZ3VyYXRpb25cbiAgICB0aGlzLmJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgdGhpcy5nZXRSZXNvdXJjZUlkKCdzMycsICdidWNrZXQnKSwge1xuICAgICAgYnVja2V0TmFtZTogdGhpcy5nZXRSZXNvdXJjZU5hbWUoJ3MzJywgcHJvcHMuYnVja2V0TmFtZSksXG4gICAgICBlbmNyeXB0aW9uOiBCdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQsXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICAgICAgcmVtb3ZhbFBvbGljeTogdGhpcy5nZXRSZW1vdmFsUG9saWN5KCksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdGhpcy5zaG91bGRBdXRvRGVsZXRlT2JqZWN0cygpLFxuICAgICAgdmVyc2lvbmVkOiBwcm9wcy5lbmFibGVWZXJzaW9uaW5nID8/IHRoaXMuc2hvdWxkRW5hYmxlVmVyc2lvbmluZygpLFxuICAgICAgb2JqZWN0T3duZXJzaGlwOiBPYmplY3RPd25lcnNoaXAuQlVDS0VUX09XTkVSX0VORk9SQ0VELFxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGxpZmVjeWNsZSBydWxlcyBmb3IgY29zdCBvcHRpbWl6YXRpb25cbiAgICBpZiAodGhpcy5lbnZpcm9ubWVudCAhPT0gJ3Byb2QnKSB7XG4gICAgICB0aGlzLmJ1Y2tldC5hZGRMaWZlY3ljbGVSdWxlKHtcbiAgICAgICAgaWQ6ICdEZWxldGVJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkcycsXG4gICAgICAgIGFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZEFmdGVyOiBEdXJhdGlvbi5kYXlzKDcpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGxpZmVjeWNsZSBydWxlIGZvciBvbGQgdmVyc2lvbnMgaW4gbm9uLXByb2RcbiAgICBpZiAodGhpcy5zaG91bGRFbmFibGVWZXJzaW9uaW5nKCkgJiYgdGhpcy5lbnZpcm9ubWVudCAhPT0gJ3Byb2QnKSB7XG4gICAgICB0aGlzLmJ1Y2tldC5hZGRMaWZlY3ljbGVSdWxlKHtcbiAgICAgICAgaWQ6ICdEZWxldGVPbGRWZXJzaW9ucycsXG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjogRHVyYXRpb24uZGF5cygzMCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgcmVtb3ZhbCBwb2xpY3kgYmFzZWQgb24gZW52aXJvbm1lbnQuXG4gICAqIEFscGhhOiBEZXN0cm95IChjb3N0LWVmZmVjdGl2ZSksIEJldGEvUHJvZDogUmV0YWluIChkYXRhIHNhZmV0eSlcbiAgICovXG4gIHByaXZhdGUgZ2V0UmVtb3ZhbFBvbGljeSgpOiBSZW1vdmFsUG9saWN5IHtcbiAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudCA9PT0gJ2FscGhhJyA/IFJlbW92YWxQb2xpY3kuREVTVFJPWSA6IFJlbW92YWxQb2xpY3kuUkVUQUlOO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgb2JqZWN0cyBzaG91bGQgYmUgYXV0by1kZWxldGVkIG9uIHN0YWNrIGRlc3RydWN0aW9uLlxuICAgKiBPbmx5IGVuYWJsZWQgZm9yIGFscGhhIGVudmlyb25tZW50IHRvIGF2b2lkIGRhdGEgbG9zcy5cbiAgICovXG4gIHByaXZhdGUgc2hvdWxkQXV0b0RlbGV0ZU9iamVjdHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQgPT09ICdhbHBoYSc7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB2ZXJzaW9uaW5nIHNob3VsZCBiZSBlbmFibGVkLlxuICAgKiBFbmFibGVkIGZvciBiZXRhIGFuZCBwcm9kIGVudmlyb25tZW50cyBmb3IgZGF0YSBwcm90ZWN0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBzaG91bGRFbmFibGVWZXJzaW9uaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBbJ2JldGEnLCAncHJvZCddLmluY2x1ZGVzKHRoaXMuZW52aXJvbm1lbnQpO1xuICB9XG59XG4iXX0=