const { startDevServer } = require('@cypress/webpack-dev-server');
const webpackConfig = require('@vue/cli-service/webpack.config');

module.exports = on => {
    on('dev-server:start', options => {
        return startDevServer({
            options,
            webpackConfig
        });
    });
};
