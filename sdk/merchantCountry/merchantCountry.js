const rest = require('../utils/rest.js');
const SubResource = require('../utils/subResource.js').SubResource


class MerchantCountry extends SubResource {
    /**
     *
     * MerchantCountry object
     *
     * @description MerchantCountry's codes are used to define countries filters in IssuingRules.
     *
     * Parameters (required):
     * @param code [string]: country's code. ex: 'BRA'
     *
     * Attributes (return-only):
     * @param name [string]: country's name. ex: 'Brazil'
     * @param number [string]: country's number. ex: '076'
     * @param shortCode [string]: category's shortCode. ex: 'pets', 'food'
     *
     */
    constructor({ code, name=null, number=null, shortCode=null }) {
        super();
        this.code = code
        this.name = name
        this.number = number
        this.shortCode = shortCode
    }
}

exports.MerchantCountry = MerchantCountry;
exports.resource = {'class': exports.MerchantCountry, 'name': 'MerchantCountry'};

exports.query = async function ({ search, user } = {}) {
    /**
     *
     * Retrieve MerchantCategories
     *
     * @description Receive a generator of MerchantCountries objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param search [string, default null]: keyword to search for code, name, number or shortCode
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of MerchantCountries objects with updated attributes
     *
     */
    return rest.getList(resource, search, user);
};
