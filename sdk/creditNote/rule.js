const SubResource = require('../utils/subResource').SubResource;


class Rule extends SubResource {
    /**
     *
     * CreditNote.Rule object
     *
     * @description The CreditNote.Rule object modifies the behavior of CreditNotes when passed as an argument upon their creation.
     *
     * Parameters (required):
     * @param key [string]: Rule to be customized. Currently the only available key is 'invoiceCreationMode'.
     * @param value [string]: value of the rule. For 'invoiceCreationMode', options are 'scheduled' (default; each invoice is issued a few days before its due date), 'instant' (all invoices issued as soon as the note is disbursed) or 'never' (invoices not issued automatically).
     *
     */
    constructor({
                    key, value
                }) {
        super();

        this.key = key;
        this.value = value;
    }
}

exports.Rule = Rule;
exports.subResource = {'class': exports.Rule, 'name': 'Rule'};
