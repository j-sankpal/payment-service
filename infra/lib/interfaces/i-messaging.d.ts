import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Topic } from 'aws-cdk-lib/aws-sns';
/**
 * Messaging interface following Interface Segregation Principle.
 * Defines only the messaging-related capabilities that clients need.
 */
export interface IMessaging {
    /** SQS queue for message processing */
    readonly queue: Queue;
    /** SNS topic for event broadcasting */
    readonly topic: Topic;
    /**
     * Grants permissions to send messages to the queue.
     * Follows Principle of Least Privilege.
     *
     * @param identity - The identity to grant permissions to
     */
    grantSendMessages(identity: IGrantable): void;
    /**
     * Grants permissions to publish messages to the topic.
     * Follows Principle of Least Privilege.
     *
     * @param identity - The identity to grant permissions to
     */
    grantPublishMessages(identity: IGrantable): void;
    /**
     * Grants permissions to consume messages from the queue.
     * Follows Principle of Least Privilege.
     *
     * @param identity - The identity to grant permissions to
     */
    grantConsumeMessages(identity: IGrantable): void;
}
