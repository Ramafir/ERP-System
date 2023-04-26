const express = require('express');
const validate = require('../middleware/validate');
const uuidValidator = require('../validators/uuidValidator');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const vacationValidator = require('../validators/vacationValidator');

const router = express.Router();

module.exports = di => {
    const indexController = di.get('controllers.vacations.index');
    const deleteController = di.get('controllers.vacations.delete');
    const showController = di.get('controllers.vacations.show');
    const storeController = di.get('controllers.vacations.store');
    const updateController = di.get('controllers.vacations.update');
    const confirmController = di.get('controllers.vacations.confirm');

    router.get('/', [isLoggedIn], (...args) => indexController.invoke(...args));
    router.get(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => showController.invoke(...args)
    );
    router.post(
        '/',
        [isLoggedIn],
        [vacationValidator.store, validate],
        (...args) => storeController.invoke(...args)
    );
    router.put(
        '/:id',
        [isLoggedIn],
        [uuidValidator('id'), vacationValidator.update, validate],
        (...args) => updateController.invoke(...args)
    );
    router.put(
        '/:id/confirmed',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => confirmController.invoke(...args)
    );
    router.delete(
        '/:id',
        [isLoggedIn],
        [uuidValidator('id'), validate],
        (...args) => deleteController.invoke(...args)
    );

    return router;
};
