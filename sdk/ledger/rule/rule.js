const SubResource = require('starkcore').SubResource;


class Rule extends SubResource {
    /**
     *
     * Ledger.Rule object
     *
     * @description The Ledger.Rule object modifies the behavior of Ledger objects when passed as an argument upon their creation or update.
     *
     * Parameters (required):
     * @param key [string]: Rule to be customized, describes what Ledger behavior will be altered. ex: 'minimumBalance', 'maximumBalance'
     * @param value [integer]: Value of the rule. ex: 1000
     *
     */
    constructor({ key, value }) {
        super();

        this.key = key;
        this.value = value;
    }
}

exports.Rule = Rule;
exports.subResource = {'class': exports.Rule, 'name': 'Rule'};
