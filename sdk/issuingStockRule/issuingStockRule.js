const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IssuingStockRule extends Resource {
    /**
     *
     * IssuingStockRule object
     *
     * @description The IssuingStockRule object displays a notification rule attached to an IssuingStock.
     * When the linked stock balance reaches the minimumBalance, the recipients listed in emails and phones
     * are notified.
     *
     * When you initialize an IssuingStockRule, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param minimumBalance [integer]: stock balance threshold that triggers a notification. ex: 10000
     * @param stockId [string]: IssuingStock unique id the rule is linked to. ex: '5136459887542272'
     *
     * Parameters (optional):
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['card', 'corporate']
     * @param emails [list of strings, default null]: emails notified when the stock reaches the minimum balance. ex: ['john.doe@enterprise.com']
     * @param phones [list of strings, default null]: phones notified when the stock reaches the minimum balance. ex: ['+5511912345678']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingStockRule is created. ex: '5664445921492992'
     * @param status [string]: current IssuingStockRule status. Options: 'active', 'canceled'
     * @param created [string]: creation datetime for the IssuingStockRule. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingStockRule. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    minimumBalance, stockId, tags = null, emails = null, phones = null,
                    id = null, status = null, created = null, updated = null
                }) {
        super(id);
        this.minimumBalance = minimumBalance;
        this.stockId = stockId;
        this.tags = tags;
        this.emails = emails;
        this.phones = phones;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingStockRule = IssuingStockRule;
let resource = {'class': exports.IssuingStockRule, 'name': 'IssuingStockRule'};

exports.create = async function (rules, { user } = {}) {
    /**
     *
     * Create IssuingStockRules
     *
     * @description Send a list of IssuingStockRule objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param rules [list of IssuingStockRule objects]: list of IssuingStockRule objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingStockRule objects with updated attributes
     *
     */
    return rest.post(resource, rules, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingStockRule
     *
     * @description Receive a single IssuingStockRule object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5664445921492992'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingStockRule object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, stockIds, ids, tags, user } = {}) {
    /**
     *
     * Retrieve IssuingStockRules
     *
     * @description Receive a generator of IssuingStockRule objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['active', 'canceled']
     * @param stockIds [list of strings, default null]: list of stockIds to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['card', 'corporate']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingStockRule objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        stockIds: stockIds,
        ids: ids,
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, stockIds, ids, tags, user } = {}) {
    /**
     *
     * Retrieve paged IssuingStockRules
     *
     * @description Receive a list of up to 100 IssuingStockRule objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['active', 'canceled']
     * @param stockIds [list of strings, default null]: list of stockIds to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['card', 'corporate']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingStockRule objects with updated attributes and cursor to retrieve the next page of IssuingStockRule objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        stockIds: stockIds,
        ids: ids,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { minimumBalance, tags, emails, phones, user } = {}) {
    /**
     *
     * Update IssuingStockRule entity
     *
     * @description Update an IssuingStockRule by passing id.
     *
     * Parameters (required):
     * @param id [string]: IssuingStockRule unique id. ex: '5664445921492992'
     *
     * Parameters (optional):
     * @param minimumBalance [integer, default null]: stock balance threshold that triggers a notification. ex: 20000
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['card', 'corporate']
     * @param emails [list of strings, default null]: emails notified when the stock reaches the minimum balance. ex: ['john.doe@enterprise.com']
     * @param phones [list of strings, default null]: phones notified when the stock reaches the minimum balance. ex: ['+5511912345678']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target IssuingStockRule with updated attributes
     *
     */
    let payload = {
        minimumBalance: minimumBalance,
        tags: tags,
        emails: emails,
        phones: phones,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, { user } = {}) {
    /**
     *
     * Cancel an IssuingStockRule entity
     *
     * @description Cancel an IssuingStockRule entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: IssuingStockRule unique id. ex: '5664445921492992'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled IssuingStockRule object
     *
     */
    return rest.deleteId(resource, id, user);
};
