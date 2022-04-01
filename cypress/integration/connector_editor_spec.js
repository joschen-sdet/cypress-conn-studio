/// <reference types="cypress" />

// let userRoleList = Cypress.env('userRoles')
// let admin = userRoleList[0]
let label = Cypress.env('label');
let domain = Cypress.env('domain');
let sut_host  = `${label}.${domain}`
let UiBaseUri = Cypress.env('abinBaseUri')
                    .replace('{svc}', 'platform')
                    .replace('{env}', sut_host)


describe('Create New Connector', () => {
    before(() =>{
        let admin = {
            "username": Cypress.env('idm_user'),   "roleName": "abacus_administrator",
        }
        cy.sutLogin(admin)
    })

    it('New Connector Editor', () => {
        cy.visit(`${UiBaseUri}/connector-studio/new-connector/editor`)
        cy.get('[data-automation-id=AntTab-Editor]')



        cy.get(':nth-child(1) > .k-grid > .k-pager-wrap')   // wait for the pager to be rendered before next check
        cy.contains('Connector Name')
        cy.get('[name="name"]').type('Do Re Mi')
        cy.contains('Source')
        cy.get('[name="source"]').type('From where?')
        cy.contains('Version')
        cy.get('[name="version"]').type('0.0.0')
        cy.contains('Manifest Pattern: ')
        cy.get('span.k-searchbar')
        cy.get('span.k-searchbar > [class="k-input"]').type('ABC and 123')
        cy.contains('AutoIngest').click()

        cy.contains('Input Domains')

        cy.contains('Name')
        cy.get('tbody > :nth-child(1) > :nth-child(1) > .k-textbox').type('XYZ and 890')

        cy.contains('Partition Size')

        cy.contains('Format')
        cy.get(':nth-child(3) > .k-widget > .k-dropdown-wrap > .k-select').click()



        cy.contains('Parser Config')
        cy.contains('Edit')

        cy.contains('Allow File Omission')
        cy.get('.k-master-row > :nth-child(5)').click()
        cy.contains('Allow Zero Record Ok')
        cy.get('.k-master-row > :nth-child(6)').click()

        cy.contains('Remove')

        cy.get(':nth-child(1) > .k-grid > .k-grid-toolbar')
        cy.get(':nth-child(1) > .k-grid > .k-grid-toolbar > .MuiButtonBase-root').click()   // 'ADD NEW' button
        cy.get(':nth-child(1) > .k-grid > .k-pager-wrap > .k-pager-info')

        cy.contains('Output Domains')
        cy.get(':nth-child(3) > .k-grid > .k-grid-toolbar')
        cy.get(':nth-child(3) > .k-grid > .k-grid-toolbar > .MuiButtonBase-root').click()   // 'ADD NEW' button
        cy.get(':nth-child(3) > .k-grid > .k-pager-wrap')
        cy.get(':nth-child(3) > .k-grid > .k-pager-wrap > .k-pager-info')
        cy.contains('CANCEL')
        cy.contains('SAVE')
        
        cy.get('[data-automation-id=AntTab-Code]').click()
        cy.get('[data-automation-id=AntTab-Editor]').click()
    })
})
