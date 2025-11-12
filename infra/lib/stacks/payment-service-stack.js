"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServiceStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const storage_stack_1 = require("../constructs/storage/storage-stack");
/**
 * Main payment service stack following Composition Root pattern.
 * Acts as the entry point for all infrastructure components.
 * Follows Dependency Inversion Principle by depending on abstractions.
 */
class PaymentServiceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const { environment } = props;
        const projectName = 'PaymentService';
        // Create storage layer
        const storageStack = new storage_stack_1.StorageStack(this, 'Storage', {
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
    createOutputs() {
        const stackName = this.getStackName();
        new aws_cdk_lib_1.CfnOutput(this, 'TableName', {
            value: this.storage.getTableName(),
            description: 'DynamoDB table name for payments',
            exportName: `${stackName}-TableName`,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'BucketName', {
            value: this.storage.getBucketName(),
            description: 'S3 bucket name for receipts',
            exportName: `${stackName}-BucketName`,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'TableArn', {
            value: this.storage.table.tableArn,
            description: 'DynamoDB table ARN',
            exportName: `${stackName}-TableArn`,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'BucketArn', {
            value: this.storage.bucket.bucketArn,
            description: 'S3 bucket ARN',
            exportName: `${stackName}-BucketArn`,
        });
    }
    /**
     * Gets the stack name for consistent naming across outputs.
     * Uses CDK's built-in stack name property.
     */
    getStackName() {
        return this.stackName || 'PaymentServiceStack';
    }
}
exports.PaymentServiceStack = PaymentServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC1zZXJ2aWNlLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF5bWVudC1zZXJ2aWNlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUF3RTtBQUV4RSx1RUFBc0Y7QUFZdEY7Ozs7R0FJRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsbUJBQUs7SUFJNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQzlCLE1BQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDO1FBRXJDLHVCQUF1QjtRQUN2QixNQUFNLFlBQVksR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUNyRCxXQUFXO1lBQ1gsV0FBVztZQUNYLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsVUFBVTtnQkFDckIsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLE9BQU8sRUFBRSxXQUFXO2FBQ3JCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixnQkFBZ0IsRUFBRSxXQUFXLEtBQUssT0FBTzthQUMxQztTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBRTVCLCtCQUErQjtRQUMvQix5QkFBeUI7UUFDekIsZ0NBQWdDO1FBRWhDLHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGFBQWE7UUFDbkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXRDLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUNsQyxXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFVBQVUsRUFBRSxHQUFHLFNBQVMsWUFBWTtTQUNyQyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDbkMsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxVQUFVLEVBQUUsR0FBRyxTQUFTLGFBQWE7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUIsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDbEMsV0FBVyxFQUFFLG9CQUFvQjtZQUNqQyxVQUFVLEVBQUUsR0FBRyxTQUFTLFdBQVc7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDcEMsV0FBVyxFQUFFLGVBQWU7WUFDNUIsVUFBVSxFQUFFLEdBQUcsU0FBUyxZQUFZO1NBQ3JDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSyxZQUFZO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxxQkFBcUIsQ0FBQztJQUNqRCxDQUFDO0NBQ0Y7QUF6RUQsa0RBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMsIENmbk91dHB1dCwgRW52aXJvbm1lbnQgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0b3JhZ2VTdGFjaywgU3RvcmFnZVN0YWNrUHJvcHMgfSBmcm9tICcuLi9jb25zdHJ1Y3RzL3N0b3JhZ2Uvc3RvcmFnZS1zdGFjayc7XG5pbXBvcnQgeyBJU3RvcmFnZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvaS1zdG9yYWdlJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBQYXltZW50U2VydmljZVN0YWNrLlxuICogRXh0ZW5kcyBzdGFuZGFyZCBTdGFja1Byb3BzIHdpdGggZW52aXJvbm1lbnQtc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXltZW50U2VydmljZVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgLyoqIERlcGxveW1lbnQgZW52aXJvbm1lbnQgKGFscGhhLCBiZXRhLCBwcm9kKSAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudDogc3RyaW5nO1xufVxuXG4vKipcbiAqIE1haW4gcGF5bWVudCBzZXJ2aWNlIHN0YWNrIGZvbGxvd2luZyBDb21wb3NpdGlvbiBSb290IHBhdHRlcm4uXG4gKiBBY3RzIGFzIHRoZSBlbnRyeSBwb2ludCBmb3IgYWxsIGluZnJhc3RydWN0dXJlIGNvbXBvbmVudHMuXG4gKiBGb2xsb3dzIERlcGVuZGVuY3kgSW52ZXJzaW9uIFByaW5jaXBsZSBieSBkZXBlbmRpbmcgb24gYWJzdHJhY3Rpb25zLlxuICovXG5leHBvcnQgY2xhc3MgUGF5bWVudFNlcnZpY2VTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgLyoqIFN0b3JhZ2UgbGF5ZXIgaW50ZXJmYWNlIGZvciBkZXBlbmRlbmN5IGluamVjdGlvbiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RvcmFnZTogSVN0b3JhZ2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFBheW1lbnRTZXJ2aWNlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgcHJvamVjdE5hbWUgPSAnUGF5bWVudFNlcnZpY2UnO1xuXG4gICAgLy8gQ3JlYXRlIHN0b3JhZ2UgbGF5ZXJcbiAgICBjb25zdCBzdG9yYWdlU3RhY2sgPSBuZXcgU3RvcmFnZVN0YWNrKHRoaXMsICdTdG9yYWdlJywge1xuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICBwcm9qZWN0TmFtZSxcbiAgICAgIHRhYmxlQ29uZmlnOiB7XG4gICAgICAgIHRhYmxlTmFtZTogJ3BheW1lbnRzJyxcbiAgICAgICAgcGFydGl0aW9uS2V5OiAnaWQnLFxuICAgICAgICBzb3J0S2V5OiAndGltZXN0YW1wJyxcbiAgICAgIH0sXG4gICAgICBidWNrZXRDb25maWc6IHtcbiAgICAgICAgYnVja2V0TmFtZTogJ3JlY2VpcHRzJyxcbiAgICAgICAgZW5hYmxlVmVyc2lvbmluZzogZW52aXJvbm1lbnQgIT09ICdhbHBoYScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2VTdGFjaztcblxuICAgIC8vIFRPRE86IENyZWF0ZSBtZXNzYWdpbmcgbGF5ZXJcbiAgICAvLyBUT0RPOiBDcmVhdGUgQVBJIGxheWVyXG4gICAgLy8gVE9ETzogQ3JlYXRlIG1vbml0b3JpbmcgbGF5ZXJcblxuICAgIC8vIENyZWF0ZSBDbG91ZEZvcm1hdGlvbiBvdXRwdXRzIGZvciBleHRlcm5hbCByZWZlcmVuY2VzXG4gICAgdGhpcy5jcmVhdGVPdXRwdXRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBDbG91ZEZvcm1hdGlvbiBvdXRwdXRzIGZvciBzdGFjayByZWZlcmVuY2VzLlxuICAgKiBGb2xsb3dzIEluZnJhc3RydWN0dXJlIGFzIENvZGUgYmVzdCBwcmFjdGljZXMgZm9yIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMuXG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZU91dHB1dHMoKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2tOYW1lID0gdGhpcy5nZXRTdGFja05hbWUoKTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ1RhYmxlTmFtZScsIHtcbiAgICAgIHZhbHVlOiB0aGlzLnN0b3JhZ2UuZ2V0VGFibGVOYW1lKCksXG4gICAgICBkZXNjcmlwdGlvbjogJ0R5bmFtb0RCIHRhYmxlIG5hbWUgZm9yIHBheW1lbnRzJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWNrTmFtZX0tVGFibGVOYW1lYCxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0J1Y2tldE5hbWUnLCB7XG4gICAgICB2YWx1ZTogdGhpcy5zdG9yYWdlLmdldEJ1Y2tldE5hbWUoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUzMgYnVja2V0IG5hbWUgZm9yIHJlY2VpcHRzJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWNrTmFtZX0tQnVja2V0TmFtZWAsXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdUYWJsZUFybicsIHtcbiAgICAgIHZhbHVlOiB0aGlzLnN0b3JhZ2UudGFibGUudGFibGVBcm4sXG4gICAgICBkZXNjcmlwdGlvbjogJ0R5bmFtb0RCIHRhYmxlIEFSTicsXG4gICAgICBleHBvcnROYW1lOiBgJHtzdGFja05hbWV9LVRhYmxlQXJuYCxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0J1Y2tldEFybicsIHtcbiAgICAgIHZhbHVlOiB0aGlzLnN0b3JhZ2UuYnVja2V0LmJ1Y2tldEFybixcbiAgICAgIGRlc2NyaXB0aW9uOiAnUzMgYnVja2V0IEFSTicsXG4gICAgICBleHBvcnROYW1lOiBgJHtzdGFja05hbWV9LUJ1Y2tldEFybmAsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc3RhY2sgbmFtZSBmb3IgY29uc2lzdGVudCBuYW1pbmcgYWNyb3NzIG91dHB1dHMuXG4gICAqIFVzZXMgQ0RLJ3MgYnVpbHQtaW4gc3RhY2sgbmFtZSBwcm9wZXJ0eS5cbiAgICovXG4gIHByaXZhdGUgZ2V0U3RhY2tOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tOYW1lIHx8ICdQYXltZW50U2VydmljZVN0YWNrJztcbiAgfVxufVxuIl19