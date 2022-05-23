const SubResource = require('../../utils/subResource.js').SubResource


class Description extends SubResource {
    /**
     *
     * CreditNote.Invoice.Description object
     *
     * @description Used to define a description in the Invoice.
     *
     * Parameters (required):
     * @param key [string]: key describing a part of the invoice value. ex: "Taxes"
     * @param value [string]: value to which the key refers to. ex: "120"
     *
     */
    constructor({ key, value }) {
        super();

        this.key = key;
        this.value = value;
    }
}

exports.Description = Description;
exports.subResource = {'class': exports.Description, 'name': 'Description'};
