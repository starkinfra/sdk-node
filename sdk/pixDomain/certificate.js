const SubResource = require('../utils/subResource').SubResource;


class Certificate extends SubResource {
    /**
     *
     * Certificate object
     *
     * @description The Certificate object displays the certificate information from a specific domain.
     *
     * Attributes (return-only):
     * @param content [string]: certificate of the Pix participant in PEM format.
     *
     */
    constructor({ 
                    content=null
                }) {
        super();
        this.content = content;
    }
}

exports.Certificate = Certificate;
exports.subResource = {'class': exports.Certificate, 'name': 'Certificate'};
