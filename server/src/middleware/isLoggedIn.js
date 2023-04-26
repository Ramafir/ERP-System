const { StatusCodes } = require('http-status-codes');

async function isLoggedIn(request, response, next) {
    const di = request.app.get('di');
    const userRepository = di.get('repositories.user');
    const { userId } = request.session;

    const user = await userRepository.findByPk(userId);

    if (user) {
        request.loggedInUser = user;
        return next();
    }

    return response.sendStatus(StatusCodes.UNAUTHORIZED);
}

module.exports = isLoggedIn;
