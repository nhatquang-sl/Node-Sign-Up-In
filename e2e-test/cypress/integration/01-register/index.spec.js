describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
    cy.get('#firstName').clear();
    cy.get('#lastName').clear();
    cy.get('#email').clear();
    cy.get('#password').clear();
    cy.get('button[type=submit]').as('submitBtn');
  });

  it('redirect to login', () => {
    cy.contains('Already have an account? Sign in').click();

    cy.url().should('include', '/login');
  });

  it('show all errors', () => {
    cy.get('@submitBtn').click();
    cy.get('#firstName-helper-text').should('be.visible');
    cy.get('#firstName-helper-text').should(($el) => {
      expect($el).to.contain('First name must be at least 2 characters');
    });

    cy.get('#lastName-helper-text').should('be.visible');
    cy.get('#lastName-helper-text').should(($el) => {
      expect($el).to.contain('Last name must be at least 2 characters');
    });

    cy.get('#email-helper-text').should('be.visible');
    cy.get('#email-helper-text').should(($el) => {
      expect($el).to.contain('Email address is invalid');
    });

    cy.get('#password')
      .parent()
      .parent()
      .within(() => {
        cy.get('.MuiFormHelperText-root').should(($el) => {
          expect($el.eq(0)).to.contain('Password contains at least one lower character');
          expect($el.eq(1)).to.contain('Password contains at least one upper character');
          expect($el.eq(2)).to.contain('Password contains at least one digit character');
          expect($el.eq(3)).to.contain('Password contains at least one special character');
          expect($el.eq(4)).to.contain('Password contains at least 8 characters');
        });
      });
  });
});
