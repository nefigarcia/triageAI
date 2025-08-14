
import { kafka } from '@/lib/kafka';
import type { Consumer } from 'kafkajs';

export const dynamic = 'force-dynamic';

const AUDIT_TOPIC = 'agent-activity-events';

export async function GET(request: Request) {
    if (!kafka) {
        return new Response('Kafka is not configured.', { status: 500 });
    }
    
    // Create a new consumer for each request to ensure isolation.
    const consumer = kafka.consumer({ groupId: `triage-ai-monitoring-${Date.now()}` });
    let consumerConnected = false;

    const stream = new ReadableStream({
        async start(controller) {
            const handleDisconnect = async () => {
                if (consumerConnected) {
                    try {
                        await consumer.disconnect();
                        console.log("Kafka consumer disconnected successfully.");
                    } catch (disconnectError) {
                        console.error("Error disconnecting Kafka consumer:", disconnectError);
                    }
                }
                if (!controller.desiredSize) {
                    controller.close();
                }
            };
            
            request.signal.onabort = () => {
                console.log("Client disconnected, stopping Kafka consumer.");
                handleDisconnect();
            };

            try {
                await consumer.connect();
                consumerConnected = true;
                // Set fromBeginning to true to see past events when you first connect.
                await consumer.subscribe({ topic: AUDIT_TOPIC, fromBeginning: true });
                console.log(`Kafka Consumer subscribed to topic "${AUDIT_TOPIC}"`);
                
                consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                        const messageValue = message.value?.toString();
                        if (messageValue) {
                            console.log("Received event from Kafka, sending to client");
                            controller.enqueue(`data: ${messageValue}\n\n`);
                        }
                    },
                });

            } catch (error) {
                console.error("Error in Kafka consumer stream:", error);
                controller.error(error);
                handleDisconnect();
            }
        },
        async cancel(reason) {
            console.log("Stream cancelled by client.", reason);
            if (consumerConnected) {
                try {
                    await consumer.disconnect();
                } catch (disconnectError) {
                    console.error("Error disconnecting Kafka consumer:", disconnectError);
                }
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
        },
    });
}
