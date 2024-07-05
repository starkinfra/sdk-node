const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IssuingWithdrawal extends Resource {
    /**
     *
     * IssuingWithdrawal object
     *
     * @description The IssuingWithdrawal objects created in your Workspace return cash from your Issuing balance to your
     *
     * Parameters (required):
     * @param amount [integer]: IssuingWithdrawal value in cents. ex: 1234 (= R$ 12.34)
     * @param externalId [string] IssuingWithdrawal external ID. ex: '12345'
     * @param description [string]: IssuingWithdrawal description. ex: 'sending money back'
     *
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for tagging
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingWithdrawal is created. ex: '5656565656565656'
     * @param transactionId [string]: Stark Bank ledger transaction ids linked to this IssuingWithdrawal
     * @param issuingTransactionId [string]: ledger transaction ids linked to this IssuingWithdrawal. ex: 'issuing-withdrawal/5656565656565656'
     * @param created [string]: creation datetime for the IssuingWithdrawal. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingWithdrawal. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    amount, externalId, description, tags=null, id=null, transactionId=null, 
                    issuingTransactionId=null, created=null, updated=null
                }) {
        super(id);
        
        this.amount = amount
        this.description = description
        this.transactionId = transactionId
        this.issuingTransactionId = issuingTransactionId
        this.externalId = externalId
        this.tags = tags
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingWithdrawal = IssuingWithdrawal;
let resource = {'class': exports.IssuingWithdrawal, 'name': 'IssuingWithdrawal'};

exports.create = async function ({ amount, externalId, description, tags, user} = {}) {
    /**
     *
     * Create IssuingWithdrawal
     *
     * @description Send IssuingWithdrawal infomations for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param amount [integer]: IssuingWithdrawal value in cents. ex: 1234 (= R$ 12.34)
     * @param externalId [string]: IssuingWithdrawal unique id, generated by the user to avoid duplicated withdrawals. ex: 'my-entity/123'
     * @param description [string]: IssuingWithdrawal description
     *
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingWithdrawal object with updated attributes
     *
     */
    let options = {
        amount: amount,
        externalId: externalId,
        description: description,
        tags: tags
    }
    return rest.postSingle(resource, options, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingWithdrawal
     *
     * @description Receive a single IssuingWithdrawal object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingWithdrawal object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ externalIds, after, before, limit, tags, user } = {}) {
    /**
     *
     * Retrieve IssuingWithdrawals
     *
     * @description Receive a generator of IssuingWithdrawal objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param externalIds [list of strings, default []]: external IDs. ex: ['5656565656565656', '4545454545454545']
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingWithdrawal objects with updated attributes
     *
     */
    let query = {
        externalIds: externalIds,
        after: after,
        before: before,
        limit: limit,
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, externalIds, after, before, limit, tags, user } = {}) {
    /**
     *
     * Retrieve paged IssuingWithdrawals
     *
     * @description Receive a list of up to 100 IssuingWithdrawal objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param externalIds [list of strings, default []]: external IDs. ex: ['5656565656565656', '4545454545454545']
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingWithdrawal objects with updated attributes and cursor to retrieve the next page of IssuingWithdrawal objects
     *
     */
    let query = {
        cursor: cursor,
        externalIds: externalIds,
        after: after,
        before: before,
        limit: limit,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};
