import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { BaseConstruct, BaseConstructProps } from '../base/base-construct';
/**
 * Properties for DynamoDB table construct.
 * Extends base construct props with table-specific configuration.
 */
export interface DynamoDbTableProps extends BaseConstructProps {
    /** Table name suffix */
    readonly tableName: string;
    /** Partition key name */
    readonly partitionKey: string;
    /** Sort key name (optional) */
    readonly sortKey?: string;
}
/**
 * DynamoDB table construct following Single Responsibility Principle.
 * Handles only DynamoDB table creation and configuration.
 */
export declare class DynamoDbTable extends BaseConstruct {
    /** The DynamoDB table */
    readonly table: Table;
    constructor(scope: Construct, id: string, props: DynamoDbTableProps);
    /**
     * Determines the removal policy based on environment.
     * Alpha: Destroy (cost-effective), Beta/Prod: Retain (data safety)
     */
    private getRemovalPolicy;
    /**
     * Determines if point-in-time recovery should be enabled.
     * Only enabled for production environment.
     */
    private shouldEnablePointInTimeRecovery;
    /**
     * Determines if DynamoDB streams should be enabled.
     * Enabled for beta and prod environments.
     */
    private shouldEnableStreams;
}
