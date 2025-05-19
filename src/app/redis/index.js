const { createClient } = require("redis");
const createRedis = createClient({
  url: "redis://default:kQORT8XtTrY33qjcAHIgxZKHHySA5Mbe@redis-19506.c246.us-east-1-4.ec2.redns.redis-cloud.com:19506", // adjust if using Docker or remote Redis
});
const connectRedis = async () => {
  createRedis.on("error", (err) => console.error("Redis error:", err));
  await createRedis.connect();
  console.log("✅ Redis connected");
};

const setRedis = async (key, value) => {
  await createRedis.set(key, value);
  console.log("success");
};
const getRedis = async (key) => {
  const result = await createRedis.get(key);
  return result;
};
module.exports = { connectRedis, setRedis, getRedis };
