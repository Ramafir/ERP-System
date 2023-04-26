const faker = require('faker');
const dayjs = require('dayjs');

const contractRepository = di.get('repositories.contract');

class ContractFactory {
    static generate(props) {
        const defaultProps = {
            userId: faker.datatype.uuid(),
            startDate: dayjs(faker.date.past()).format('YYYY-MM-DD'),
            duration: faker.datatype.number(6),
            jobPosition: faker.name.jobTitle(),
            vacationsPerYear: 20
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return contractRepository.build(ContractFactory.generate(props));
    }

    static create(props) {
        return contractRepository.create(ContractFactory.generate(props));
    }
}

module.exports = ContractFactory;
