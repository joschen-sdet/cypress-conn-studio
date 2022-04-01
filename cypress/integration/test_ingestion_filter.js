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

    it('test ingestion filter', () => {
        cy.visit(`${UiBaseUri}/connector-studio/connectors/${connector_name}/ingestions`)

        // Batch Id filter
        // click on Batch Id filter gadget
        cy.get(':nth-child(3) > [style="display: inline;"] > div > .k-icon').click()
        
        // wait for rendering to complete
        cy.wait(500)
        
        // select the text box to type filter criteria string 
        cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > .k-textbox')
        .type('456')
        
        // click on the filter button to apply filter
        cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        
        // wait for rendering to complete
        cy.wait(500)
        
        // check the filter result by counting the number of rows in the table 
        cy.get('tbody').find('tr').should('have.length', 2)

        // click on Batch Id filter gadget
        cy.get(':nth-child(3) > [style="display: inline;"] > div > .k-icon').click()
        
        // wait for rendering to complete
        cy.wait(500)
        
        // click on clear button of the filter dialog
        cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        
        // wait for rendering to complete
        cy.wait(500)
        
        // check the filter clearing result
        cy.get('tbody').find('tr').should('have.length', 5)


        // // // Ingestion Id filter
        // cy.get(':nth-child(4) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > .k-textbox')
        // .type(5)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 3)


        // cy.get(':nth-child(4) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > .k-textbox')
        // .clear().type(7)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 4)


        // cy.get(':nth-child(4) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)


        // Run status filter
        // cy.get(':nth-child(5) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > span > span > span.k-select').click()
        // cy.wait(500)
        // cy.get('[class="k-list k-reset"] > li').contains('failed').click()
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(5) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > span > span > span.k-select').click()
        // cy.wait(500)
        // cy.get('[class="k-list k-reset"] > li').contains('success').click()
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 1).contains('No Ingestions')

        // cy.get(':nth-child(5) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)


        // Submit Date filter
        // cy.get(':nth-child(6) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > span > span > span > .k-dateinput-wrap')
        // .type('{leftarrow}').type('{leftarrow}')
        // .type(10).type('{rightarrow}').type(11).type('{rightarrow}').type(2021)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(6) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(6) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(3) > span > span > span > .k-dateinput-wrap')
        // .type('{leftarrow}').type('{leftarrow}')
        // .type(10).type('{rightarrow}').type(13).type('{rightarrow}').type(2021)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(6) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)


        // // End Date filter
        // cy.get(':nth-child(7) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > span > span > span > .k-dateinput-wrap')
        // .type('{leftarrow}').type('{leftarrow}')
        // .type(10).type('{rightarrow}').type(13).type('{rightarrow}').type(2021)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 1).contains('No Ingestions')

        // cy.get(':nth-child(7) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(7) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(3) > span > span > span > .k-dateinput-wrap')
        // .type('{leftarrow}').type('{leftarrow}')
        // .type(10).type('{rightarrow}').type(13).type('{rightarrow}').type(2021)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(7) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)


        // BlackList filter
        // cy.get(':nth-child(8) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > span > span > span.k-select').click()
        // cy.wait(500)
        // cy.get('[class="k-list k-reset"] > li').contains('APPROVED').click()
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 1).contains('No Ingestions')
      
        // cy.get(':nth-child(8) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > div > :nth-child(1) > span > span > span.k-select').click()
        // cy.wait(500)
        // cy.get('[class="k-list k-reset"] > li').contains('BLACKLISTED').click()
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(2)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

        // cy.get(':nth-child(8) > [style="display: inline;"] > div > .k-icon').click()
        // cy.wait(500)
        // cy.get('[class="k-filter-menu-container"] > [class="k-columnmenu-actions"] > button:nth-child(1)').click()
        // cy.wait(500)
        // cy.get('tbody').find('tr').should('have.length', 5)

    })
})
