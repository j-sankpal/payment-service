"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConstruct = void 0;
const constructs_1 = require("constructs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
/**
 * Abstract base construct that provides common functionality for all CDK constructs.
 * Follows Single Responsibility Principle by handling only common construct concerns.
 * Follows Open/Closed Principle by allowing extension through inheritance.
 */
class BaseConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.environment = props.environment;
        this.projectName = props.projectName;
        // Apply common tags to all resources in this construct
        this.applyCommonTags();
        // Validate construct configuration
        this.validateConfiguration();
    }
    /**
     * Applies common tags to all resources in this construct.
     * Follows DRY principle by centralizing tagging logic.
     */
    applyCommonTags() {
        aws_cdk_lib_1.Tags.of(this).add('Environment', this.environment);
        aws_cdk_lib_1.Tags.of(this).add('Project', this.projectName);
        aws_cdk_lib_1.Tags.of(this).add('ManagedBy', 'CDK');
        aws_cdk_lib_1.Tags.of(this).add('CreatedAt', new Date().toISOString());
    }
    /**
     * Generates a standardized resource name following naming conventions.
     * Follows consistency principle for resource naming across environments.
     *
     * @param resourceType - The type of AWS resource (e.g., 'dynamodb', 'lambda')
     * @param resourceName - The specific resource name
     * @returns Standardized resource name
     */
    getResourceName(resourceType, resourceName) {
        return `${this.projectName}-${this.environment}-${resourceType}-${resourceName}`;
    }
    /**
     * Generates a standardized resource ID for CDK constructs.
     * Ensures unique and consistent naming within the stack.
     *
     * @param resourceType - The type of AWS resource
     * @param resourceName - The specific resource name
     * @returns Standardized resource ID
     */
    getResourceId(resourceType, resourceName) {
        return `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}`;
    }
    /**
     * Validates the construct configuration.
     * Template method pattern - subclasses can override for specific validation.
     * Follows Fail Fast principle by validating early.
     */
    validateConfiguration() {
        if (!this.environment || this.environment.trim() === '') {
            throw new Error('Environment must be specified and non-empty');
        }
        if (!this.projectName || this.projectName.trim() === '') {
            throw new Error('Project name must be specified and non-empty');
        }
        // Validate environment name
        const validEnvironments = ['alpha', 'beta', 'prod'];
        if (validEnvironments.indexOf(this.environment.toLowerCase()) === -1) {
            throw new Error(`Invalid environment: ${this.environment}. Must be one of: ${validEnvironments.join(', ')}`);
        }
    }
    /**
     * Gets the environment-specific configuration.
     * Strategy pattern - different environments can have different configurations.
     *
     * @returns Environment-specific configuration object
     */
    getEnvironmentConfig() {
        const baseConfig = {
            projectName: this.projectName,
            environment: this.environment,
        };
        // Environment-specific configurations
        switch (this.environment.toLowerCase()) {
            case 'alpha':
                return {
                    ...baseConfig,
                    enableDetailedMonitoring: false,
                    enableDeletionProtection: false,
                    backupRetentionDays: 1,
                };
            case 'beta':
                return {
                    ...baseConfig,
                    enableDetailedMonitoring: true,
                    enableDeletionProtection: false,
                    backupRetentionDays: 7,
                };
            case 'prod':
                return {
                    ...baseConfig,
                    enableDetailedMonitoring: true,
                    enableDeletionProtection: true,
                    backupRetentionDays: 30,
                };
            default:
                return baseConfig;
        }
    }
    /**
     * Logs construct creation for debugging purposes.
     * Follows consistent logging pattern across all constructs.
     */
    logConstructCreation() {
        console.log(`Creating ${this.constructor.name} for ${this.projectName} in ${this.environment} environment`);
    }
}
exports.BaseConstruct = BaseConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNlLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBdUM7QUFDdkMsNkNBQW1DO0FBYW5DOzs7O0dBSUc7QUFDSCxNQUFzQixhQUFjLFNBQVEsc0JBQVM7SUFNbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFFckMsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV2QixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGVBQWU7UUFDckIsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0Msa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0QyxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLGVBQWUsQ0FBQyxZQUFvQixFQUFFLFlBQW9CO1FBQ2xFLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksWUFBWSxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ25GLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sYUFBYSxDQUFDLFlBQW9CLEVBQUUsWUFBb0I7UUFDaEUsT0FBTyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxSSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLHFCQUFxQjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUVELDRCQUE0QjtRQUM1QixNQUFNLGlCQUFpQixHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNyRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixJQUFJLENBQUMsV0FBVyxxQkFBcUIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvRyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sb0JBQW9CO1FBQzVCLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM3QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDOUIsQ0FBQztRQUVGLHNDQUFzQztRQUN0QyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUN2QyxLQUFLLE9BQU87Z0JBQ1YsT0FBTztvQkFDTCxHQUFHLFVBQVU7b0JBQ2Isd0JBQXdCLEVBQUUsS0FBSztvQkFDL0Isd0JBQXdCLEVBQUUsS0FBSztvQkFDL0IsbUJBQW1CLEVBQUUsQ0FBQztpQkFDdkIsQ0FBQztZQUVKLEtBQUssTUFBTTtnQkFDVCxPQUFPO29CQUNMLEdBQUcsVUFBVTtvQkFDYix3QkFBd0IsRUFBRSxJQUFJO29CQUM5Qix3QkFBd0IsRUFBRSxLQUFLO29CQUMvQixtQkFBbUIsRUFBRSxDQUFDO2lCQUN2QixDQUFDO1lBRUosS0FBSyxNQUFNO2dCQUNULE9BQU87b0JBQ0wsR0FBRyxVQUFVO29CQUNiLHdCQUF3QixFQUFFLElBQUk7b0JBQzlCLHdCQUF3QixFQUFFLElBQUk7b0JBQzlCLG1CQUFtQixFQUFFLEVBQUU7aUJBQ3hCLENBQUM7WUFFSjtnQkFDRSxPQUFPLFVBQVUsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNPLG9CQUFvQjtRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLFdBQVcsT0FBTyxJQUFJLENBQUMsV0FBVyxjQUFjLENBQUMsQ0FBQztJQUM5RyxDQUFDO0NBQ0Y7QUE3SEQsc0NBNkhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBUYWdzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuXG4vKipcbiAqIEJhc2UgY29uc3RydWN0IHByb3BlcnRpZXMgdGhhdCBhbGwgY29uc3RydWN0cyBzaG91bGQgZXh0ZW5kLlxuICogRm9sbG93cyBJbnRlcmZhY2UgU2VncmVnYXRpb24gUHJpbmNpcGxlIGJ5IHByb3ZpZGluZyBvbmx5IGVzc2VudGlhbCBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VDb25zdHJ1Y3RQcm9wcyB7XG4gIC8qKiBUaGUgZGVwbG95bWVudCBlbnZpcm9ubWVudCAoYWxwaGEsIGJldGEsIHByb2QpICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50OiBzdHJpbmc7XG4gIC8qKiBUaGUgcHJvamVjdCBuYW1lIGZvciByZXNvdXJjZSBuYW1pbmcgKi9cbiAgcmVhZG9ubHkgcHJvamVjdE5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBYnN0cmFjdCBiYXNlIGNvbnN0cnVjdCB0aGF0IHByb3ZpZGVzIGNvbW1vbiBmdW5jdGlvbmFsaXR5IGZvciBhbGwgQ0RLIGNvbnN0cnVjdHMuXG4gKiBGb2xsb3dzIFNpbmdsZSBSZXNwb25zaWJpbGl0eSBQcmluY2lwbGUgYnkgaGFuZGxpbmcgb25seSBjb21tb24gY29uc3RydWN0IGNvbmNlcm5zLlxuICogRm9sbG93cyBPcGVuL0Nsb3NlZCBQcmluY2lwbGUgYnkgYWxsb3dpbmcgZXh0ZW5zaW9uIHRocm91Z2ggaW5oZXJpdGFuY2UuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqIFRoZSBkZXBsb3ltZW50IGVudmlyb25tZW50ICovXG4gIHByb3RlY3RlZCByZWFkb25seSBlbnZpcm9ubWVudDogc3RyaW5nO1xuICAvKiogVGhlIHByb2plY3QgbmFtZSAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgcHJvamVjdE5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQmFzZUNvbnN0cnVjdFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBwcm9wcy5lbnZpcm9ubWVudDtcbiAgICB0aGlzLnByb2plY3ROYW1lID0gcHJvcHMucHJvamVjdE5hbWU7XG5cbiAgICAvLyBBcHBseSBjb21tb24gdGFncyB0byBhbGwgcmVzb3VyY2VzIGluIHRoaXMgY29uc3RydWN0XG4gICAgdGhpcy5hcHBseUNvbW1vblRhZ3MoKTtcblxuICAgIC8vIFZhbGlkYXRlIGNvbnN0cnVjdCBjb25maWd1cmF0aW9uXG4gICAgdGhpcy52YWxpZGF0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGNvbW1vbiB0YWdzIHRvIGFsbCByZXNvdXJjZXMgaW4gdGhpcyBjb25zdHJ1Y3QuXG4gICAqIEZvbGxvd3MgRFJZIHByaW5jaXBsZSBieSBjZW50cmFsaXppbmcgdGFnZ2luZyBsb2dpYy5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlDb21tb25UYWdzKCk6IHZvaWQge1xuICAgIFRhZ3Mub2YodGhpcykuYWRkKCdFbnZpcm9ubWVudCcsIHRoaXMuZW52aXJvbm1lbnQpO1xuICAgIFRhZ3Mub2YodGhpcykuYWRkKCdQcm9qZWN0JywgdGhpcy5wcm9qZWN0TmFtZSk7XG4gICAgVGFncy5vZih0aGlzKS5hZGQoJ01hbmFnZWRCeScsICdDREsnKTtcbiAgICBUYWdzLm9mKHRoaXMpLmFkZCgnQ3JlYXRlZEF0JywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBzdGFuZGFyZGl6ZWQgcmVzb3VyY2UgbmFtZSBmb2xsb3dpbmcgbmFtaW5nIGNvbnZlbnRpb25zLlxuICAgKiBGb2xsb3dzIGNvbnNpc3RlbmN5IHByaW5jaXBsZSBmb3IgcmVzb3VyY2UgbmFtaW5nIGFjcm9zcyBlbnZpcm9ubWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSByZXNvdXJjZVR5cGUgLSBUaGUgdHlwZSBvZiBBV1MgcmVzb3VyY2UgKGUuZy4sICdkeW5hbW9kYicsICdsYW1iZGEnKVxuICAgKiBAcGFyYW0gcmVzb3VyY2VOYW1lIC0gVGhlIHNwZWNpZmljIHJlc291cmNlIG5hbWVcbiAgICogQHJldHVybnMgU3RhbmRhcmRpemVkIHJlc291cmNlIG5hbWVcbiAgICovXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZU5hbWUocmVzb3VyY2VUeXBlOiBzdHJpbmcsIHJlc291cmNlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5wcm9qZWN0TmFtZX0tJHt0aGlzLmVudmlyb25tZW50fS0ke3Jlc291cmNlVHlwZX0tJHtyZXNvdXJjZU5hbWV9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBzdGFuZGFyZGl6ZWQgcmVzb3VyY2UgSUQgZm9yIENESyBjb25zdHJ1Y3RzLlxuICAgKiBFbnN1cmVzIHVuaXF1ZSBhbmQgY29uc2lzdGVudCBuYW1pbmcgd2l0aGluIHRoZSBzdGFjay5cbiAgICpcbiAgICogQHBhcmFtIHJlc291cmNlVHlwZSAtIFRoZSB0eXBlIG9mIEFXUyByZXNvdXJjZVxuICAgKiBAcGFyYW0gcmVzb3VyY2VOYW1lIC0gVGhlIHNwZWNpZmljIHJlc291cmNlIG5hbWVcbiAgICogQHJldHVybnMgU3RhbmRhcmRpemVkIHJlc291cmNlIElEXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VJZChyZXNvdXJjZVR5cGU6IHN0cmluZywgcmVzb3VyY2VOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtyZXNvdXJjZVR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXNvdXJjZVR5cGUuc2xpY2UoMSl9JHtyZXNvdXJjZU5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXNvdXJjZU5hbWUuc2xpY2UoMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgdGhlIGNvbnN0cnVjdCBjb25maWd1cmF0aW9uLlxuICAgKiBUZW1wbGF0ZSBtZXRob2QgcGF0dGVybiAtIHN1YmNsYXNzZXMgY2FuIG92ZXJyaWRlIGZvciBzcGVjaWZpYyB2YWxpZGF0aW9uLlxuICAgKiBGb2xsb3dzIEZhaWwgRmFzdCBwcmluY2lwbGUgYnkgdmFsaWRhdGluZyBlYXJseS5cbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZUNvbmZpZ3VyYXRpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVudmlyb25tZW50IHx8IHRoaXMuZW52aXJvbm1lbnQudHJpbSgpID09PSAnJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbnZpcm9ubWVudCBtdXN0IGJlIHNwZWNpZmllZCBhbmQgbm9uLWVtcHR5Jyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnByb2plY3ROYW1lIHx8IHRoaXMucHJvamVjdE5hbWUudHJpbSgpID09PSAnJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0IG5hbWUgbXVzdCBiZSBzcGVjaWZpZWQgYW5kIG5vbi1lbXB0eScpO1xuICAgIH1cblxuICAgIC8vIFZhbGlkYXRlIGVudmlyb25tZW50IG5hbWVcbiAgICBjb25zdCB2YWxpZEVudmlyb25tZW50cyA9IFsnYWxwaGEnLCAnYmV0YScsICdwcm9kJ107XG4gICAgaWYgKHZhbGlkRW52aXJvbm1lbnRzLmluZGV4T2YodGhpcy5lbnZpcm9ubWVudC50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBlbnZpcm9ubWVudDogJHt0aGlzLmVudmlyb25tZW50fS4gTXVzdCBiZSBvbmUgb2Y6ICR7dmFsaWRFbnZpcm9ubWVudHMuam9pbignLCAnKX1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZW52aXJvbm1lbnQtc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cbiAgICogU3RyYXRlZ3kgcGF0dGVybiAtIGRpZmZlcmVudCBlbnZpcm9ubWVudHMgY2FuIGhhdmUgZGlmZmVyZW50IGNvbmZpZ3VyYXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJucyBFbnZpcm9ubWVudC1zcGVjaWZpYyBjb25maWd1cmF0aW9uIG9iamVjdFxuICAgKi9cbiAgcHJvdGVjdGVkIGdldEVudmlyb25tZW50Q29uZmlnKCk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGNvbnN0IGJhc2VDb25maWcgPSB7XG4gICAgICBwcm9qZWN0TmFtZTogdGhpcy5wcm9qZWN0TmFtZSxcbiAgICAgIGVudmlyb25tZW50OiB0aGlzLmVudmlyb25tZW50LFxuICAgIH07XG5cbiAgICAvLyBFbnZpcm9ubWVudC1zcGVjaWZpYyBjb25maWd1cmF0aW9uc1xuICAgIHN3aXRjaCAodGhpcy5lbnZpcm9ubWVudC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdhbHBoYSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uYmFzZUNvbmZpZyxcbiAgICAgICAgICBlbmFibGVEZXRhaWxlZE1vbml0b3Jpbmc6IGZhbHNlLFxuICAgICAgICAgIGVuYWJsZURlbGV0aW9uUHJvdGVjdGlvbjogZmFsc2UsXG4gICAgICAgICAgYmFja3VwUmV0ZW50aW9uRGF5czogMSxcbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYmV0YSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uYmFzZUNvbmZpZyxcbiAgICAgICAgICBlbmFibGVEZXRhaWxlZE1vbml0b3Jpbmc6IHRydWUsXG4gICAgICAgICAgZW5hYmxlRGVsZXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgICBiYWNrdXBSZXRlbnRpb25EYXlzOiA3LFxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwcm9kJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5iYXNlQ29uZmlnLFxuICAgICAgICAgIGVuYWJsZURldGFpbGVkTW9uaXRvcmluZzogdHJ1ZSxcbiAgICAgICAgICBlbmFibGVEZWxldGlvblByb3RlY3Rpb246IHRydWUsXG4gICAgICAgICAgYmFja3VwUmV0ZW50aW9uRGF5czogMzAsXG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBiYXNlQ29uZmlnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGNvbnN0cnVjdCBjcmVhdGlvbiBmb3IgZGVidWdnaW5nIHB1cnBvc2VzLlxuICAgKiBGb2xsb3dzIGNvbnNpc3RlbnQgbG9nZ2luZyBwYXR0ZXJuIGFjcm9zcyBhbGwgY29uc3RydWN0cy5cbiAgICovXG4gIHByb3RlY3RlZCBsb2dDb25zdHJ1Y3RDcmVhdGlvbigpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhgQ3JlYXRpbmcgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IGZvciAke3RoaXMucHJvamVjdE5hbWV9IGluICR7dGhpcy5lbnZpcm9ubWVudH0gZW52aXJvbm1lbnRgKTtcbiAgfVxufVxuIl19