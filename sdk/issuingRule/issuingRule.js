const {parseObjects} = require('../utils/parse');
const Resource = require('starkcore').Resource;
const {CardMethod} = require('../cardMethod/cardMethod.js');
const cardMethodResource = require('../cardMethod/cardMethod').subResource;
const {MerchantCountry} = require('../merchantCountry/merchantCountry.js');
const {MerchantCategory} = require('../merchantCategory/merchantCategory.js');
const merchantCountryResource = require('../merchantCountry/merchantCountry').subResource;
const merchantCategoryResource = require('../merchantCategory/merchantCategory').subResource;


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
     * @param schedule [string]: Optional schedule dictating when the rule can be used. Some examples: 'everyday from 09:00 to 18:00 in America/Sao_Paulo' - every day, 09:00-18:00 Sao Paulo time; 'every monday, wednesday, friday from 08:00 to 12:00 in America/Sao_Paulo' - only those weekdays, mornings; 'every saturday, sunday' - weekends, all day, in UTC
     * @param purposes [list of strings]: Optional list of transaction purposes the rule applies to. Options: 'purchase', 'withdrawal', 'verification'. The rule then limits only purchases of those purposes; omit it to allow any purposes. Example: ['purchase', 'verification'] if you want us to automatically deny withdrawal.
     *
     */
    constructor({
                    name, amount, id=null, interval=null, currencyCode=null,
                    categories=null, countries=null, methods=null, counterAmount=null,
                    currencySymbol=null, currencyName=null, schedule=null, purposes=null
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
        this.schedule = schedule;
        this.purposes = purposes;
    }
}

exports.IssuingRule = IssuingRule;
exports.resource = {'class': exports.IssuingRule, 'name': 'IssuingRule'};
