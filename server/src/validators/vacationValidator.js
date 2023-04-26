const { body } = require('express-validator');
const { isUserExist, isUserIdMatch, isEndDateAfter } = require('./helpers');

const store = [
    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Start date is required')
        .bail()
        .isDate()
        .withMessage('Date must be valid')
        .custom(async (startDate, { req }) => {
            const { endDate } = req.body;
            const { id } = req.params;
            const { isAdmin } = req.session;
            const di = req.app.get('di');
            const vacationRepository = await di.get('repositories.vacation');
            const userId = isAdmin ? req.body.userId : req.session.userId;

            const vacations =
                await vacationRepository.findAllByUserInTimeInterval(
                    id,
                    userId,
                    startDate,
                    endDate
                );

            if (vacations.length) {
                throw new Error('There is existing vacation in this time');
            }
        }),

    body('endDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('End date is required')
        .bail()
        .isDate()
        .withMessage('Date must be valid')
        .custom(async (endDate, { req }) => {
            const { startDate } = req.body;
            await isEndDateAfter(startDate, endDate);
        }),

    body('userId')
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage('User ID is required')
        .isUUID()
        .withMessage('Must be valid UUID')
        .bail()
        .custom((userId, { req }) => isUserExist(userId, req.app.get('di')))
        .custom((userId, { req }) =>
            isUserIdMatch(userId, req.session.userId, !req.session.isAdmin)
        )
];

const update = [...store];

module.exports = {
    store,
    update
};
