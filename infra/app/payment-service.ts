#!/usr/bin/env node
import 'source-map-support/register';
import { App, Environment } from 'aws-cdk-lib';
import { PaymentServiceStack } from '../lib/stacks/payment-service-stack';

/**
 * CDK Application entry point following Clean Architecture principles.
 * Acts as the composition root for infrastructure deployment.
 * Follows Dependency Inversion Principle by depending on abstractions.
 */
const app = new App();

// Environment configurations following Infrastructure as Code best practices
const environments: Record<string, Environment> = {
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
 * Validates environment configuration.
 * Only requires region for basic operations.
 * AWS account is handled by CDK bootstrap/deployment.
 */
function validateEnvironmentConfig(): void {
  const requiredEnvVars = ['CDK_DEFAULT_REGION'];

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Required environment variable ${envVar} is not set`);
      console.error('Please run:');
      console.error(`  export ${envVar}="us-east-1"`);
      process.exit(1);
    }
  }

  // Note: CDK_DEFAULT_ACCOUNT is optional and will be handled by CDK
  // For synthesis/testing, dummy values can be used
  // For deployment, proper AWS credentials are required

  console.log('✅ Environment configuration validated');
}

/**
 * Creates and configures stacks for each environment.
 * Follows Factory pattern for stack creation.
 */
function createStacks(): void {
  const environmentsToDeploy = process.env.ENVIRONMENTS?.split(',') || ['alpha'];

  console.log(`🚀 Deploying PaymentService to environments: ${environmentsToDeploy.join(', ')}`);

  for (const env of environmentsToDeploy) {
    if (!environments[env]) {
      console.error(`❌ Unknown environment: ${env}`);
      console.error(`Available environments: ${Object.keys(environments).join(', ')}`);
      process.exit(1);
    }

    console.log(`📦 Creating stack for ${env} environment...`);

    new PaymentServiceStack(app, `PaymentService-${env.charAt(0).toUpperCase() + env.slice(1)}`, {
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
function main(): void {
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

  } catch (error) {
    console.error('❌ CDK Application failed:', error);
    process.exit(1);
  }
}

// Execute the application
main();
