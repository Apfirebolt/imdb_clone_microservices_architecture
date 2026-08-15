import { Kafka } from "kafkajs";
import User from "../models/user.js";

const kafka = new Kafka({
  clientId: "movies-user-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "movies-user-sync-group",
});

const TOPIC = "imdb_clone_users";

export const runUserSyncConsumer = async () => {
  try {
    await consumer.connect();
    console.log("✅ Kafka User Consumer connected.");

    await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (!message.value) {
            console.warn(`[${TOPIC}] Received empty message body.`);
            return;
          }

          // 1. Parse incoming message
          const userData = JSON.parse(message.value.toString());
          const { id, email, isAdmin, userType } = userData;

          console.log(`[${TOPIC}] Processing user event: ${email} (ID: ${id})`);

          // 2. Upsert user in movies database to handle duplicates safely
          await User.findOneAndUpdate(
            { id },
            {
              id,
              email,
              isAdmin,
              userType: userType || "member",
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          console.log(`[User Sync] Successfully saved/updated user: ${id}`);
        } catch (error) {
          console.error(
            `Error processing message from topic ${topic}:`,
            error.message
          );
        }
      },
    });

    console.log(`🚀 User Sync Consumer is running for topic: ${TOPIC}`);
  } catch (error) {
    console.error("Failed to start user sync consumer:", error);
  }
};