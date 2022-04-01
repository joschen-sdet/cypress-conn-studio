// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

const { SSL_OP_EPHEMERAL_RSA } = require("constants")
// const { config } = require("dotenv")
const { Agent } = require("http")
// const { head } = require("request")

const label = Cypress.env('label')
const sut_host = `${label}.${Cypress.env('domain')}`
const sutBaseUri = Cypress.env('abinBaseUri').replace('{env}', sut_host)
const idmBaseUri = sutBaseUri.replace('{svc}', 'idm')
const icmBaseUri = sutBaseUri.replace('{svc}', 'icm')
let accessToken = ''
// let idmBaseUri = Cypress.env('idmBaseUri')

// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

function camelize(str) {
    return str.replace(/\W+(.)/g, function(match, chr)
     {
          return chr.toUpperCase();
      });
}


function get_user_role_file(){
    let role_file_name = ''
    if (label == 'qa01') {
        role_file_name = 'userRoles_qa01.json'
    }
    else {
        role_file_name = 'userRoles.json'
    }
    return role_file_name
}
Cypress.env('role_file_name', get_user_role_file())


Cypress.Commands.add('get_idm_token', (idmUser, idmPswd) =>{
    idmUser = idmUser || Cypress.env('idm_user')
    idmPswd = idmPswd || Cypress.env('idm_pswd')

    let idmUrl = idmBaseUri + '/api/auth'
    let headers = {"Content-Type": "application/json"}
    let req_body = {
        "username": idmUser,
        "password": idmPswd
    }

    let req_config = {
        url: idmUrl,
        method: 'POST',
        timeout: 0,
        headers: headers,
        body: req_body
    }

    cy.request(req_config).then(
        (resp) => {
            return resp.body.response
    })
})


Cypress.Commands.add('get_user_roles', () =>{
    cy.get_idm_token().then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + '/api/roles'
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }

        let req_config = {
            url: idmUrl,
            method: 'GET',
            timeout: 0,
            headers: headers
        }

        cy.request(req_config).then(
            (resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.response).to.not.equal(null)
                return resp.body.response
        })
    })
})


Cypress.Commands.add('delete_connector', (connector_name) => {
    cy.get_idm_token().then(resp => {
        let req_url = `${icmBaseUri}/api/connectors/${connector_name}`
        accessToken = resp.access_token
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }
        let req_config = {
            url: req_url,
            method: 'DELETE',
            timeout: 0,
            headers: headers,
            failOnStatusCode: false    // This will prevent cypress to error out when the status is other 2xx and 3xx
        }
        cy.request(req_config).then(
            (resp) => {
                // if (resp.status == 200 || resp.status == 404){
                //     assert true
                // }
                // else{
                //     assert false
                // }
                expect([200, 404]).to.include(resp.status)
        })
    })
})


Cypress.Commands.add('delete_idm_user', (username) =>{
    cy.get_idm_token().then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + '/api/users'
        idmUrl += `/${username}`
        // idmUrl += `/joshua_admin`
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }
        let req_body = {}
    
        let req_config = {
            url: idmUrl,
            method: "DELETE",
            timeout: 0,
            headers: headers,
            body: req_body,
            failOnStatusCode: false    // This will prevent cypress to error out when the status is other 2xx and 3xx
        }
        
        cy.request(req_config).then((resp) => {
            if (resp.status == 200) {
                cy.log(username, resp.body.message)
            }
            else {
                cy.log(resp.body.error)
            }
        })
    })
})


Cypress.Commands.add('delete_all_rbac_test_users', () => {
    let role_file_name = get_user_role_file()

    cy.fixture(role_file_name).then( (userRoleList) => {
        for (let item of userRoleList) {
            cy.delete_idm_user(item.username)
        }
    })
})


