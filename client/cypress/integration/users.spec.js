import faker from 'faker';

describe('Users', () => {
    describe('POST /users', () => {
        it('should login success and create user', () => {
            cy.login('admin@erpsystem.test');

            cy.visit('/users');

            cy.get('[data-cy="add-employee"]')
                .contains('Add Employee')
                .click({ force: true });
            cy.get('input[name=firstName]')
                .clear()
                .type(faker.name.firstName(null));
            cy.get('input[name=lastName]')
                .clear()
                .type(faker.name.lastName(null));
            cy.get('input[name=email]').clear().type(faker.internet.email());
            cy.get('input[name=password]')
                .clear()
                .type(faker.internet.password() + '1!Aa');
            cy.get('input[name=birthday]').type('2022-05-20', { force: true });
            cy.get('[data-cy="submit-button"]')
                .contains('submit')
                .click({ force: true });
            cy.get('[data-cy="users-list"]').should('be.visible');
        });
    });
});
