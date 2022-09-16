const rest = require('../utils/rest.js');
const SubResource = require('../utils/subResource.js').SubResource


class MerchantCategory extends SubResource {
    /**
     *
     * MerchantCategory object
     *
     * @description MerchantCategory's codes and types are used to define category filters in IssuingRules.
     * A MerchantCategory filter must define exactly one parameter between code and type.
     * A type, such as 'food', 'services', etc., defines an entire group of merchant codes,
     * whereas a code only specifies a specific MCC.
     *
     * Parameters (conditionally required):
     * @param code [string, default null]: category's code. ex: 'veterinaryServices', 'fastFoodRestaurants'
     * @param type [string, default null]: category's type. ex: 'pets', 'food'
     *
     * Attributes (return-only):
     * @param name [string]: category's name. ex: 'Veterinary services', 'Fast food restaurants'
     * @param number [string]: category's number. ex: '742', '5814'
     *
     */
    constructor({ 
                    code=null, type=null, name=null, number=null 
                }) {
        super();
        
        this.code = code
        this.type = type
        this.name = name
        this.number = number
    }
}

exports.MerchantCategory = MerchantCategory;
exports.subResource = {'class': exports.MerchantCategory, 'name': 'MerchantCategory'};

exports.query = async function ({ search, user } = {}) {
    /**
     *
     * Retrieve MerchantCategories
     *
     * @description Receive a generator of MerchantCategory objects from the Stark Infra API
     *
     * Parameters (optional):
     * @param search [string, default null]: keyword to search for code, type, name or number
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of MerchantCategory objects with updated attributes
     *
     */
    query = {
        search: search
    };
    return rest.getList(exports.subResource, query, user);
};
