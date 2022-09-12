const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class IssuingTransaction extends Resource {
    /**
     *
     * IssuingTransaction object
     *
     * @description The IssuingTransaction objects created in your Workspace to represent each balance shift.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingTransaction is created. ex: '5656565656565656'
     * @param amount [integer]: IssuingTransaction value in cents. Minimum = 0. ex: 1234 (= R$ 12.34)
     * @param balance [integer]: balance amount of the workspace at the instant of the Transaction in cents. ex: 200 (= R$ 2.00)
     * @param description [string]: IssuingTransaction description. ex: 'Buying food'
     * @param source [string]: source of the transaction. ex: 'issuing-purchase/5656565656565656'
     * @param tags [string]: list of strings for tagging ex: ['tony', 'stark']
     * @param created [string]: creation datetime for the IssuingTransaction. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    id=null, amount=null, balance=null, description=null, 
                    source=null, tags=null, created=null
                }) {
        super(id);
        
        this.amount = amount;
        this.balance = balance;
        this.description = description;
        this.source = source;
        this.tags = tags;
        this.created = check.datetime(created);
    }
}

exports.IssuingTransaction = IssuingTransaction;
let resource = {'class': exports.IssuingTransaction, 'name': 'IssuingTransaction'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingTransaction
     *
     * @description Receive a single IssuingTransaction object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingTransaction object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ source, tags, externalIds, after, before, ids, limit, user } = {}) {
    /**
     *
     * Retrieve IssuingTransactions
     *
     * @description Receive a generator of IssuingTransaction objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param externalIds [list of strings, default []]: external IDs. ex: ['5656565656565656', '4545454545454545']
     * @param after [DateTime or string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [DateTime or string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingTransaction objects with updated attributes
     *
     */

    let query = {
        source: source,
        tags: tags,
        externalIds: externalIds,
        after: after,
        before: before,
        ids: ids,
        limit: limit,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, source, tags, externalIds, after, before, ids, limit, user } = {}) {
    /**
     *
     * Retrieve paged IssuingTransactions
     *
     * @description Receive a list of up to 100 IssuingTransaction objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param externalIds [list of strings, default []]: external IDs. ex: ['5656565656565656', '4545454545454545']
     * @param after [DateTime or string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [DateTime or string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param ids [list of strings, default []]: purchase IDs
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingTransaction objects with updated attributes and cursor to retrieve the next page of IssuingTransaction objects
     *
     */
    let query = {
        cursor: cursor,
        source: source,
        tags: tags,
        externalIds: externalIds,
        after: after,
        before: before,
        ids: ids,
        limit: limit,
    };
    return rest.getPage(resource, query, user);
};
