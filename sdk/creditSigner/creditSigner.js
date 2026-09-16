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
     * @param method [string]: delivery method for the contract. Options: 'link' or 'token' (sent to an email or phone contact), 'server' or 'organization' (automatic signature over a URL contact). Up to 10 signers may be added per CreditNote.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the CreditSigner is created. ex: '5656565656565656'
     * @param signed [string]: datetime when the signer signed the contract; empty until the signature happens. ex: '2022-06-02T00:00:00.000000+00:00'
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
     * @description Mark a CreditSigner's signing token/link as undelivered (isSent=false), which triggers Stark Infra to resend it to the signer's contact. Use this when a signer misses the original email or SMS.
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
