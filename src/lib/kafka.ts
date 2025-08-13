import { Kafka } from 'kafkajs';

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : [];

// We only initialize Kafka if the brokers are configured.
// This allows the app to run without Kafka for local development if needed.
const kafka = brokers.length > 0 ? new Kafka({
  clientId: 'triage-ai',
  brokers: brokers,
}) : null;

export const producer = kafka ? kafka.producer() : null;
export const consumer = kafka ? kafka.consumer({ groupId: 'triage-ai-monitoring' }) : null;

let isProducerConnected = false;

export async function connectProducer() {
    if (producer && !isProducerConnected) {
        try {
            await producer.connect();
            isProducerConnected = true;
            console.log('Kafka Producer connected');
        } catch (error) {
            console.error('Could not connect Kafka Producer:', error);
            // Implement retry logic or handle the failure appropriately
        }
    }
}
