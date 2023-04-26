const { cache } = require('../config');

class CacheService {
    constructor(redis) {
        this.redis = redis;
    }

    get(key = null) {
        return new Promise((resolve, reject) => {
            if (!key) {
                resolve(null);
            }

            this.redis.get(key, (error, result) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }

                if (!result) {
                    resolve(null);
                }

                resolve(JSON.parse(result));
            });
        });
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            const jsonValue = JSON.stringify(value);

            if (cache.keyExpiresInMinutes === 0) {
                this.redis.set(key, jsonValue, () => {
                    resolve();
                });
            } else {
                this.redis.setex(
                    key,
                    cache.keyExpiresInMinutes * 60,
                    jsonValue,
                    () => {
                        resolve();
                    }
                );
            }
        });
    }

    forget(key) {
        return new Promise((resolve, reject) => {
            this.redis.del(key, () => {
                resolve();
            });
        });
    }

    exists(key) {
        return new Promise((resolve, reject) => {
            this.redis.exists(key, (error, exists) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }

                resolve(exists);
            });
        });
    }

    _eachScan(pattern, eachScanCallback, callback) {
        let matchingKeysCount = 0;

        const recursiveScan = (cursor = 0) => {
            this.redis.scan(cursor, 'MATCH', pattern, (err, data) => {
                if (err) {
                    callback(err);
                } else {
                    const [cursor, matchingKeys] = data;

                    matchingKeysCount += matchingKeys.length;
                    eachScanCallback(matchingKeys);

                    if (cursor === '0') {
                        callback(null, matchingKeysCount);
                    } else {
                        recursiveScan(cursor);
                    }
                }
            });
        };

        recursiveScan();
    }

    runActionOnKeyPattern(pattern, callback) {
        let keys = [];

        this._eachScan(
            pattern,
            matchingKeys => {
                keys = keys.concat(matchingKeys);
            },
            (err, count) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, keys);
                }
            }
        );
    }

    forgetByPattern(pattern) {
        return new Promise((resolve, reject) => {
            this.runActionOnKeyPattern(pattern, async (error, keys) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }

                for (const key of keys) {
                    try {
                        await this.forget(key);
                    } catch (error) {
                        reject(error);
                    }
                }

                resolve();
            });
        });
    }

    async close() {
        await new Promise(resolve => {
            this.redis.quit(() => {
                resolve();
            });
        });
        await new Promise(resolve => setImmediate(resolve));
    }
}

module.exports = CacheService;
