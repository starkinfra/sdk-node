const rest = require('../utils/rest.js');
const api = require("../utils/api");
const {Certificate} = require("./certificate");
const certificateResource = require('./certificate.js').subResource;
const SubResource = require("../utils/subResource").SubResource;


class PixDomain extends SubResource {
    /**
     *
     * PixDomain object
     *
     * @description The PixDomain object displays the domain name and the QR Code domain certificate of Pix participants.
     * All certificates must be registered with the Central Bank.
     *
     * Attributes (return-only):
     * @param certificates [list of PixDomain.Certificate]: certificate information of the Pix participant.
     * @param name [string]: current active domain (URL) of the Pix participant.
     *
     */
    constructor({ certificates, name }) {
        super();
        this.certificates = parseCertificates(certificates);
        this.name = name;
    }
}

parseCertificates = function (certificates) {
    let parsedCertificates = [];
    for (let certificate of certificates) {
        if (certificate instanceof Certificate) {
            api.removeNullKeys(certificate)
            parsedCertificates.push(certificate);
            continue;
        }
        certificate = Object.assign(new certificateResource['class'](certificate), certificate);
        api.removeNullKeys(certificate);
        parsedCertificates.push(certificate);
    }
    return parsedCertificates;
}

exports.PixDomain = PixDomain;
let resource = {'class': exports.PixDomain, 'name': 'PixDomain'};

exports.query = async function ({ user } = {}) {
    /**
     *
     * Retrieve PixDomains
     *
     * @description Receive a generator of PixDomain objects.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixDomain objects with updated attributes
     *
     */
    return rest.getList(resource, {}, user);
};
