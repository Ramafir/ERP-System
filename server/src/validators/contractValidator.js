const { body } = require('express-validator');
const dayjs = require('dayjs');
const { isUserExist } = require('./helpers');

const store = [
    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Start date is required')
        .isDate()
        .withMessage('Date must be valid')
        .custom(async (startDate, { req }) => {
            const { userId, duration } = req.body;
            const { id } = req.params;
            const di = req.app.get('di');
            const contractRepository = di.get('repositories.contract');

            const endDate = await dayjs(startDate)
                .add(duration, 'M')
                .subtract(1, 'day')
                .format('YYYY-MM-DD');

            const contracts =
                await contractRepository.findAllByUserInTimeInterval(
                    id,
                    userId,
                    startDate,
                    endDate
                );

            if (contracts.length) {
                throw new Error('There is existing contract in this time');
            }
        }),

    body('duration')
        .not()
        .isEmpty()
        .withMessage('Duration is required')
        .isLength({ min: 1 })
        .withMessage('Contract must be for at least 1 month')
        .isInt()
        .withMessage('Should be integer type'),

    body('userId')
        .not()
        .isEmpty()
        .withMessage('User ID is required')
        .isUUID()
        .withMessage('Must be valid UUID')
        .bail()
        .custom((userId, { req }) => isUserExist(userId, req.app.get('di'))),

    body('jobPosition')
        .not()
        .isEmpty()
        .withMessage('Job position is required.')
        .isLength({ min: 2 })
        .withMessage('Job position must have more than 2 characters.'),

    body('vacationsPerYear')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isInt()
        .withMessage('Should be integer type')
];

const update = [...store];

module.exports = {
    store,
    update
};
