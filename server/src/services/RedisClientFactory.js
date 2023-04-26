const { createClient } = require('redis');
const { redis } = require('../config');

class RedisClientFactory {
    static create() {
        const redisClient = createClient({
            url: redis.url,
            legacyMode: true
        });
        redisClient.connect().catch(console.error);

        console.log('Redis client is running!');

        return redisClient;
    }
}

module.exports = RedisClientFactory;
