import { IStorage } from './i-storage';
import { IApi } from './i-api';
import { IMessaging } from './i-messaging';
/**
 * Monitoring interface following Interface Segregation Principle.
 * Defines only the monitoring-related capabilities that clients need.
 */
export interface IMonitoring {
    /**
     * Adds monitoring for storage components.
     * Follows Single Responsibility by focusing only on storage monitoring.
     *
     * @param storage - The storage components to monitor
     */
    addStorageMonitoring(storage: IStorage): void;
    /**
     * Adds monitoring for API components.
     * Follows Single Responsibility by focusing only on API monitoring.
     *
     * @param api - The API components to monitor
     */
    addApiMonitoring(api: IApi): void;
    /**
     * Adds monitoring for messaging components.
     * Follows Single Responsibility by focusing only on messaging monitoring.
     *
     * @param messaging - The messaging components to monitor
     */
    addMessagingMonitoring(messaging: IMessaging): void;
    /**
     * Creates a comprehensive dashboard for all components.
     * Follows Facade pattern by providing a unified monitoring interface.
     *
     * @param storage - Storage components
     * @param api - API components
     * @param messaging - Messaging components
     */
    createDashboard(storage: IStorage, api: IApi, messaging: IMessaging): void;
}
