/// <reference types="cypress" />

let label = Cypress.env('label');
let domain = Cypress.env('domain');
let sut_host  = `${label}.${domain}`
let UiBaseUri = Cypress.env('abinBaseUri')
                    .replace('{svc}', 'platform')
                    .replace('{env}', sut_host)

describe('UI element check for Connectors Page', () => {
    before(() =>{
        let admin = {
            "username": Cypress.env('idm_user'),   "roleName": "abacus_administrator",
        }
        cy.sutLogin(admin)
    })
    it('Connectors tile on home page', () => {
        cy.visit(`${UiBaseUri}/connector-studio`)
        cy.url().should('include', '/connector-studio/connectors')

        // entering connector-studio
        // Begin of shared specs
        cy.get('.sc-gojNiO').should('be.visible')    // top navigation bar

        // side navigation bar
        cy.get('#connectors-navbar-link')
        cy.get('#ingestions-navbar-link')
        cy.get('#data-mart-navbar-link')
        cy.get('#refresh-jobs-navbar-link')
        // End of shared specs

        cy.contains('Domain Model Version: ')
        cy.contains('22.1.2')
        cy.get('#search-box')   // search box for connector
        cy.get('#svg-icon-search-icon > svg')   // magnify glass icon
        cy.get('.MuiButton-label')      // Set up new connector cmd button

        // connector list table header
        cy.get('.k-grid-header')
        cy.contains('Connector')
        cy.contains('Source')
        cy.contains('Version')
        cy.contains('Last Run')
        cy.contains('Auto Ingestion')
        cy.contains('Run Status')
        cy.contains('Action')

        // connector table row
        cy.get('tbody > :nth-child(1) > :nth-child(1) > a')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').contains(/[a-zA-Z].*/)
        cy.get('tbody > :nth-child(1) > :nth-child(3)').contains(/.*/)
        cy.get('tbody > :nth-child(1) > :nth-child(4)')
        cy.get('tbody > :nth-child(1) > :nth-child(5)').contains(/^(true|false)$/)
        cy.get('tbody > :nth-child(1) > :nth-child(6)')
        cy.get('tbody > :nth-child(1) > :nth-child(7)').get('a[href$="run"]')
        cy.get('tbody > :nth-child(1) > :nth-child(7)').get('a[href$="edit"]')
        

        // connector pager
        cy.get('.k-pager-wrap')
        cy.get('.k-pager-info')
        cy.get('select').should('have.value', 10)
            .select('30').should('have.value', 30)
        cy.get('.k-pager-numbers > :nth-child(1) > .k-link')
    })
})