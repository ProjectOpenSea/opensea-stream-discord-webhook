'use strict';

import * as dotenv from "dotenv";
import * as redis from "redis";

// Environment variables
dotenv.config();

const {
  REDIS_URL,
  REDIS_CA = ''
} = process.env;


const options = {
  url: REDIS_URL,
  enable_offline_queue: true,
  no_ready_check: true,
  tls: {},
  retry_strategy: (options: any) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
};

if (REDIS_CA !== '') {
  options.tls = {
    cert: REDIS_CA,
    ca: [ REDIS_CA ]
  };
}

const RedisClient = (() => {
  const client = redis.createClient(options);
  client.connect();
  return client;
});

const redisClient = RedisClient();

export const getBotEnabled = async () => {
  const value = await redisClient.get('BOT_ENABLED');
  console.log(`BOT_ENABLED value: ${value}`);
  return value === "true";
};

export const setBotEnabled = (value: boolean) => {
  if (value) {
    redisClient.set('BOT_ENABLED', 'true');
    console.log('Set redis value for BOT_ENABLED to true');
  } else {
    redisClient.set('BOT_ENABLED', 'false');
    console.log('Set redis value for BOT_ENABLED to false');
  }
};