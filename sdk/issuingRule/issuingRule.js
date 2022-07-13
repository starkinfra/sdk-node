const {parseObjects} = require('../utils/parse');
const {CardMethod} = require('../cardMethod/cardMethod.js');
const cardMethodResource = require('../cardMethod/cardMethod').resource;
const {MerchantCountry} = require('../merchantCountry/merchantCountry.js');
const merchantCountryResource = require('../merchantCountry/merchantCountry').resource;
const {MerchantCategory} = require('../merchantCategory/merchantCategory.js');
const merchantCategoryResource = require('../merchantCategory/merchantCategory').resource;
const Resource = require('../utils/resource.js').Resource


class IssuingRule extends Resource {
    /**
     *
     * IssuingRule object
     *
     * @description The IssuingRule object displays the spending rules of IssuingCards and IssuingHolders created in your Workspace.
     *
     * Parameters (required):
     * @param name [string]: rule name. ex: 'Travel' or 'Food'
     * @param amount [integer]: maximum amount that can be spent in the informed interval. ex: 200000 (= R$ 2000.00)
     *
     * Parameters (optional):
     * @param id [string, default null]: unique id returned when Rule is created. ex: '5656565656565656'
     * @param interval [string, default 'lifetime']: interval after which the rule amount counter will be reset to 0. Options: 'instant', 'day', 'week', 'month', 'year' or 'lifetime'
     * @param currencyCode [string, default 'BRL']: code of the currency that the rule amount refers to. Options: 'BRL' or 'USD'
     * @param categories [list of strings, default []]: merchant categories accepted by the rule. ex: ['eatingPlacesRestaurants', 'travelAgenciesTourOperators']
     * @param countries [list of strings, default []]: countries accepted by the rule. ex: ['BRA', 'USA']
     * @param methods [list of strings, default []]: card purchase methods accepted by the rule. ex: ['chip', 'token', 'server', 'manual', 'magstripe', 'contactless']
     *
     * Attributes (expanded return-only):
     * @param counterAmount [integer]: current rule spent amount. ex: 1000
     * @param currencySymbol [string]: currency symbol. ex: 'R$'
     * @param currencyName [string]: currency name. ex: 'Brazilian Real'
     *
     */
    constructor({ 
                    name, amount, id=null, interval=null, currencyCode=null, categories=null, 
                    countries=null, methods=null, counterAmount=null, currencySymbol=null, currencyName=null, 
                }) {
        super(id);
        this.name = name;
        this.amount = amount;
        this.interval = interval;
        this.currencyCode = currencyCode;
        this.categories = parseObjects(categories, merchantCategoryResource, MerchantCategory);
        this.countries = parseObjects(countries, merchantCountryResource, MerchantCountry);
        this.methods = parseObjects(methods, cardMethodResource, CardMethod);
        this.counterAmount = counterAmount;
        this.currencySymbol = currencySymbol;
        this.currencyName = currencyName;
    }
}

exports.IssuingRule = IssuingRule;
exports.resource = {'class': exports.IssuingRule, 'name': 'IssuingRule'};
