const check = require('../utils/check.js');
const SubResource = require('../utils/subResource').SubResource;


class Signer extends SubResource {
    /**
     *
     * CreditNote Signer object
     *
     * @description CreditNote signer's information.
     *
     * Parameters (required):
     * @param name [string]: signer's name. ex: 'Tony Stark'
     * @param contact [string]: signer's contact information. ex: 'tony@starkindustries.com'
     * @param method [string]: delivery method for the contract. ex: 'link'
     *
     */
    constructor({ name, contact, method }) {
        super();

        this.name = name;
        this.contact = contact;
        this.method = method;
    }
}

exports.Signer = Signer;
exports.subResource = {'class': exports.Signer, 'name': 'Signer'};
