const env = (key, defaultValue = null) => process.env[key] || defaultValue;

const config = {
    apiUrl: env('VUE_APP_API_URL', 'http://localhost:3000/api'),
    sentry: {
        dsn: env('VUE_APP_SENTRY_DSN')
    }
};

export default config;
