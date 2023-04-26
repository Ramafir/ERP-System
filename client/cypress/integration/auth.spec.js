describe('Auth', () => {
    describe('Login and logout', () => {
        it('should login success when submit a valid login form', () => {
            cy.visit('/login');

            cy.get('input[name=email]').clear().type('admin@erpsystem.test');
            cy.get('input[name=password]').clear().type('Admin123!{enter}');

            cy.url().should('include', '/dashboard');
        });

        it('should logout when click logout button', () => {
            cy.login('admin@erpsystem.test');

            cy.url().should('include', '/dashboard');

            cy.get(`[href="/logout"]`).click();

            cy.url().should('include', '/login');
        });
    });
});
