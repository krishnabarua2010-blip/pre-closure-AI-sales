"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedis = getRedis;
exports.getQueue = getQueue;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let redisClient = null;
function getRedis() {
    if (!process.env.REDIS_URL) {
        console.log("⚠️ Redis disabled");
        return null;
    }
    if (!redisClient) {
        redisClient = new ioredis_1.default(process.env.REDIS_URL);
        redisClient.on('error', (err) => console.error('Redis error:', err));
    }
    return redisClient;
}
let queue = null;
function getQueue() {
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
