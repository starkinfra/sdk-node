const rest = require('../utils/rest.js');
const SubResource = require('../utils/subResource.js').SubResource


class CardMethod extends SubResource {
    /**
     *
     * CardMethod object
     *
     * @description CardMethod's codes are used to define methods filters in IssuingRules.
     *
     * Parameters (conditionally required):
     * @param code [string]: method's code. Options: 'chip', 'token', 'server', 'manual', 'magstripe', 'contactless'
     *
     * Attributes (return-only):
     * @param name [string]: method's name. ex: 'token'
     * @param number [string]: method's number. ex: '81'
     *
     */
    constructor({ code, name=null, number=null }) {
        super();
        this.code = code
        this.name = name
        this.number = number
    }
}

exports.CardMethod = CardMethod;
exports.resource = {'class': exports.CardMethod, 'name': 'CardMethod'};

exports.query = async function ({ search, user } = {}) {
    /**
     *
     * Retrieve MerchantCategories
     *
     * @description Receive a generator of CardMethods objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param search [string, default null]: keyword to search for code, name, number or shortCode
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of CardMethods objects with updated attributes
     *
     */
    return rest.getList(resource, search, user);
};
