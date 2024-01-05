const Resource = require('starkcore').Resource;


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
exports.resource = {'class': exports.CreditSigner, 'name': 'CreditSigner'};
