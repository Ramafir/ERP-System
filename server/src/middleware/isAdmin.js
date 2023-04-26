const { StatusCodes } = require('http-status-codes');

async function isAdmin(request, response, next) {
    if (await request.loggedInUser.isAdmin()) {
        return next();
    }

    return response.sendStatus(StatusCodes.FORBIDDEN);
}

module.exports = isAdmin;
