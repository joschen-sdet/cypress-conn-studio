/// <reference types="cypress" />

let label = Cypress.env('label');
let domain = Cypress.env('domain');
let env  = `${label}.${domain}`
let sut_host  = `${label}.${domain}`
let UiBaseUri = Cypress.env('abinBaseUri')
    .replace('{svc}', 'platform')
    .replace('{env}', sut_host)

let connector_name = Cypress.env('conn_name')
let tos_agreed = null

let date01 = null
let date02 = null
let date03 = null


describe('New Connector Page', () => {
    before(() => {
        let admin = {
            "username": Cypress.env('idm_user'),   "roleName": "abacus_administrator",
        }
        cy.sutLogin(admin)
    })

    after(() => {
        // cy.delete_idm_admin()
    })

    it('Search for connector', () => {
        cy.visit(`${UiBaseUri}/connector-studio`)
        cy.url().should('include', '/connector-studio/connectors')
        cy.get('#search-box').type(connector_name).type('{enter}')
        cy.contains(connector_name)
        cy.get('.sc-pjHjD > .k-chip > .k-chip-content > .k-chip-label').contains(connector_name)
        cy.get('.k-master-row > :nth-child(1)').get(`a[href$="${connector_name}"]`).click()
        cy.url().should('include', `/connector-studio/connectors/${connector_name}/configuration`)
        cy.get('[tabindex="-1"] > .MuiTab-wrapper').click()

        cy.get('thead > tr > :nth-child(2) > .k-link').contains('Run Id')
        cy.get('thead > tr > :nth-child(3) > .k-link').contains('Batch Id')
        cy.get('thead > tr > :nth-child(4) > .k-link').contains('Ingestion Id')
        cy.get('thead > tr > :nth-child(5) > .k-link').contains('Run Status')
        cy.get('thead > tr > :nth-child(6) > .k-link').contains('Submit Date')
        cy.get('thead > tr > :nth-child(7) > .k-link').contains('End Date')
        cy.get('thead > tr > :nth-child(8) > .k-link').contains('BlackList Status')

        cy.get('tbody  > tr:nth-child(1) > td:nth-child(6)')
          .each(($el, $index, $list) => {
            date01 = Date.parse($el.text())
            // cy.log($index, date01)
          })
        cy.get('tbody  > tr:nth-child(2) > td:nth-child(6)')
          .each(($el, $index, $list) => {
            date02 = Date.parse($el.text())
            // cy.log($index, date02)
          })
        cy.get('tbody  > tr:nth-child(3) > td:nth-child(6)')
          .each(($el, $index, $list) => {
              date03 = Date.parse($el.text())
              expect((date03 < date02) && (date02 < date01)).to.be.true
            //   cy.log($index, date01, date02, date03)
          })
        cy.get('select').contains('10')

        cy.get('tbody  > :nth-child(1) > .k-hierarchy-cell > .k-icon').click()
        cy.get('.k-detail-cell').contains('Ingestion Details')
        cy.get('.k-detail-cell').contains('AIRFLOW TREE VIEW')
        cy.get('.k-detail-cell').contains('AIRFLOW GRAPH VIEW')
        cy.get('.k-detail-cell').contains('DAG Id')
        cy.get('.k-detail-cell').contains('Run Status')
        cy.get('.k-detail-cell').contains('Is Paused')
        cy.get('.k-detail-cell').contains('Blacklist Status')
        cy.get('.k-detail-cell').contains('Execution Date')
        cy.get('.k-detail-cell').contains('Start Date')
        cy.get('.k-detail-cell').contains('End Date')
        cy.get('.k-detail-cell').contains('Run Duration')

        cy.get('tbody > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)').then(($el) => {
            let run_id = $el.text()
            let sub_string = `${connector_name}/ingestions/${run_id}`
            cy.log(sub_string)
            .click()
            cy.url().should('include', sub_string)
        })

        cy.get(':nth-child(1) > h3').contains('Ingestion Details')
        cy.get('[class=k-grid-header-wrap]').contains('ID')
        cy.get(':nth-child(6) > .MuiButtonBase-root > .MuiButton-label').contains('REINSTATE')
        cy.get(':nth-child(3) > h3').contains('Airflow Details')
        cy.get(':nth-child(4) > .k-grid-container > .k-grid-content > [style="position: relative;"] > .k-grid-table > tbody > .k-master-row > :nth-child(4)').then(($el) =>{
            let dag_status = $el.text()
            if (dag_status = 'failed'){
                cy.get(':nth-child(5) > h3').contains('Failure Details')
            }
        })
        cy.get('[style="text-align: right; padding-right: 20px;"]').contains('AIRFLOW TREE VIEW')
        cy.get('[style="text-align: right; padding-right: 20px;"]').contains('AIRFLOW GRAPH VIEW')
        cy.get('[style="text-align: right; padding-right: 20px;"]').contains('RE-RUN INGESTION')

        cy.get(':nth-child(6) > .MuiButtonBase-root > .MuiButton-label').contains('REINSTATE').click()
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Are you sure you want to reinstate this ingestion?')
            return false;
        })
    })
})