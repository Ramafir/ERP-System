const { body } = require('express-validator');

const login = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be valid e-mail')
        .isLength({ max: 254 })
        .withMessage('Email must be maximum 254 characters long'),

    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 254 })
        .withMessage('Password length must be between 8 and 254')
        .matches(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'
        )
        .withMessage(
            'Min. 8 characters with at least one capital letter, a number and a special character.'
        )
];

module.exports = { login };
