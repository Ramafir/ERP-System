import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import router from '../router';
import config from '@/config';

export default Vue => {
    if (!config.sentry.dsn) {
        return;
    }

    Sentry.init({
        Vue,
        dsn: config.sentry.dsn,
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
            })
        ],
        tracesSampleRate: 1.0
    });
};
