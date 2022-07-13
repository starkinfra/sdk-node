const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class IssuingProduct extends Resource {
    /**
     *
     * IssuingProduct object
     *
     * @description The IssuingProduct object displays information of BINs registered to your Workspace.
     *
     * Attributes (return-only):
     * @param id [string]: unique BIN number registered within the card network. ex: '53810200'
     * @param network [string]: card network flag. ex: 'mastercard'
     * @param settlement [string]: settlement type. ex: 'credit'
     * @param category [string]: purchase category. ex: 'prepaid'
     * @param client [string]: client type. ex: 'business'
     * @param created [string]: creation datetime for the IssuingProduct. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ id, created, network, settlement, category, client }) {
        super(id);
        this.network = network;
        this.settlement = settlement;
        this.category = category;
        this.client = client;
        this.created = check.datetime(created);
    }
}

exports.IssuingProduct = IssuingProduct;
let resource = {'class': exports.IssuingProduct, 'name': 'IssuingProduct'};

exports.query = async function ({ limit, user} = {}) {
    /**
     *
     * Retrieve IssuingProducts
     *
     * @description Receive a generator of IssuingProduct objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of IssuingProduct objects with updated attributes
     *
     */
    let query = {
        limit: limit,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, user} = {}) {
    /**
     *
     * Retrieve paged IssuingProducts
     *
     * @description Receive a list of up to 100 IssuingProduct objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your statements.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingProduct objects with updated attributes and cursor to retrieve the next page of IssuingProduct objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
    };
    return rest.getPage(resource, query, user);
};
