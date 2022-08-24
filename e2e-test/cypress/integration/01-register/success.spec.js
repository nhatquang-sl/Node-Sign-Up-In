describe('Register Success', () => {
  const firstName = new Date().getTime().toString().substring(0, 6);
  const lastName = new Date().getTime().toString().substring(6);
  const email = `${firstName}.${lastName}@mailinator.com`;
  const password = '123456x@X';
  let passwordResetLink = '';
  beforeEach(() => {});

  it('Submit valid values', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('#firstName').clear();
    cy.get('#lastName').clear();
    cy.get('#email').clear();
    cy.get('#password').clear();
    cy.get('button[type=submit]').as('submitBtn');
    cy.get('#firstName').type(firstName);
    cy.get('#lastName').type(lastName);
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('@submitBtn').click();

    cy.get('@submitBtn').should('be.disabled');
    cy.url({ timeout: 10000 }).should('include', '/request-activate-email');

    cy.request({
      url: `http://localhost:3500/auth/activation-link/${email}`,
    }).then((resp) => {
      passwordResetLink = resp.body;
    });
  });

  it('Follows the activate link from the email', () => {
    cy.visit(passwordResetLink);
    cy.url({ timeout: 10000 }).should('include', '/login');

    cy.get('#email').clear();
    cy.get('#password').clear();
    cy.get('#email').type(email);
    cy.get('#password').type(password);

    cy.get('button[type=submit]').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });
});
