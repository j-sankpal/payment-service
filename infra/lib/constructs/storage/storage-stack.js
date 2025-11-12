"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageStack = void 0;
const dynamodb_table_1 = require("./dynamodb-table");
const s3_bucket_1 = require("./s3-bucket");
const base_construct_1 = require("../base/base-construct");
/**
 * Storage stack following Composition pattern and Single Responsibility Principle.
 * Composes DynamoDB table and S3 bucket into a cohesive storage layer.
 * Implements IStorage interface for dependency injection.
 */
class StorageStack extends base_construct_1.BaseConstruct {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.logConstructCreation();
        // Create DynamoDB table
        this.tableConstruct = new dynamodb_table_1.DynamoDbTable(this, 'DynamoDbTable', {
            ...props,
            ...props.tableConfig,
        });
        this.table = this.tableConstruct.table;
        // Create S3 bucket
        this.bucketConstruct = new s3_bucket_1.S3Bucket(this, 'S3Bucket', {
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
    grantReadWrite(identity) {
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
    grantReadOnly(identity) {
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
    grantWriteOnly(identity) {
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
    configureCrossResourcePermissions() {
        // Future: Configure permissions for DynamoDB streams to S3
        // Future: Configure permissions for S3 events to DynamoDB
    }
    /**
     * Gets the table name for external references.
     * Useful for cross-stack references and documentation.
     *
     * @returns The DynamoDB table name
     */
    getTableName() {
        return this.table.tableName;
    }
    /**
     * Gets the bucket name for external references.
     * Useful for cross-stack references and documentation.
     *
     * @returns The S3 bucket name
     */
    getBucketName() {
        return this.bucket.bucketName;
    }
}
exports.StorageStack = StorageStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0b3JhZ2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEscURBQXFFO0FBQ3JFLDJDQUFzRDtBQUV0RCwyREFBMkU7QUFhM0U7Ozs7R0FJRztBQUNILE1BQWEsWUFBYSxTQUFRLDhCQUFhO0lBYTdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFFNUIsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDN0QsR0FBRyxLQUFLO1lBQ1IsR0FBRyxLQUFLLENBQUMsV0FBVztTQUNyQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBRXZDLG1CQUFtQjtRQUNuQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksb0JBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELEdBQUcsS0FBSztZQUNSLEdBQUcsS0FBSyxDQUFDLFlBQVk7U0FDdEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQztRQUUxQyxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGNBQWMsQ0FBQyxRQUFvQjtRQUN4Qyw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4Qyx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksYUFBYSxDQUFDLFFBQW9CO1FBQ3ZDLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuQyw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksY0FBYyxDQUFDLFFBQW9CO1FBQ3hDLG1DQUFtQztRQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwQyw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxpQ0FBaUM7UUFDdkMsMkRBQTJEO1FBQzNELDBEQUEwRDtJQUM1RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxZQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksYUFBYTtRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2hDLENBQUM7Q0FDRjtBQTVHRCxvQ0E0R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElHcmFudGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IER5bmFtb0RiVGFibGUsIER5bmFtb0RiVGFibGVQcm9wcyB9IGZyb20gJy4vZHluYW1vZGItdGFibGUnO1xuaW1wb3J0IHsgUzNCdWNrZXQsIFMzQnVja2V0UHJvcHMgfSBmcm9tICcuL3MzLWJ1Y2tldCc7XG5pbXBvcnQgeyBJU3RvcmFnZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvaS1zdG9yYWdlJztcbmltcG9ydCB7IEJhc2VDb25zdHJ1Y3QsIEJhc2VDb25zdHJ1Y3RQcm9wcyB9IGZyb20gJy4uL2Jhc2UvYmFzZS1jb25zdHJ1Y3QnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIHN0b3JhZ2Ugc3RhY2sgY29uc3RydWN0LlxuICogQ29tYmluZXMgdGFibGUgYW5kIGJ1Y2tldCBjb25maWd1cmF0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdG9yYWdlU3RhY2tQcm9wcyBleHRlbmRzIEJhc2VDb25zdHJ1Y3RQcm9wcyB7XG4gIC8qKiBEeW5hbW9EQiB0YWJsZSBjb25maWd1cmF0aW9uICovXG4gIHJlYWRvbmx5IHRhYmxlQ29uZmlnOiBPbWl0PER5bmFtb0RiVGFibGVQcm9wcywga2V5b2YgQmFzZUNvbnN0cnVjdFByb3BzPjtcbiAgLyoqIFMzIGJ1Y2tldCBjb25maWd1cmF0aW9uICovXG4gIHJlYWRvbmx5IGJ1Y2tldENvbmZpZzogT21pdDxTM0J1Y2tldFByb3BzLCBrZXlvZiBCYXNlQ29uc3RydWN0UHJvcHM+O1xufVxuXG4vKipcbiAqIFN0b3JhZ2Ugc3RhY2sgZm9sbG93aW5nIENvbXBvc2l0aW9uIHBhdHRlcm4gYW5kIFNpbmdsZSBSZXNwb25zaWJpbGl0eSBQcmluY2lwbGUuXG4gKiBDb21wb3NlcyBEeW5hbW9EQiB0YWJsZSBhbmQgUzMgYnVja2V0IGludG8gYSBjb2hlc2l2ZSBzdG9yYWdlIGxheWVyLlxuICogSW1wbGVtZW50cyBJU3RvcmFnZSBpbnRlcmZhY2UgZm9yIGRlcGVuZGVuY3kgaW5qZWN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgU3RvcmFnZVN0YWNrIGV4dGVuZHMgQmFzZUNvbnN0cnVjdCBpbXBsZW1lbnRzIElTdG9yYWdlIHtcbiAgLyoqIER5bmFtb0RCIHRhYmxlIGZvciBkYXRhIHBlcnNpc3RlbmNlICovXG4gIHB1YmxpYyByZWFkb25seSB0YWJsZTogRHluYW1vRGJUYWJsZVsndGFibGUnXTtcblxuICAvKiogUzMgYnVja2V0IGZvciBmaWxlIHN0b3JhZ2UgKi9cbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldDogUzNCdWNrZXRbJ2J1Y2tldCddO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIER5bmFtb0RCIHRhYmxlIGNvbnN0cnVjdCBmb3IgYWR2YW5jZWQgb3BlcmF0aW9ucyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHRhYmxlQ29uc3RydWN0OiBEeW5hbW9EYlRhYmxlO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIFMzIGJ1Y2tldCBjb25zdHJ1Y3QgZm9yIGFkdmFuY2VkIG9wZXJhdGlvbnMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBidWNrZXRDb25zdHJ1Y3Q6IFMzQnVja2V0O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdG9yYWdlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy5sb2dDb25zdHJ1Y3RDcmVhdGlvbigpO1xuXG4gICAgLy8gQ3JlYXRlIER5bmFtb0RCIHRhYmxlXG4gICAgdGhpcy50YWJsZUNvbnN0cnVjdCA9IG5ldyBEeW5hbW9EYlRhYmxlKHRoaXMsICdEeW5hbW9EYlRhYmxlJywge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICAuLi5wcm9wcy50YWJsZUNvbmZpZyxcbiAgICB9KTtcbiAgICB0aGlzLnRhYmxlID0gdGhpcy50YWJsZUNvbnN0cnVjdC50YWJsZTtcblxuICAgIC8vIENyZWF0ZSBTMyBidWNrZXRcbiAgICB0aGlzLmJ1Y2tldENvbnN0cnVjdCA9IG5ldyBTM0J1Y2tldCh0aGlzLCAnUzNCdWNrZXQnLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIC4uLnByb3BzLmJ1Y2tldENvbmZpZyxcbiAgICB9KTtcbiAgICB0aGlzLmJ1Y2tldCA9IHRoaXMuYnVja2V0Q29uc3RydWN0LmJ1Y2tldDtcblxuICAgIC8vIENvbmZpZ3VyZSBjcm9zcy1yZXNvdXJjZSBwZXJtaXNzaW9ucyBpZiBuZWVkZWRcbiAgICB0aGlzLmNvbmZpZ3VyZUNyb3NzUmVzb3VyY2VQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50cyByZWFkL3dyaXRlIHBlcm1pc3Npb25zIHRvIHRoZSBzcGVjaWZpZWQgaWRlbnRpdHkuXG4gICAqIEltcGxlbWVudHMgSVN0b3JhZ2UgaW50ZXJmYWNlIG1ldGhvZC5cbiAgICogRm9sbG93cyBQcmluY2lwbGUgb2YgTGVhc3QgUHJpdmlsZWdlIGJ5IGdyYW50aW5nIG1pbmltYWwgcmVxdWlyZWQgcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSAtIFRoZSBpZGVudGl0eSB0byBncmFudCBwZXJtaXNzaW9ucyB0b1xuICAgKi9cbiAgcHVibGljIGdyYW50UmVhZFdyaXRlKGlkZW50aXR5OiBJR3JhbnRhYmxlKTogdm9pZCB7XG4gICAgLy8gR3JhbnQgRHluYW1vREIgcGVybWlzc2lvbnNcbiAgICB0aGlzLnRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShpZGVudGl0eSk7XG5cbiAgICAvLyBHcmFudCBTMyBwZXJtaXNzaW9uc1xuICAgIHRoaXMuYnVja2V0LmdyYW50UmVhZFdyaXRlKGlkZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgcmVhZC1vbmx5IHBlcm1pc3Npb25zIHRvIHRoZSBzcGVjaWZpZWQgaWRlbnRpdHkuXG4gICAqIFVzZWZ1bCBmb3IgbW9uaXRvcmluZyBhbmQgYW5hbHl0aWNzIHNlcnZpY2VzLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgLSBUaGUgaWRlbnRpdHkgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG9cbiAgICovXG4gIHB1YmxpYyBncmFudFJlYWRPbmx5KGlkZW50aXR5OiBJR3JhbnRhYmxlKTogdm9pZCB7XG4gICAgLy8gR3JhbnQgRHluYW1vREIgcmVhZCBwZXJtaXNzaW9uc1xuICAgIHRoaXMudGFibGUuZ3JhbnRSZWFkRGF0YShpZGVudGl0eSk7XG5cbiAgICAvLyBHcmFudCBTMyByZWFkIHBlcm1pc3Npb25zXG4gICAgdGhpcy5idWNrZXQuZ3JhbnRSZWFkKGlkZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgd3JpdGUtb25seSBwZXJtaXNzaW9ucyB0byB0aGUgc3BlY2lmaWVkIGlkZW50aXR5LlxuICAgKiBVc2VmdWwgZm9yIHNlcnZpY2VzIHRoYXQgb25seSBuZWVkIHRvIHdyaXRlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSAtIFRoZSBpZGVudGl0eSB0byBncmFudCBwZXJtaXNzaW9ucyB0b1xuICAgKi9cbiAgcHVibGljIGdyYW50V3JpdGVPbmx5KGlkZW50aXR5OiBJR3JhbnRhYmxlKTogdm9pZCB7XG4gICAgLy8gR3JhbnQgRHluYW1vREIgd3JpdGUgcGVybWlzc2lvbnNcbiAgICB0aGlzLnRhYmxlLmdyYW50V3JpdGVEYXRhKGlkZW50aXR5KTtcblxuICAgIC8vIEdyYW50IFMzIHdyaXRlIHBlcm1pc3Npb25zXG4gICAgdGhpcy5idWNrZXQuZ3JhbnRXcml0ZShpZGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlcyBwZXJtaXNzaW9ucyBiZXR3ZWVuIHN0b3JhZ2UgcmVzb3VyY2VzIGlmIG5lZWRlZC5cbiAgICogRm9yIGV4YW1wbGUsIER5bmFtb0RCIHN0cmVhbXMgd3JpdGluZyB0byBTMyBvciB2aWNlIHZlcnNhLlxuICAgKiBDdXJyZW50bHkgZW1wdHkgYnV0IGF2YWlsYWJsZSBmb3IgZnV0dXJlIGNyb3NzLXJlc291cmNlIGludGVncmF0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgY29uZmlndXJlQ3Jvc3NSZXNvdXJjZVBlcm1pc3Npb25zKCk6IHZvaWQge1xuICAgIC8vIEZ1dHVyZTogQ29uZmlndXJlIHBlcm1pc3Npb25zIGZvciBEeW5hbW9EQiBzdHJlYW1zIHRvIFMzXG4gICAgLy8gRnV0dXJlOiBDb25maWd1cmUgcGVybWlzc2lvbnMgZm9yIFMzIGV2ZW50cyB0byBEeW5hbW9EQlxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRhYmxlIG5hbWUgZm9yIGV4dGVybmFsIHJlZmVyZW5jZXMuXG4gICAqIFVzZWZ1bCBmb3IgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBhbmQgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIER5bmFtb0RCIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRUYWJsZU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZS50YWJsZU5hbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYnVja2V0IG5hbWUgZm9yIGV4dGVybmFsIHJlZmVyZW5jZXMuXG4gICAqIFVzZWZ1bCBmb3IgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBhbmQgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIFMzIGJ1Y2tldCBuYW1lXG4gICAqL1xuICBwdWJsaWMgZ2V0QnVja2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmJ1Y2tldC5idWNrZXROYW1lO1xuICB9XG59XG4iXX0=