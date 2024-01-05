const rest = require('../utils/rest.js');
const Resource = require('starkcore').Resource;


class IssuingRestock extends Resource {
    /**
     *
     * IssuingRestock object
     *
     * @description The IssuingRestock object displays the information of the restock orders created in your Workspace. 
     * This resource place a restock order for a specific IssuingStock object.
     * 
     * When you initialize a IssuingRestock, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param count [integer]: number of restocks to be restocked. ex: 100
     * @param stockId [string]: IssuingStock unique id ex: "5136459887542272"
     *
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingRestock is created. ex: '5656565656565656'
     * @param status [string]: current IssuingRestock status. ex: "created", "processing", "confirmed"
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000' 
     * @param created [string]: creation datetime for the IssuingDesign. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    count, stockId, tags = null, id = null, status = null, 
                    updated = null, created = null
                }) {
        super(id);
        this.count = count;
        this.stockId = stockId;
        this.tags = tags;
        this.id = id;
        this.status = status;
        this.updated = updated;
        this.created = created;
    }
}

exports.IssuingRestock = IssuingRestock;
let resource = {'class': exports.IssuingRestock, 'name': 'IssuingRestock'};

exports.create = async function (restocks, { user } = {}) {
    /**
     *
     * Create IssuingRestocks
     *
     * @description Send a list of IssuingRestock objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param restocks [list of IssuingRestock objects]: list of IssuingRestock objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingRestock objects with updated attributes
     *
     */
    return rest.post(resource, restocks, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingRestock
     *
     * @description Receive a single IssuingRestock object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingRestock object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, stockIds, status, ids, user } = {}) {
    /**
     *
     * Retrieve IssuingRestocks
     *
     * @description Receive a generator of IssuingRestock objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "processing", "confirmed"]
     * @param stockIds [list of string, default null]: list of stockIds to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingRestock objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        stockIds: stockIds,
        ids: ids
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, stockIds, status, ids, user } = {}) {
    /**
     *
     * Retrieve paged IssuingRestocks
     *
     * @description Receive a list of up to 100 IssuingRestock objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "processing", "confirmed"]
     * @param stockIds [list of string, default null]: list of stockIds to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingRestock objects with updated attributes and cursor to retrieve the next page of IssuingRestock objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        stockIds: stockIds,
        ids: ids
    };
    return rest.getPage(resource, query, user);
};
