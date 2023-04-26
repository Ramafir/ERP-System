const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

class LoginController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const { email, password } = request.body;

        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            return response.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const loggedInUser = await this.userRepository.get(user.id);

        request.session.userId = loggedInUser.id;

        request.session.isAdmin = await loggedInUser.isAdmin();

        return response.send(loggedInUser);
    }

    user(request, response) {
        return response.send(request.loggedInUser);
    }
}

module.exports = LoginController;
