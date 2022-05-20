const Resource = require('../utils/resource.js').Resource


class IssuingRule extends Resource {
    /**
     *
     * IssuingRule object
     *
     * @description The IssuingRule object displays the spending rules of IssuingCards and IssuingHolders created in your Workspace.
     *
     * Parameters (required):
     * @param name [string]: rule name. ex: "Travel" or "Food"
     * @param amount [integer]: maximum amount that can be spent in the informed interval. ex: 200000 (= R$ 2000.00)
     * @param interval [string]: interval after which the rule amount counter will be reset to 0. ex: "instant", "day", "week", "month", "year" or "lifetime"
     * 
     * Parameters (optional):
     * @param currencyCode [string, default "BRL"]: code of the currency that the rule amount refers to. ex: "BRL" or "USD"
     * @param categories [list of strings, default []]: merchant categories accepted by the rule. ex: ["eatingPlacesRestaurants", "travelAgenciesTourOperators"]
     * @param countries [list of strings, default []]: countries accepted by the rule. ex: ["BRA", "USA"]
     * @param methods [list of strings, default []]: card purchase methods accepted by the rule. ex: ["chip", "token", "server", "manual", "magstripe", "contactless"]
     *
     * Attributes (expanded return-only):
     * @param counterAmount [integer]: current rule spent amount. ex: 1000
     * @param currencySymbol [string]: currency symbol. ex: "R$"
     * @param currencyName [string]: currency name. ex: "Brazilian Real"
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when Rule is created. ex: "5656565656565656"
     * 
     */
    constructor({ id, name, interval, amount, currencyCode, counterAmount, currencyName, currencySymbol, categories, countries, methods }) {
        super(id);
        this.name = name;
        this.interval = interval;
        this.amount = amount;
        this.currencyCode = currencyCode;
        this.counterAmount = counterAmount;
        this.currencyName = currencyName;
        this.currencySymbol = currencySymbol;
        this.categories = categories;
        this.countries = countries;
        this.methods = methods;
    }
}

exports.IssuingRule = IssuingRule;