Cypress.Commands.add('new_idm_user', (roleId, username) =>{
    cy.get_idm_token().then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + '/api/users'
        let lastName = camelize(username.replaceAll('_', ' '))
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }
        let req_body = {
            "username": `${username}`,
            "email": `${username}.${roleId}@abacusinsights.com`,
            "firstname": "Test",
            "lastname": lastName,
            "platform_role_ids": [roleId],
            "is_sso_user": false
        }

        let req_config = {
            url: idmUrl,
            method: 'POST',
            timeout: 0,
            headers: headers,
            body: req_body
        }
    
        cy.request(req_config).then(
            (resp) => {
                return resp.body.response
        })
    })

})
    

Cypress.Commands.add('set_idm_user_pswd', (username, oldPswd) =>{
    switch (oldPswd){
        case undefined:
            throw 'Missing oldPswd'
        case '':
            throw 'oldPswd is empty string'
    }
    cy.get_idm_token().then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + `/api/users/${username}/password`
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }
        let req_body = {
            "old_password": oldPswd,
            "new_password": "Welcome@123",
            "first_time_user": true,
            "reset_user_password": false,
        }
    
        let req_config = {
            url: idmUrl,
            method: "POST",
            timeout: 0,
            headers: headers,
            body: req_body,
            failOnStatusCode: false
        }
    
        cy.request(req_config).then((resp) => {
            return resp
        })
    })
})


Cypress.Commands.add('new_rbac_test_user', (id, username) => {
    // cy.delete_idm_user(username)
    // cy.wait(5000)
    cy.new_idm_user(id, username).then((resp) => {
        let oldPswd = resp.temporary_password
        cy.wait(3000)
        cy.set_idm_user_pswd(username, oldPswd).then(resp => {
            if (resp.status == 200) {
                cy.log(username, JSON.stringify(resp.body.message))
            }
            else {
                cy.log("resp:", JSON.stringify(resp.body.error))
                cy.log('oldPswd:', oldPswd)
            }
        })
    })        
})


Cypress.Commands.add('new_idm_admin', () => {
    let item = userRoleList[0]
    // cy.log(item.id, item.username)
    cy.new_rbac_test_user(item.id, item.username)
    cy.wait(2000)
    cy.set_idm_tos(item.username)
})


Cypress.Commands.add('delete_idm_admin', () => {
    let item = userRoleList[0]
    // cy.log(item.id, item.username)
    cy.delete_idm_user(item.username)
})


Cypress.Commands.add('set_all_rbac_test_users', () =>{
    const func_name = 'set_all_rbac_test_users'
    let role_file_name = get_user_role_file()
    // cy.log('function:', func_name, 'label:', label)
    // cy.log('function:', func_name, 'role_file:', role_file_name)

    cy.fixture(role_file_name).then( (userRoleList) => {
        for (let item of userRoleList) {
            // cy.log('user info: ', `roleId: ${item.id}`, `username: ${item.username}`, `role: ${item.roleName}`)
            cy.new_rbac_test_user(item.id, item.username)
        }
    })
})


Cypress.Commands.add('get_idm_role_permissions', (roleName) =>{
    switch (roleName){
        case undefined:
            throw 'Missing role name'
        case '':
            throw 'Role name is empty string'
    }
    cy.get_idm_token().then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + `/api/roles/${roleName}/permissions`
        let headers = {
            "Authorization": accessToken
        }
        let req_body = null
    
        let req_config = {
            url: idmUrl,
            method: "GET",
            timeout: 0,
            headers: headers,
            body: req_body,
        }
    
        cy.request(req_config).then((resp) => {
            return resp.body.response
        })
    })
})


Cypress.Commands.add('sutLogin', (userObj) =>{
    // let appUser = userRoleList[0]
    // let appUser = userRoleList[8]
    let authuser = {
        "userData":{
            "access_token": '',
            "identity_token": '',
            "permissions": [],
            "userType": "Standard"
        },
        "isAuthenticatedToLanding": true, 
        "sso": { }, 
        "isAuthenticated": true         
    }
    let password = null
    if (userObj.id == null) {
        password = Cypress.env('idm_pswd')
    }
    else {
        password = Cypress.env('comm_pswd')
    }

    cy.get_idm_token(userObj.username, password).then((resp) => {
        let idm_tokens = resp
        // cy.log('idm_tokens', JSON.stringify(idm_tokens))
        authuser.userData.access_token = idm_tokens.access_token
        authuser.userData.identity_token = idm_tokens.identity_token
    })
        
    cy.get_idm_role_permissions(userObj.roleName).then( resp => {
        let right_list = resp
        right_list.forEach(item => {
            authuser.userData.permissions.push(item.name)
            // cy.log('right_name', authuser.userData.permissions)
        });
        // cy.log('user rights:', JSON.stringify(authuser.userData.permissions))
        window.sessionStorage.setItem('authuser', JSON.stringify(authuser))
    })
})


