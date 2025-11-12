#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const payment_service_stack_1 = require("../lib/stacks/payment-service-stack");
/**
 * CDK Application entry point following Clean Architecture principles.
 * Acts as the composition root for infrastructure deployment.
 * Follows Dependency Inversion Principle by depending on abstractions.
 */
const app = new aws_cdk_lib_1.App();
// Environment configurations following Infrastructure as Code best practices
const environments = {
    alpha: {
        account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
        region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
    },
    beta: {
        account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
        region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
    },
    prod: {
        account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
        region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
    },
};
/**
 * Validates environment configuration before deployment.
 * Follows Fail Fast principle by validating early.
 */
function validateEnvironmentConfig() {
    const requiredEnvVars = ['CDK_DEFAULT_ACCOUNT', 'CDK_DEFAULT_REGION'];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.error(`❌ Required environment variable ${envVar} is not set`);
            console.error('Please run:');
            console.error(`  export ${envVar}="your-value"`);
            process.exit(1);
        }
    }
    console.log('✅ Environment configuration validated');
}
/**
 * Creates and configures stacks for each environment.
 * Follows Factory pattern for stack creation.
 */
function createStacks() {
    const environmentsToDeploy = process.env.ENVIRONMENTS?.split(',') || ['alpha'];
    console.log(`🚀 Deploying PaymentService to environments: ${environmentsToDeploy.join(', ')}`);
    for (const env of environmentsToDeploy) {
        if (!environments[env]) {
            console.error(`❌ Unknown environment: ${env}`);
            console.error(`Available environments: ${Object.keys(environments).join(', ')}`);
            process.exit(1);
        }
        console.log(`📦 Creating stack for ${env} environment...`);
        new payment_service_stack_1.PaymentServiceStack(app, `PaymentService-${env.charAt(0).toUpperCase() + env.slice(1)}`, {
            env: environments[env],
            environment: env,
            description: `Payment Service ${env} environment infrastructure`,
            tags: {
                Project: 'PaymentService',
                Environment: env,
                ManagedBy: 'CDK',
                CreatedAt: new Date().toISOString(),
            },
        });
        console.log(`✅ Stack created for ${env} environment`);
    }
}
/**
 * Main application execution following Clean Architecture principles.
 * Separates concerns: validation, stack creation, synthesis.
 */
