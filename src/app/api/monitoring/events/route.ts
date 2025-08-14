
import { kafka } from '@/lib/kafka';
import type { Consumer } from 'kafkajs';

export const dynamic = 'force-dynamic';

const AUDIT_TOPIC = 'agent-activity-events';

export async function GET(request: Request) {
    if (!kafka) {
        return new Response('Kafka is not configured.', { status: 500 });
    }
    
    // Create a new consumer for each request
    const consumer = kafka.consumer({ groupId: `triage-ai-monitoring-${Date.now()}` });
    let consumerConnected = false;

    const stream = new ReadableStream({
        async start(controller) {
            try {
                await consumer.connect();
                consumerConnected = true;
                await consumer.subscribe({ topic: AUDIT_TOPIC, fromBeginning: false });
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
            }

            // Handle client disconnection
            request.signal.onabort = async () => {
                console.log("Client disconnected, stopping Kafka consumer.");
                if (consumerConnected) {
                    try {
                        await consumer.disconnect();
                    } catch (disconnectError) {
                        console.error("Error disconnecting Kafka consumer:", disconnectError);
                    }
                }
                controller.close();
            };
        },
        async cancel() {
            console.log("Stream cancelled by client.");
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
