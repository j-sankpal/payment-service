"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDbTable = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const base_construct_1 = require("../base/base-construct");
/**
 * DynamoDB table construct following Single Responsibility Principle.
 * Handles only DynamoDB table creation and configuration.
 */
class DynamoDbTable extends base_construct_1.BaseConstruct {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.logConstructCreation();
        // Create DynamoDB table with environment-specific configuration
        this.table = new aws_dynamodb_1.Table(this, this.getResourceId('dynamodb', 'table'), {
            tableName: this.getResourceName('dynamodb', props.tableName),
            partitionKey: {
                name: props.partitionKey,
                type: aws_dynamodb_1.AttributeType.STRING,
            },
            sortKey: props.sortKey ? {
                name: props.sortKey,
                type: aws_dynamodb_1.AttributeType.STRING,
            } : undefined,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            encryption: aws_dynamodb_1.TableEncryption.AWS_MANAGED,
            removalPolicy: this.getRemovalPolicy(),
            pointInTimeRecovery: this.shouldEnablePointInTimeRecovery(),
            stream: this.shouldEnableStreams() ? aws_dynamodb_1.StreamViewType.NEW_AND_OLD_IMAGES : undefined,
        });
        // Add table tags
        this.table.addGlobalSecondaryIndex({
            indexName: 'StatusIndex',
            partitionKey: {
                name: 'status',
                type: aws_dynamodb_1.AttributeType.STRING,
            },
            sortKey: {
                name: 'timestamp',
                type: aws_dynamodb_1.AttributeType.NUMBER,
            },
        });
    }
    /**
     * Determines the removal policy based on environment.
     * Alpha: Destroy (cost-effective), Beta/Prod: Retain (data safety)
     */
    getRemovalPolicy() {
        return this.environment === 'alpha' ? aws_cdk_lib_1.RemovalPolicy.DESTROY : aws_cdk_lib_1.RemovalPolicy.RETAIN;
    }
    /**
     * Determines if point-in-time recovery should be enabled.
     * Only enabled for production environment.
     */
    shouldEnablePointInTimeRecovery() {
        return this.environment === 'prod';
    }
    /**
     * Determines if DynamoDB streams should be enabled.
     * Enabled for beta and prod environments.
     */
    shouldEnableStreams() {
        return ['beta', 'prod'].includes(this.environment);
    }
}
exports.DynamoDbTable = DynamoDbTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vZGItdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkeW5hbW9kYi10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBNEM7QUFDNUMsMkRBQThHO0FBRTlHLDJEQUEyRTtBQWUzRTs7O0dBR0c7QUFDSCxNQUFhLGFBQWMsU0FBUSw4QkFBYTtJQUk5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRTVCLGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDcEUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDNUQsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWTtnQkFDeEIsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUMzQjtZQUNELE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUNuQixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzNCLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDYixXQUFXLEVBQUUsMEJBQVcsQ0FBQyxlQUFlO1lBQ3hDLFVBQVUsRUFBRSw4QkFBZSxDQUFDLFdBQVc7WUFDdkMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN0QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsK0JBQStCLEVBQUU7WUFDM0QsTUFBTSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQyw2QkFBYyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQ25GLENBQUMsQ0FBQztRQUVILGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDO1lBQ2pDLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzNCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzNCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGdCQUFnQjtRQUN0QixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQywyQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsMkJBQWEsQ0FBQyxNQUFNLENBQUM7SUFDckYsQ0FBQztJQUVEOzs7T0FHRztJQUNLLCtCQUErQjtRQUNyQyxPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSyxtQkFBbUI7UUFDekIsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JELENBQUM7Q0FDRjtBQWhFRCxzQ0FnRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgQmlsbGluZ01vZGUsIFN0cmVhbVZpZXdUeXBlLCBUYWJsZSwgVGFibGVFbmNyeXB0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQmFzZUNvbnN0cnVjdCwgQmFzZUNvbnN0cnVjdFByb3BzIH0gZnJvbSAnLi4vYmFzZS9iYXNlLWNvbnN0cnVjdCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgRHluYW1vREIgdGFibGUgY29uc3RydWN0LlxuICogRXh0ZW5kcyBiYXNlIGNvbnN0cnVjdCBwcm9wcyB3aXRoIHRhYmxlLXNwZWNpZmljIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRHluYW1vRGJUYWJsZVByb3BzIGV4dGVuZHMgQmFzZUNvbnN0cnVjdFByb3BzIHtcbiAgLyoqIFRhYmxlIG5hbWUgc3VmZml4ICovXG4gIHJlYWRvbmx5IHRhYmxlTmFtZTogc3RyaW5nO1xuICAvKiogUGFydGl0aW9uIGtleSBuYW1lICovXG4gIHJlYWRvbmx5IHBhcnRpdGlvbktleTogc3RyaW5nO1xuICAvKiogU29ydCBrZXkgbmFtZSAob3B0aW9uYWwpICovXG4gIHJlYWRvbmx5IHNvcnRLZXk/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRHluYW1vREIgdGFibGUgY29uc3RydWN0IGZvbGxvd2luZyBTaW5nbGUgUmVzcG9uc2liaWxpdHkgUHJpbmNpcGxlLlxuICogSGFuZGxlcyBvbmx5IER5bmFtb0RCIHRhYmxlIGNyZWF0aW9uIGFuZCBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgRHluYW1vRGJUYWJsZSBleHRlbmRzIEJhc2VDb25zdHJ1Y3Qge1xuICAvKiogVGhlIER5bmFtb0RCIHRhYmxlICovXG4gIHB1YmxpYyByZWFkb25seSB0YWJsZTogVGFibGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IER5bmFtb0RiVGFibGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy5sb2dDb25zdHJ1Y3RDcmVhdGlvbigpO1xuXG4gICAgLy8gQ3JlYXRlIER5bmFtb0RCIHRhYmxlIHdpdGggZW52aXJvbm1lbnQtc3BlY2lmaWMgY29uZmlndXJhdGlvblxuICAgIHRoaXMudGFibGUgPSBuZXcgVGFibGUodGhpcywgdGhpcy5nZXRSZXNvdXJjZUlkKCdkeW5hbW9kYicsICd0YWJsZScpLCB7XG4gICAgICB0YWJsZU5hbWU6IHRoaXMuZ2V0UmVzb3VyY2VOYW1lKCdkeW5hbW9kYicsIHByb3BzLnRhYmxlTmFtZSksXG4gICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgbmFtZTogcHJvcHMucGFydGl0aW9uS2V5LFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBzb3J0S2V5OiBwcm9wcy5zb3J0S2V5ID8ge1xuICAgICAgICBuYW1lOiBwcm9wcy5zb3J0S2V5LFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICBiaWxsaW5nTW9kZTogQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgZW5jcnlwdGlvbjogVGFibGVFbmNyeXB0aW9uLkFXU19NQU5BR0VELFxuICAgICAgcmVtb3ZhbFBvbGljeTogdGhpcy5nZXRSZW1vdmFsUG9saWN5KCksXG4gICAgICBwb2ludEluVGltZVJlY292ZXJ5OiB0aGlzLnNob3VsZEVuYWJsZVBvaW50SW5UaW1lUmVjb3ZlcnkoKSxcbiAgICAgIHN0cmVhbTogdGhpcy5zaG91bGRFbmFibGVTdHJlYW1zKCkgPyBTdHJlYW1WaWV3VHlwZS5ORVdfQU5EX09MRF9JTUFHRVMgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgdGFibGUgdGFnc1xuICAgIHRoaXMudGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoe1xuICAgICAgaW5kZXhOYW1lOiAnU3RhdHVzSW5kZXgnLFxuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6ICdzdGF0dXMnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBzb3J0S2V5OiB7XG4gICAgICAgIG5hbWU6ICd0aW1lc3RhbXAnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLk5VTUJFUixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgcmVtb3ZhbCBwb2xpY3kgYmFzZWQgb24gZW52aXJvbm1lbnQuXG4gICAqIEFscGhhOiBEZXN0cm95IChjb3N0LWVmZmVjdGl2ZSksIEJldGEvUHJvZDogUmV0YWluIChkYXRhIHNhZmV0eSlcbiAgICovXG4gIHByaXZhdGUgZ2V0UmVtb3ZhbFBvbGljeSgpOiBSZW1vdmFsUG9saWN5IHtcbiAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudCA9PT0gJ2FscGhhJyA/IFJlbW92YWxQb2xpY3kuREVTVFJPWSA6IFJlbW92YWxQb2xpY3kuUkVUQUlOO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgcG9pbnQtaW4tdGltZSByZWNvdmVyeSBzaG91bGQgYmUgZW5hYmxlZC5cbiAgICogT25seSBlbmFibGVkIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBzaG91bGRFbmFibGVQb2ludEluVGltZVJlY292ZXJ5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVudmlyb25tZW50ID09PSAncHJvZCc7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBEeW5hbW9EQiBzdHJlYW1zIHNob3VsZCBiZSBlbmFibGVkLlxuICAgKiBFbmFibGVkIGZvciBiZXRhIGFuZCBwcm9kIGVudmlyb25tZW50cy5cbiAgICovXG4gIHByaXZhdGUgc2hvdWxkRW5hYmxlU3RyZWFtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gWydiZXRhJywgJ3Byb2QnXS5pbmNsdWRlcyh0aGlzLmVudmlyb25tZW50KTtcbiAgfVxufVxuIl19