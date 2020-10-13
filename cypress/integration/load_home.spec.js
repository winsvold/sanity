describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')

    cy.wait(1000)

    cy.get('button')
      .contains('E-mail / password')
      .click()

    // TODO Add login via a test user
  })
})
