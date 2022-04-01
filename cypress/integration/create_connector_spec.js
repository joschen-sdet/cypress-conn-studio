/// <reference types="cypress" />

let label = Cypress.env('label');
let domain = Cypress.env('domain');
let sut_host  = `${label}.${domain}`
let UiBaseUri = Cypress.env('abinBaseUri')
    .replace('{svc}', 'platform')
    .replace('{env}', sut_host)

let connector_name = 'automate_ui_json'       

describe('New Connector Page', () => {
    before(() => {
        let admin = {
            "username": Cypress.env('idm_user'),   "roleName": "abacus_administrator",
        }
        cy.sutLogin(admin)
    })

    after(() => {
        // cy.delete_connector('automate_ui_json')
        cy.delete_connector('automate_ui_json')
    })

    it('Creates new connector', () => {
        cy.visit(`${UiBaseUri}/connector-studio/new-connector/editor`)
        cy.url().should('include', '/connector-studio/new-connector/editor')
        cy.get(':nth-child(1) > .k-grid > .k-pager-wrap')   // wait for the pager to be rendered before next check
        cy.contains('Connector Name')
        cy.get('[name="name"]').type(connector_name)
        cy.contains('Source')
        cy.get('[name="source"]').type('canary')
        cy.contains('Version')
        cy.get('[name="version"]').type('1.0.0')

        // Config input domain
        cy.get('.k-master-row > :nth-child(1) > .k-textbox').type('automate_ui_json')
        // The wait time below is needed only when try to access the format select right after page opened
        // cy.wait(300)
        cy.get(':nth-child(3) > .k-widget > .k-dropdown-wrap > .k-select').click()
        cy.get('[role="listbox"][class="k-list k-reset"]').within(() => {
            cy.contains('json').click()
        })
        // Enter input schema json string
        cy.get(':nth-child(4) > .MuiButtonBase-root').should('not.be.disabled').click()
        cy.get('.MuiDialogContent-root').within(() => {
            cy.get('[class="k-switch-container"][role="switch"] > span.k-switch-handle').click()
        })
        cy.get('.sc-qZtCU').clear()
        cy.fixture('input_schema.json').then( (inputSchema) => {
            cy.get('.sc-qZtCU').type(JSON.stringify(inputSchema), {parseSpecialCharSequences:false})
        })
        cy.get('.MuiDialogActions-root')
        cy.contains('Submit').click()

        // Config output domain
        cy.get(':nth-child(3) > .k-grid > .k-grid-toolbar > .MuiButtonBase-root')
            .click()
        cy.get(':nth-child(1) > .k-widget > .k-dropdown-wrap > .k-input').click()
        cy.get('.k-animation-container.k-animation-container-relative.k-list-container.k-reset').within(() => {
            cy.contains('Member').click()
        })
        cy.contains('SAVE').click()
        cy.url().should('include', `${connector_name}/configuration`)

    })
})
