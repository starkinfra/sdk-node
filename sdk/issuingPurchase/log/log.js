const rest = require('../../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('../../utils/resource.js').Resource


class Log extends Resource {
    /**
     *
     * IssuingPurchase Log object
     *
     * @description Every time an IssuingPurchase entity is modified, a corresponding IssuingPurchase Log
     * is generated for the entity. This log is never generated by the
     * user.
     *
     * Attributes:
     * @param id [string]: unique id returned when the log is created. ex: '5656565656565656'
     * @param created [string]: creation datetime for the log. ex: '2020-03-10 10:30:00.000'
     * @param type [string]: type of the IssuingPurchase event which triggered the log creation. ex: 'processing' or 'success'
     * @param errors [list of strings]: list of errors linked to this IssuingPurchase event.
     * @param purchase [IssuingPurchase]: IssuingPurchase entity to which the log refers to.
     *
     */
    constructor({ 
                    id=null, created=null, type=null, errors=null, purchase=null
                }) {
        super(id);
        
        this.created = check.datetime(created);
        this.type = type;
        this.errors = errors;
        this.purchase = purchase;
    }
}

exports.Log = Log;
let resource = {'class': exports.Log, 'name': 'IssuingPurchaseLog'};


exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingPurchase Log
     *
     * @description Receive a single IssuingPurchase Log object previously created by the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingPurchase Log object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ ids, purchaseIds, types, after, before, limit, user } = {}) {
    /**
     *
     * Retrieve IssuingPurchase Logs
     *
     * @description Receive a generator of IssuingPurchase Log objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: ['approved', 'denied']
     * @param purchaseIds [list of strings, default null]: list of IssuingPurchase ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingPurchase Log objects with updated attributes
     *
     */
    let query = {
        ids: ids,
        purchaseIds: purchaseIds,
        types: types,
        after: after,
        before: before,
        limit: limit,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, ids, purchaseIds, types, after, before, limit, user } = {}) {
    /**
     *
     * Retrieve paged IssuingPurchase Logs
     *
     * @description Receive a list of up to 100 IssuingPurchase.Log objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your purchases.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: ['approved', 'denied']
     * @param purchaseIds [list of strings, default null]: list of IssuingPurchase ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingPurchase Log objects with updated attributes and cursor to retrieve the next page of IssuingPurchase objects
     *
     */
    let query = {
        cursor: cursor,
        ids: ids,
        purchaseIds: purchaseIds,
        types: types,
        after: after,
        before: before,
        limit: limit,
    };
    return rest.getPage(resource, query, user);
};
