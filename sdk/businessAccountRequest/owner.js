const SubResource = require('starkcore').SubResource;


class Owner extends SubResource {
    /**
     *
     * BusinessAccountRequest.Owner object
     *
     * @description The Owner object represents a company owner referenced by a BusinessAccountRequest. Each owner
     * completes its own identity verification through an independent webview. It is embedded on the parent's owners
     * field and has no endpoints of its own.
     *
     * Parameters (required):
     * @param taxId [string]: owner's tax ID (CPF). ex: '012.345.678-90'
     * @param name [string]: owner's full name (minimum 5 characters). ex: 'Jamie Lannister'
     * @param role [string]: owner's role in the company. Options: 'partner', 'representative'
     *
     * Attributes (return-only):
     * @param identityId [string]: unique id of the identity verification linked to this owner. ex: '5709594221805568'
     * @param validatorLink [string]: webview link to be delivered to the owner to complete biometrics and document capture.
     * @param status [string]: current status of the owner verification. Options: 'created', 'approved', 'denied'
     *
     */
    constructor({
        taxId = null, name = null, role = null, identityId = null, validatorLink = null, status = null
    }) {
        super();
        this.taxId = taxId;
        this.name = name;
        this.role = role;
        this.identityId = identityId;
        this.validatorLink = validatorLink;
        this.status = status;
    }
}

exports.Owner = Owner;
exports.subResource = {'class': exports.Owner, 'name': 'Owner'};