function main() {
    try {
        console.log('🏗️  Payment Service CDK Application Starting...');
        // Validate configuration
        validateEnvironmentConfig();
        // Create infrastructure stacks
        createStacks();
        // Synthesize CloudFormation templates
        console.log('🔄 Synthesizing CloudFormation templates...');
        app.synth();
        console.log('🎉 CDK Application completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('  cdk deploy PaymentService-Alpha  # Deploy to alpha environment');
        console.log('  cdk deploy PaymentService-Beta   # Deploy to beta environment');
        console.log('  cdk deploy PaymentService-Prod   # Deploy to production');
    }
    catch (error) {
        console.error('❌ CDK Application failed:', error);
        process.exit(1);
    }
}
// Execute the application
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF5bWVudC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyw2Q0FBK0M7QUFDL0MsK0VBQTBFO0FBRTFFOzs7O0dBSUc7QUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0Qiw2RUFBNkU7QUFDN0UsTUFBTSxZQUFZLEdBQWdDO0lBQ2hELEtBQUssRUFBRTtRQUNMLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztRQUN0RSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxXQUFXO0tBQ2hGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO1FBQ3RFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLFdBQVc7S0FDaEY7SUFDRCxJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7UUFDdEUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksV0FBVztLQUNoRjtDQUNGLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxTQUFTLHlCQUF5QjtJQUNoQyxNQUFNLGVBQWUsR0FBRyxDQUFDLHFCQUFxQixFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFFdEUsS0FBSyxNQUFNLE1BQU0sSUFBSSxlQUFlLEVB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QywyREFBMkQsQ0FBQyxDQUFDO0lBRTNFLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7QUFDSCxDQUFDO0FBRUQsMEJBQTBCO0FBQzFCLElBQUksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IHsgQXBwLCBFbnZpcm9ubWVudCB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFBheW1lbnRTZXJ2aWNlU3RhY2sgfSBmcm9tICcuLi9saWIvc3RhY2tzL3BheW1lbnQtc2VydmljZS1zdGFjayc7XG5cbi8qKlxuICogQ0RLIEFwcGxpY2F0aW9uIGVudHJ5IHBvaW50IGZvbGxvd2luZyBDbGVhbiBBcmNoaXRlY3R1cmUgcHJpbmNpcGxlcy5cbiAqIEFjdHMgYXMgdGhlIGNvbXBvc2l0aW9uIHJvb3QgZm9yIGluZnJhc3RydWN0dXJlIGRlcGxveW1lbnQuXG4gKiBGb2xsb3dzIERlcGVuZGVuY3kgSW52ZXJzaW9uIFByaW5jaXBsZSBieSBkZXBlbmRpbmcgb24gYWJzdHJhY3Rpb25zLlxuICovXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbi8vIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb25zIGZvbGxvd2luZyBJbmZyYXN0cnVjdHVyZSBhcyBDb2RlIGJlc3QgcHJhY3RpY2VzXG5jb25zdCBlbnZpcm9ubWVudHM6IFJlY29yZDxzdHJpbmcsIEVudmlyb25tZW50PiA9IHtcbiAgYWxwaGE6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5UIHx8IHByb2Nlc3MuZW52LkFXU19BQ0NPVU5UX0lELFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIHx8IHByb2Nlc3MuZW52LkFXU19SRUdJT04gfHwgJ3VzLWVhc3QtMScsXG4gIH0sXG4gIGJldGE6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5UIHx8IHByb2Nlc3MuZW52LkFXU19BQ0NPVU5UX0lELFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIHx8IHByb2Nlc3MuZW52LkFXU19SRUdJT04gfHwgJ3VzLWVhc3QtMScsXG4gIH0sXG4gIHByb2Q6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5UIHx8IHByb2Nlc3MuZW52LkFXU19BQ0NPVU5UX0lELFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIHx8IHByb2Nlc3MuZW52LkFXU19SRUdJT04gfHwgJ3VzLWVhc3QtMScsXG4gIH0sXG59O1xuXG4vKipcbiAqIFZhbGlkYXRlcyBlbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIGJlZm9yZSBkZXBsb3ltZW50LlxuICogRm9sbG93cyBGYWlsIEZhc3QgcHJpbmNpcGxlIGJ5IHZhbGlkYXRpbmcgZWFybHkuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRW52aXJvbm1lbnRDb25maWcoKTogdm9pZCB7XG4gIGNvbnN0IHJlcXVpcmVkRW52VmFycyA9IFsnQ0RLX0RFRkFVTFRfQUNDT1VOVCcsICdDREtfREVGQVVMVF9SRUdJT04nXTtcblxuICBmb3IgKGNvbnN0IGVudlZhciBvZiByZXF1aXJlZEVudlZhcnMpIHtcbiAgICBpZiAoIXByb2Nlc3MuZW52W2VudlZhcl0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYOKdjCBSZXF1aXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZSAke2VudlZhcn0gaXMgbm90IHNldGApO1xuICAgICAgY29uc29sZS5lcnJvcignUGxlYXNlIHJ1bjonKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYCAgZXhwb3J0ICR7ZW52VmFyfT1cInlvdXItdmFsdWVcImApO1xuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUubG9nKCfinIUgRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiB2YWxpZGF0ZWQnKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBjb25maWd1cmVzIHN0YWNrcyBmb3IgZWFjaCBlbnZpcm9ubWVudC5cbiAqIEZvbGxvd3MgRmFjdG9yeSBwYXR0ZXJuIGZvciBzdGFjayBjcmVhdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3RhY2tzKCk6IHZvaWQge1xuICBjb25zdCBlbnZpcm9ubWVudHNUb0RlcGxveSA9IHByb2Nlc3MuZW52LkVOVklST05NRU5UUz8uc3BsaXQoJywnKSB8fCBbJ2FscGhhJ107XG5cbiAgY29uc29sZS5sb2coYPCfmoAgRGVwbG95aW5nIFBheW1lbnRTZXJ2aWNlIHRvIGVudmlyb25tZW50czogJHtlbnZpcm9ubWVudHNUb0RlcGxveS5qb2luKCcsICcpfWApO1xuXG4gIGZvciAoY29uc3QgZW52IG9mIGVudmlyb25tZW50c1RvRGVwbG95KSB7XG4gICAgaWYgKCFlbnZpcm9ubWVudHNbZW52XSkge1xuICAgICAgY29uc29sZS5lcnJvcihg4p2MIFVua25vd24gZW52aXJvbm1lbnQ6ICR7ZW52fWApO1xuICAgICAgY29uc29sZS5lcnJvcihgQXZhaWxhYmxlIGVudmlyb25tZW50czogJHtPYmplY3Qua2V5cyhlbnZpcm9ubWVudHMpLmpvaW4oJywgJyl9YCk7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYPCfk6YgQ3JlYXRpbmcgc3RhY2sgZm9yICR7ZW52fSBlbnZpcm9ubWVudC4uLmApO1xuXG4gICAgbmV3IFBheW1lbnRTZXJ2aWNlU3RhY2soYXBwLCBgUGF5bWVudFNlcnZpY2UtJHtlbnYuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBlbnYuc2xpY2UoMSl9YCwge1xuICAgICAgZW52OiBlbnZpcm9ubWVudHNbZW52XSxcbiAgICAgIGVudmlyb25tZW50OiBlbnYsXG4gICAgICBkZXNjcmlwdGlvbjogYFBheW1lbnQgU2VydmljZSAke2Vudn0gZW52aXJvbm1lbnQgaW5mcmFzdHJ1Y3R1cmVgLFxuICAgICAgdGFnczoge1xuICAgICAgICBQcm9qZWN0OiAnUGF5bWVudFNlcnZpY2UnLFxuICAgICAgICBFbnZpcm9ubWVudDogZW52LFxuICAgICAgICBNYW5hZ2VkQnk6ICdDREsnLFxuICAgICAgICBDcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhg4pyFIFN0YWNrIGNyZWF0ZWQgZm9yICR7ZW52fSBlbnZpcm9ubWVudGApO1xuICB9XG59XG5cbi8qKlxuICogTWFpbiBhcHBsaWNhdGlvbiBleGVjdXRpb24gZm9sbG93aW5nIENsZWFuIEFyY2hpdGVjdHVyZSBwcmluY2lwbGVzLlxuICogU2VwYXJhdGVzIGNvbmNlcm5zOiB2YWxpZGF0aW9uLCBzdGFjayBjcmVhdGlvbiwgc3ludGhlc2lzLlxuICovXG5mdW5jdGlvbiBtYWluKCk6IHZvaWQge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKCfwn4+X77iPICBQYXltZW50IFNlcnZpY2UgQ0RLIEFwcGxpY2F0aW9uIFN0YXJ0aW5nLi4uJyk7XG5cbiAgICAvLyBWYWxpZGF0ZSBjb25maWd1cmF0aW9uXG4gICAgdmFsaWRhdGVFbnZpcm9ubWVudENvbmZpZygpO1xuXG4gICAgLy8gQ3JlYXRlIGluZnJhc3RydWN0dXJlIHN0YWNrc1xuICAgIGNyZWF0ZVN0YWNrcygpO1xuXG4gICAgLy8gU3ludGhlc2l6ZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZXNcbiAgICBjb25zb2xlLmxvZygn8J+UhCBTeW50aGVzaXppbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVzLi4uJyk7XG4gICAgYXBwLnN5bnRoKCk7XG5cbiAgICBjb25zb2xlLmxvZygn8J+OiSBDREsgQXBwbGljYXRpb24gY29tcGxldGVkIHN1Y2Nlc3NmdWxseSEnKTtcbiAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgY29uc29sZS5sb2coJ05leHQgc3RlcHM6Jyk7XG4gICAgY29uc29sZS5sb2coJyAgY2RrIGRlcGxveSBQYXltZW50U2VydmljZS1BbHBoYSAgIyBEZXBsb3kgdG8gYWxwaGEgZW52aXJvbm1lbnQnKTtcbiAgICBjb25zb2xlLmxvZygnICBjZGsgZGVwbG95IFBheW1lbnRTZXJ2aWNlLUJldGEgICAjIERlcGxveSB0byBiZXRhIGVudmlyb25tZW50Jyk7XG4gICAgY29uc29sZS5sb2coJyAgY2RrIGRlcGxveSBQYXltZW50U2VydmljZS1Qcm9kICAgIyBEZXBsb3kgdG8gcHJvZHVjdGlvbicpO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcign4p2MIENESyBBcHBsaWNhdGlvbiBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfVxufVxuXG4vLyBFeGVjdXRlIHRoZSBhcHBsaWNhdGlvblxubWFpbigpO1xuIl19