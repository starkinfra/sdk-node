const SubResource = require('../utils/subResource').SubResource;


class Rule extends SubResource {
    /**
     *
     * CreditNote.Rule object
     *
     * @description The CreditNote.Rule object modifies the behavior of CreditNotes when passed as an argument upon their creation.
     *
     * Parameters (required):
     * @param key [string]: Rule to be customized, describes what CreditNote behavior will be altered. ex: 'invoiceCreationMode'
     * @param value [string]: value of the rule. ex: 'scheduled'
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
