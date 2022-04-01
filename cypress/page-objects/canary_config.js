export class Config {
    label = Cypress.env('label');
    domain = Cypress.env('domain');
    env  = `${Config.label}.${Config.domain}`
    conn_name = Cypress.env('conn_name');
    idm_user = Cypress.env('idm_user')
    idm_pswd = Cypress.env('idm_pswd')
}