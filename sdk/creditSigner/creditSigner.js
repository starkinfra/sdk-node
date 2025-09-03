const Resource = require('starkcore').Resource;
const rest = require('../utils/rest.js');


class CreditSigner extends Resource {
    /**
     *
     * CreditSigner object
     *
     * @description CreditNote signer's information.
     *
     * Parameters (conditionally required):
     * @param name [string]: signer's name. ex: 'Tony Stark'
     * @param contact [string]: signer's contact information. ex: 'tony@starkindustries.com'
     * @param method [string]: delivery method for the contract. ex: 'link'
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the CreditSigner is created. ex: '5656565656565656'
     *
     */
    constructor({ 
                    name=null, contact=null, method=null, id=null 
                }) {
        super(id);
        
        this.name = name, 
        this.contact = contact, 
        this.method = method
    }
}

exports.CreditSigner = CreditSigner;
let resource = {'class': exports.CreditSigner, 'name': 'CreditSigner'};
exports.resource = resource

exports.resendToken = async function (id, {user} = {}) {
    /**
     *
     * Resend token to signer
     *
     * @description Resend token to a specific signer
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns CreditSigner object with updated attributes
     *
     */
    let payload = {
        isSent: false
    };
    return rest.patchId(resource, id, payload, user);
};
