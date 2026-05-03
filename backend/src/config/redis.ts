import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis | null = null;
export function getRedis() {
  if (!process.env.REDIS_URL) {
    console.log("⚠️ Redis disabled");
    return null;
  }
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL);
    redisClient.on('error', (err) => console.error('Redis error:', err));
  }
  return redisClient;
}

let queue: any = null;
export function getQueue() {
  if (!process.env.REDIS_URL) {
    console.log("⚠️ Redis disabled");
    return null;
  }

  if (!queue) {
    const { Queue } = require("bullmq");
    queue = new Queue("jobs", {
      connection: { url: process.env.REDIS_URL },
    });
  }

  return queue;
}