Cypress.Commands.add('get_idm_user', (username) => {
    cy.get_idm_token().then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + `/api/users/${username}`
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }
        let req_body = null
    
        let req_config = {
            url: idmUrl,
            method: 'GET',
            timeout: 0,
            headers: headers,
            body: req_body
        }
    
        cy.request(req_config).then(
            (resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.response.user).to.not.equal(null)
                return resp.body.response
        })
    })
})


Cypress.Commands.add('set_idm_tos', (username, password) => {
    password = password || 'Welcome@123'
    cy.get_idm_token(username, password).then(resp => {
        accessToken = resp.access_token
        let idmUrl = idmBaseUri + `/api/users/${username}/tos-agree`
        let headers = {
            "Content-Type": "application/json",
            "Authorization": accessToken
        }
        let req_body = null
    
        let req_config = {
            url: idmUrl,
            method: 'PUT',
            timeout: 0,
            headers: headers,
            body: req_body
        }
    
        cy.request(req_config).then(
            (resp) => {
                return resp.body.response
        })
    })
})


Cypress.Commands.add('set_all_rbac_user_tos', () => {
    let role_file_name = get_user_role_file()

    cy.fixture(role_file_name).then( (userRoleList) => {
        for (let item of userRoleList) {
            cy.set_idm_tos(item.username)
        }
    })
})


Cypress.Commands.add('try_get_token', (username) =>{
    cy.get_idm_token().then(resp => {
        // accessToken = resp.access_token
        // let idmUrl = idmBaseUri + `/api/users/${username}`
        // let headers = {
        //     "Content-Type": "application/json",
        //     "Authorization": accessToken
        // }
        // let req_body = null
    
        // let req_config = {
        //     url: idmUrl,
        //     method: 'GET',
        //     timeout: 0,
        //     headers: headers,
        //     body: req_body
        // }
        // cy.request(req_config).then(
        //     (resp) => {
        //         expect(resp.status).to.eq(200)
        //         expect(resp.body.response.user).to.not.equal(null)
        //         return resp.body.response
        // })
    })
})


Cypress.Commands.add('gui_login', (username, password) =>{
    password = password || 'Welcome@123'
    let loginUrl = Cypress.env('abinBaseUri') + '/login'
    loginUrl = loginUrl.replace('{svc}', 'platform').replace('{env}', sut_host)
    cy.log('loginUrl:', loginUrl)
    
    cy.visit(loginUrl)
    cy.get('[aria-selected="false"] > .MuiTab-wrapper').click()
    cy.contains('Standard Login').click()
    // cy.get('.Mui-selected > .MuiTab-wrapper').click()
    // cy.get('[class^=MuiButtonBase-root MuiTab-root][class$=MuiTab-textColorInherit').click()
    // <button class="MuiButtonBase-root MuiTab-root jss3 MuiTab-textColorInherit" tabindex="0" type="button" role="tab" aria-selected="false"><span class="MuiTab-wrapper">Standard Login</span></button>
    // #App > div.sc-MKjYC.jmAyMg > div > div.sc-iUpOdG.eezWOt > div.sc-eVrGFk.iNJmDC > div > div > div > div > button:nth-child(2)
    // cy.contains('Username').type(username)
    cy.get('[data-automation-id="loginUserId"] > .MuiInputBase-root > .MuiInputBase-input')
    .type(username)
    cy.get('[data-automation-id="loginPassword"] > .MuiInputBase-root > .MuiInputBase-input')
    .type(password)
    cy.get('[data-automation-id="loginButton"]')
    .click()
})
