require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

if (!['production', 'development', 'test'].includes(env('NODE_ENV'))) {
    console.error('NODE_ENV has wrong option');
    process.exit();
}

const config = {
    app: {
        secret: env('APP_SECRET'),
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:3001'),
        port: parseInt(env('PORT', 3001)),
        frontendUrl: env('APP_FRONTEND_URL')
    },
    db: {
        url:
            env('DATABASE_DIALECT', 'mysql') +
            '://' +
            env('DATABASE_USERNAME', 'guest') +
            ':' +
            env('DATABASE_PASSWORD', 'guest') +
            '@' +
            env('DATABASE_HOST', 'localhost') +
            ':' +
            env('DATABASE_PORT', 3306) +
            '/' +
            env('DATABASE_NAME', 'db'),
        host: env('DATABASE_HOST', 'localhost'),
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        dialect: env('DATABASE_DIALECT', 'mysql'),
        port: parseInt(env('DATABASE_PORT', 3306)),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false
        }
    },
    redis: {
        host: env('SESSION_REDIS_HOST'),
        port: env('SESSION_REDIS_PORT'),
        password: env('SESSION_REDIS_PASS') || undefined,
        pass: env('SESSION_REDIS_PASS') || undefined,
        url:
            'redis://' +
            (env('SESSION_REDIS_PASS')
                ? ':' + env('SESSION_REDIS_PASS') + '@'
                : '') +
            env('SESSION_REDIS_HOST') +
            ':' +
            env('SESSION_REDIS_PORT')
    },
    sentry: {
        dsn: env('SENTRY_DSN')
    },
    cache: {
        enable: isEnabled('CACHE_ENABLE'),
        keyExpiresInMinutes: parseInt(env('CACHE_KEY_EXPIRES_IN_MINUTES'))
    }
};

module.exports = config;
