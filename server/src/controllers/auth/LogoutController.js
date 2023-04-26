const { StatusCodes } = require('http-status-codes');

class LogoutController {
    async invoke(req, res, next) {
        if (req.session) {
            req.session.destroy();
        }

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = LogoutController;
