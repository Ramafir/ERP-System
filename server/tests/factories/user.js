const faker = require('faker');
const dayjs = require('dayjs');

const userRepository = di.get('repositories.user');

class UserFactory {
    static generate(props) {
        const defaultProps = {
            firstName: faker.name.firstName(null),
            lastName: faker.name.lastName(null),
            email: faker.internet.email(),
            birthDate: dayjs(faker.date.past()).format('YYYY-MM-DD'),
            vacationDaysTotal: faker.datatype.number(30),
            vacationDaysTaken: faker.datatype.number(30),
            password: faker.internet.password() + '1!Aa'
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return userRepository.build(UserFactory.generate(props));
    }

    static create(props) {
        return userRepository.create(UserFactory.generate(props));
    }
}

module.exports = UserFactory;
