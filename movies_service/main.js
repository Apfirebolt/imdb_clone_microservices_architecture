import app from "./app.js";
import connectDB from "./config/db.js";
import { runUserSyncConsumer } from "./utils/consumer.js";
// import { connectProducer } from "./server/utils/kafkaConnect.js";

connectDB();
runUserSyncConsumer();
// connectProducer();

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);