const { app: application } = require('../config');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const THREE_HOURS = 1000 * 60 * 60 * 3;

module.exports = app => {
    const di = app.get('di');

    const sessionData = {
        store: new RedisStore({
            client: di.get('services.redisClient')
        }),
        name: 'SessionID',
        secret: application.secret,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: THREE_HOURS,
            sameSite: true,
            secure: false
        }
    };

    app.use(session(sessionData));
};
