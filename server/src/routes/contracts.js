const express = require('express');
const validate = require('../middleware/validate');
const uuidValidator = require('../validators/uuidValidator');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const contractValidator = require('../validators/contractValidator');

const router = express.Router();

module.exports = di => {
    const indexController = di.get('controllers.contracts.index');
    const deleteController = di.get('controllers.contracts.delete');
    const showController = di.get('controllers.contracts.show');
    const storeController = di.get('controllers.contracts.store');
    const updateController = di.get('controllers.contracts.update');

    router.get('/', [isLoggedIn, isAdmin], (...args) =>
        indexController.invoke(...args)
    );
    router.get(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => showController.invoke(...args)
    );
    router.post(
        '/',
        [isLoggedIn, isAdmin],
        [contractValidator.store, validate],
        (...args) => storeController.invoke(...args)
    );
    router.put(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), contractValidator.update, validate],
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
