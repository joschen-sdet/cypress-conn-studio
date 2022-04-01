// Please create and set up all the users/roles in the cypress.json.env.userRoles first
// There are functions (cypress custom commands) to send requests and set up the roles. 
// However, there is an issue with change password endpoint when sending request via cypress
// it will always return 500. There is no time yet to debug the issue. Therefore, we will 
// use other utility to create the users for now. 
// Possible tools, postman --> Flows. Might be able to run with Newman later.
// Python function in connector-studio-test automation, RBAC_changes.py

/// <reference types="cypress" />

const { isNull } = require("lodash")


// let userRoleList = Cypress.env('userRoles')
// let username = userRoleList[0].username
// let username = userRoleList[9].username
let tos_agreed = null
let roleId = -1

let has_conn_access = null
let no_conn_access = null
if (Cypress.env('label') == 'qa01') {
    has_conn_access = [1, 13, 14, 15]
    no_conn_access = [2, 5, 7, 16, 17, 18]
}
else {
    has_conn_access = [1, 11, 12, 13]
    no_conn_access = [2, 5, 7, 14, 15, 16]
}

let role_file_name = ''


describe('Data Driven - Access Check', () => {
    before(() => {
        role_file_name = Cypress.env('role_file_name')
        // cy.set_all_rbac_test_users()
        // cy.set_all_rbac_user_tos()
    })
    after(() => {
        // cy.delete_all_rbac_test_users()
    })

    it('Check access for user', () => {
        cy.fixture(role_file_name).then((userRoleList) => {
            for (let item of userRoleList) {
                roleId = item.id
                let username = item.username
                cy.log('Role ID', roleId, 'username', item.username, 'roleName', item.roleName)
                cy.get_idm_user(username).then((resp) => {
                    tos_agreed = resp.user.is_tos_agreed
                    roleId = resp.user.platform_roles[0].id
                })
                cy.gui_login(username, 'Welcome@123').then(() => {
                    if (tos_agreed == false) {
                        cy.get('.MuiPaper-root').should('be.visible')
                        cy.get('[name="agree"]').click()
                        cy.get('#agree-btn > .MuiButton-label')
                            .should('not.be.disabled')
                            .click()
                    }
                })

                cy.get('.sc-esExBO.ibpPam').contains('Welcome to the Abacus Insights Platform')
                if (has_conn_access.includes(roleId)) {
                    cy.log('has access')
                    cy.get('.automation_con_icon').should('exist')
                    cy.get('[data-automation-id="homeTile-5"]').should('exist')
                }
                else {
                    cy.log('no access')
                    cy.get('.automation_con_icon').should('not.exist')
                    cy.get('[data-automation-id="homeTile-5"]').should('not.exist')
                }
                cy.get('#svg-icon-angle-down > svg').click()
                cy.get(':nth-child(4) > .MuiListItemText-root > .MuiTypography-root').click()

            }

        })

    })



    // for (let item of userRoleList){
    //     it(`Check for ${item.username}`, () => {
    //         roleId = item.id
    //         let username = item.username
    //         cy.log('item.id', roleId, 'item.roleName', item.roleName)
    //         cy.get_idm_user(username).then((resp) => {
    //             tos_agreed = resp.user.is_tos_agreed
    //             roleId = resp.user.platform_roles[0].id
    //         })
    //         cy.gui_login(username, 'Welcome@123').then(() => {
    //             if (tos_agreed == false) {
    //                 cy.get('.MuiPaper-root').should('be.visible')
    //                 cy.get('[name="agree"]').click()
    //                 cy.get('#agree-btn > .MuiButton-label')
    //                     .should('not.be.disabled')
    //                     .click()
    //             }
    //         })

    //         cy.get('.sc-esExBO.ibpPam').contains('Welcome to the Abacus Insights Platform')
    //         if (has_conn_access.includes(roleId)) {
    //             cy.log('has access')
    //             cy.get('.automation_con_icon').should('exist')
    //             cy.get('[data-automation-id="homeTile-5"]').should('exist')
    //         }
    //         else {
    //             cy.log('no access')
    //             cy.get('.automation_con_icon').should('not.exist')
    //             cy.get('[data-automation-id="homeTile-5"]').should('not.exist')
    //         }
    //         cy.get('#svg-icon-angle-down > svg').click()
    //         cy.get(':nth-child(4) > .MuiListItemText-root > .MuiTypography-root').click()    

    //     })
    // }
})


describe.skip('RBAC Check for allow Connector access', () => {
    before(() => {
        cy.get_idm_user(username).then((resp) => {
            tos_agreed = resp.user.is_tos_agreed
            roleId = resp.user.platform_roles[0].id
        })
    })
    it('Check the existence of connector items', () => {
        // for (let item of userRoleList) {}
        cy.gui_login(username, 'Welcome@123').then(() => {
            if (tos_agreed == false) {
                cy.get('.MuiPaper-root').should('be.visible')
                cy.get('[name="agree"]').click()
                cy.get('#agree-btn > .MuiButton-label')
                    .should('not.be.disabled')
                    .click()
            }
        })

        cy.get('.sc-esExBO.ibpPam').contains('Welcome to the Abacus Insights Platform')
        if (has_conn_access.includes(roleId)) {
            cy.log('has access')
            cy.get('.automation_con_icon').should('exist')
            cy.get('[data-automation-id="homeTile-5"]').should('exist')
        }
        else {
            cy.log('no access')
            cy.get('.automation_con_icon').should('not.exist')
            cy.get('[data-automation-id="homeTile-5"]').should('not.exist')
        }
        cy.get('#svg-icon-angle-down > svg').click()
        cy.get(':nth-child(4) > .MuiListItemText-root > .MuiTypography-root').click()
    })
})
