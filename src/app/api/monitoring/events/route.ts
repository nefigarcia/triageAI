
import { consumer } from '@/lib/kafka';

export const dynamic = 'force-dynamic';

const AUDIT_TOPIC = 'agent-activity-events';

export async function GET(request: Request) {
    if (!consumer) {
        return new Response('Kafka is not configured.', { status: 500 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            try {
                await consumer.connect();
                await consumer.subscribe({ topic: AUDIT_TOPIC, fromBeginning: false });
                console.log(`Kafka Consumer subscribed to topic "${AUDIT_TOPIC}"`);
                
                await consumer.run({
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
                try {
                    await consumer.disconnect();
                } catch (disconnectError) {
                    console.error("Error disconnecting Kafka consumer:", disconnectError);
                } finally {
                    controller.close();
                }
            };
        },
        cancel() {
            console.log("Stream cancelled by client.");
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
