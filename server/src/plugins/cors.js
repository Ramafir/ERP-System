const config = require('../config');
const cors = require('cors');

module.exports = app => {
    const originsWhitelist = [
        'http://localhost:8000',
        'http://localhost:8080',
        'http://localhost:8081'
    ];

    const corsOptions = {
        origin: function (origin, callback) {
            if (originsWhitelist.includes(origin) || origin === undefined) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };

    app.use(cors(corsOptions));
};
