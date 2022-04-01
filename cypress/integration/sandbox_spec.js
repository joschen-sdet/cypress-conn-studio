/// <reference types="cypress" />

// let userRoleList = Cypress.env('userRoles')
// let user00 = userRoleList[0]


function my_function() {
    return 'Test Completed'
}

describe('UI element check for Connectors Page', () => {
    before(() => {
        cy.set_all_rbac_test_users()
        cy.set_all_rbac_user_tos()
        // cy.sutLogin(user00)
        // cy.gui_login(user00.username)
        
        // cy.new_idm_admin()
    })


    after(() => {
        // cy.delete_all_rbac_test_users()
    })
    it('get string', () => {
        // let item = null
        // for (item of userRoleList) {
        //     cy.delete_idm_user(item.username)
        //     cy.wait(1000)
        // }
    
        // cy.visit('https://platform.qa01.qa.abacusinsights.io/connector-studio/new-connector/editor').then(() => {

        expect(my_function()).eq('Test Completed')
        // })
        // cy.fixture('userRoles.json').then( (userRoleList) => {
        //     for (let item of userRoleList) {
        //         cy.log('user info: ', `roleId: ${item.id}`, `username: ${item.username}`, `role: ${item.roleName}`)
        //         // cy.new_rbac_test_user(item.id, item.username)
        //     }
        // })
        // cy.visit('https://platform.qa01.qa.abacusinsights.io/connector-studio/ingestions').then( () => {
        //     // expect(my_function()).to.be.a('string')

        // })
    })
})
