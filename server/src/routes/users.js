const express = require('express');
const validate = require('../middleware/validate');
const uuidValidator = require('../validators/uuidValidator');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const userValidator = require('../validators/userValidator');

const router = express.Router();

module.exports = di => {
    const indexController = di.get('controllers.users.index');
    const deleteController = di.get('controllers.users.delete');
    const showController = di.get('controllers.users.show');
    const storeController = di.get('controllers.users.store');
    const updateController = di.get('controllers.users.update');

    router.post(
        '/',
        [isLoggedIn, isAdmin],
        [userValidator.store, validate],
        (...args) => storeController.invoke(...args)
    );
    router.get('/', [isLoggedIn, isAdmin], (...args) =>
        indexController.invoke(...args)
    );
    router.get(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => showController.invoke(...args)
    );
    router.put(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), userValidator.update, validate],
        (...args) => updateController.invoke(...args)
    );
    router.delete(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => deleteController.invoke(...args)
    );

    return router;
};
