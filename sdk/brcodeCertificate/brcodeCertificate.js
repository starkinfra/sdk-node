const rest = require('../utils/rest.js');
const SubResource = require("../utils/subResource").SubResource;


class BrcodeCertificate extends SubResource {
    /**
     *
     * BrcodeCertificate object
     *
     * @description The BrcodeCertificate object displays the QR Code domain certificate information of Pix participants.
     * All certificates must be registered with the Central Bank.
     *
     * Attributes (return-only):
     * @param content [string]: certificate of the Pix participant in PEM format.
     * @param domain [string]: current active domain (URL) of the Pix participant.
     *
     */
    constructor({ content, domain }) {
        super();
        this.content = content;
        this.domain = domain;
    }
}

exports.BrcodeCertificate = BrcodeCertificate;
let resource = {'class': exports.BrcodeCertificate, 'name': 'BrcodeCertificate'};

exports.query = async function ({ user } = {}) {
    /**
     *
     * Retrieve BrcodeCertificates
     *
     * @description Receive a generator of BrcodeCertificate objects.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of BrcodeCertificate objects with updated attributes
     *
     */
    return rest.getList(resource, {}, user);
};
