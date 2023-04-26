const express = require('express');
const validate = require('../middleware/validate');
const isLoggedIn = require('../middleware/isLoggedIn');
const authValidator = require('../validators/authValidator');

const router = express.Router();

module.exports = di => {
    const loginController = di.get('controllers.auth.login');
    const logoutController = di.get('controllers.auth.logout');

    router.get('/user', isLoggedIn, (...args) => loginController.user(...args));

    router.post('/login', [authValidator.login, validate], (...args) =>
        loginController.invoke(...args)
    );
    router.post('/logout', (...args) => logoutController.invoke(...args));

    return router;
};
