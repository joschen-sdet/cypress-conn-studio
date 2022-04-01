/// <reference types="cypress" />

let label = Cypress.env('label');
let domain = Cypress.env('domain');
let env  = `${label}.${domain}`
let conn_name = Cypress.env('conn_name');

describe('Abacus Home page can navigate to connector-studio', () => {
    beforeEach(() =>{
        let username = Cypress.env('idm_user')
        let password = Cypress.env('idm_pswd')
        cy.gui_login(username, password)
    })
    it('Connectors tile on home page', () => {
        cy.contains('Welcome to the Abacus Insights Platform')

        // Click on the Connectors tile
        cy.get(':nth-child(4) > .sc-jGkVzM > a')
        .click()
        // cy.url().should('include', '/connector-studio/connectors')
        cy.location('pathname').should('eq', '/connector-studio/connectors')

        // Click on the Home icon in top navigation bar
        // cy.get('#svg-icon-home > svg')
        // .click()
        // cy.contains('Welcome to the Abacus Insights Platform')

        // Click on the Connector icon top navigation bar
        // cy.get('[style="margin-top: -5px;"] > #svg-icon-plug > svg')        // .click()
        // .click()
        // cy.url().should('include', '/connector-studio/connectors')

        // cy.get('#svg-icon-home > svg')

        // cy.get('.MuiButton-label')
        // .click()
    })
    it('Connector icon on Home page', () => {
        // Click on the Home icon in top navigation bar
        cy.get('#svg-icon-home > svg')
        .click()
        cy.contains('Welcome to the Abacus Insights Platform')

        // Click on the Connector icon top navigation bar
        cy.get('[style="margin-top: -5px;"] > #svg-icon-plug > svg')        // .click()
        .click()
        // cy.url().should('include', '/connector-studio/connectors')
        cy.location('pathname').should('eq', '/connector-studio/connectors')
    })
})