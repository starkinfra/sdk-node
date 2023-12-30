const rest = require('../utils/rest.js');
const SubResource = require('core-node').SubResource;


class MerchantCountry extends SubResource {
    /**
     *
     * MerchantCountry object
     *
     * @description MerchantCountry's codes are used to define country filters in IssuingRules.
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
    constructor({ 
                    code, name=null, number=null, shortCode=null 
                }) {
        super();
        
        this.code = code
        this.name = name
        this.number = number
        this.shortCode = shortCode
    }
}

exports.MerchantCountry = MerchantCountry;
exports.subResource = {'class': exports.MerchantCountry, 'name': 'MerchantCountry'};

exports.query = async function ({ search, user } = {}) {
    /**
     *
     * Retrieve MerchantCategories
     *
     * @description Receive a generator of MerchantCountry objects from the Stark Infra API
     *
     * Parameters (optional):
     * @param search [string, default null]: keyword to search for code, name, number or shortCode
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of MerchantCountry objects with updated attributes
     *
     */
    let query = {
        search: search
    }
    return rest.getList(exports.subResource, query, user);
};
