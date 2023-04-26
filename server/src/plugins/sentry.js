const Sentry = require('@sentry/node');
const SentryTracing = require('@sentry/tracing');
const { sentry } = require('../config');

module.exports = app => {
    if (!sentry.dsn) {
        return;
    }

    Sentry.init({
        dsn: sentry.dsn,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new SentryTracing.Integrations.Express({ app })
        ],
        tracesSampleRate: 1.0
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.errorHandler());
    app.use(Sentry.Handlers.tracingHandler());
};
