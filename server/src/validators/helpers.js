const dayjs = require('dayjs');

async function isUserExist(userId, di) {
    const userRepository = di.get('repositories.user');

    const user = await userRepository.findByPk(userId);

    if (!user) {
        throw new Error('User not found');
    }
}

async function isUserIdMatch(userId, sessionUserId, isEmployee) {
    if (isEmployee && userId !== sessionUserId) {
        throw new Error('User ID is not the same as the logged user');
    }
}

async function isEndDateAfter(startDate, endDate) {
    if (startDate > endDate) {
        throw new Error('End date must be after start date');
    }
}

function isEmailTaken() {
    return async (email, { req }) => {
        const di = req.app.get('di');
        const userRepository = di.get('repositories.user');

        const user = await userRepository.findOne({
            where: { email }
        });

        if (user && user.id !== req.params.id) {
            throw new Error('Email is already taken');
        }
    };
}

module.exports = {
    isUserExist,
    isUserIdMatch,
    isEmailTaken,
    isEndDateAfter
};
