const faker = require('faker');
const dayjs = require('dayjs');

const vacationRepository = di.get('repositories.vacation');

class VacationFactory {
    static generate(props) {
        const defaultProps = {
            userId: faker.datatype.uuid(),
            duration: faker.datatype.number,
            confirmed: true,
            startDate: dayjs(faker.date.past()).format('YYYY-MM-DD'),
            endDate: dayjs(faker.date.past()).format('YYYY-MM-DD')
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return vacationRepository.build(VacationFactory.generate(props));
    }

    static create(props) {
        return vacationRepository.create(VacationFactory.generate(props));
    }
}

module.exports = VacationFactory;
