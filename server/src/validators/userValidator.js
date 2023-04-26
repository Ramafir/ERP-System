const { body } = require('express-validator');
const { isEmailTaken } = require('./helpers');

const basic = [
    body('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required.')
        .isLength({ min: 2 })
        .withMessage('First name must have more than 2 characters.'),

    body('lastName')
        .not()
        .isEmpty()
        .withMessage('Last name is required.')
        .isLength({ min: 2 })
        .withMessage('Last Name must have more than 2 characters.'),

    body('birthDate')
        .not()
        .isEmpty()
        .withMessage('Birth date is required.')
        .isDate()
        .withMessage('Date is not valid'),

    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Email is not valid.')
        .isLength({ max: 254 })
        .withMessage('Email must be maximum 254 characters long')
        .bail()
        .custom(isEmailTaken())
];

const withPassword = [
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 8, max: 254 })
        .withMessage('Password should be between 8 and 254 characters long.')
];

const update = [...basic];

const store = [...basic, ...withPassword];

module.exports = { store, update };
