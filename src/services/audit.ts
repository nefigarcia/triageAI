import { producer, connectProducer } from '@/lib/kafka';

const AUDIT_TOPIC = 'agent-activity-events';

interface AuditEvent {
    actor: {
        type: 'user' | 'ai' | 'system' | 'customer';
        id?: string;
        name: string;
    };
    action: string;
    timestamp?: string;
    details?: Record<string, any>;
}

/**
 * Sends an audit event to the Kafka topic.
 * @param event The audit event to send.
 */
export async function sendAuditEvent(event: AuditEvent) {
    if (!producer) {
        console.log('Kafka producer not available. Skipping audit event.');
        return;
    }

    try {
        // Ensure the producer is connected before sending a message.
        await connectProducer();
        
        const message = {
            ...event,
            timestamp: new Date().toISOString(),
        };

        await producer.send({
            topic: AUDIT_TOPIC,
            messages: [{ value: JSON.stringify(message) }],
        });

        console.log(`Sent audit event to topic "${AUDIT_TOPIC}":`, message);

    } catch (error) {
        console.error('Failed to send audit event to Kafka:', error);
        // Depending on the importance, you might want to implement a retry mechanism
        // or a fallback to a different logging system.
    }
}
