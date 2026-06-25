const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const {parseObjects} = require('../utils/parse');
const Resource = require('starkcore').Resource;
const {Rule} = require('../ledger/rule/rule.js');
const ruleResource = require('../ledger/rule/rule.js').subResource;


class LedgerTransaction extends Resource {
    /**
     *
     * LedgerTransaction object
     *
     * @description LedgerTransactions are used to move amounts in and out of a Ledger, updating its balance.
     * They can represent a deposit, a withdrawal, a transfer, an adjustment, etc.
     *
     * Parameters (required):
     * @param amount [integer]: amount of the transaction. ex: 11234
     * @param ledgerId [string]: id of the Ledger containing the transaction. ex: '5656565656565656'
     * @param externalId [string]: string that must be unique among all your LedgerTransactions in a single Ledger. ex: 'my-internal-id-123456'
     * @param source [string]: source of the LedgerTransaction. ex: 'bank-transfer/123'
     *
     * Parameters (optional):
     * @param fee [integer, default null]: fee applied to the LedgerTransaction. ex: 100
     * @param rules [list of Ledger.Rule objects, default []]: list of Rule objects linked to the LedgerTransaction. Rules are used to overwrite the Ledger's rules for this transaction. ex: [new starkinfra.ledger.Rule({key: 'minimumBalance', value: 0})]
     * @param metadata [dictionary object, default {}]: dictionary object used to store additional information about the LedgerTransaction object. ex: { orderId: '123', orderType: 'purchase' }
     * @param tags [list of strings, default []]: list of strings for reference when searching for LedgerTransactions. ex: ['transfer/123', 'savings']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the LedgerTransaction is created. ex: '5656565656565656'
     * @param balance [integer]: Ledger's balance after the transaction. ex: 11234
     * @param created [string]: creation datetime for the LedgerTransaction. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    amount, ledgerId, externalId, source, id=null, balance=null,
                    fee=null, rules=null, metadata=null, tags=null, created=null
                }) {
        super(id);

        this.amount = amount;
        this.ledgerId = ledgerId;
        this.externalId = externalId;
        this.source = source;
        this.balance = balance;
        this.fee = fee;
        this.rules = parseObjects(rules, ruleResource, Rule);
        this.metadata = metadata;
        this.tags = tags;
        this.created = check.datetime(created);
    }
}

exports.LedgerTransaction = LedgerTransaction;
let resource = {'class': exports.LedgerTransaction, 'name': 'LedgerTransaction'};

exports.create = async function (transactions, {user} = {}) {
    /**
     *
     * Create LedgerTransactions
     *
     * @description Send a list of LedgerTransaction objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param transactions [list of LedgerTransaction objects]: list of LedgerTransaction objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of LedgerTransaction objects with updated attributes
     *
     */
    return rest.post(resource, transactions, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific LedgerTransaction
     *
     * @description Receive a single LedgerTransaction object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns LedgerTransaction object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ ledgerId, flow, tags, externalIds, after, before, ids, limit, user } = {}) {
    /**
     *
     * Retrieve LedgerTransactions
     *
     * @description Receive a generator of LedgerTransaction objects previously created in the Stark Infra API
     *
     * Parameters (conditionally-required):
     * @param ledgerId [string, default null]: id of the Ledger containing the transaction. Either ledgerId or ids must be provided. If both are sent, the query will be filtered by both. ex: '5656565656565656'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. Either ledgerId or ids must be provided. If both are sent, the query will be filtered by both. ex: ['5656565656565656', '4545454545454545']
     *
     * Parameters (optional):
     * @param flow [string, default null]: direction of the transaction. ex: 'in' or 'out'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['transfer/123', 'savings']
     * @param externalIds [list of strings, default null]: list of external ids to filter retrieved objects. ex: ['my-internal-id-123456', 'my-internal-id-654321']
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param limit [integer, default 100, maximum 1000]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of LedgerTransaction objects with updated attributes
     *
     */
    let query = {
        ledgerId: ledgerId,
        flow: flow,
        tags: tags,
        externalIds: externalIds,
        after: after,
        before: before,
        ids: ids,
        limit: limit,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ ledgerId, flow, tags, externalIds, after, before, ids, limit, cursor, user } = {}) {
    /**
     *
     * Retrieve paged LedgerTransactions
     *
     * @description Receive a list of LedgerTransaction objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (conditionally-required):
     * @param ledgerId [string, default null]: id of the Ledger containing the transaction. Either ledgerId or ids must be provided. If both are sent, the query will be filtered by both. ex: '5656565656565656'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. Either ledgerId or ids must be provided. If both are sent, the query will be filtered by both. ex: ['5656565656565656', '4545454545454545']
     *
     * Parameters (optional):
     * @param flow [string, default null]: direction of the transaction. ex: 'in' or 'out'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['transfer/123', 'savings']
     * @param externalIds [list of strings, default null]: list of external ids to filter retrieved objects. ex: ['my-internal-id-123456', 'my-internal-id-654321']
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param limit [integer, default 100, maximum 1000]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of LedgerTransaction objects with updated attributes and cursor to retrieve the next page of LedgerTransaction objects
     *
     */
    let query = {
        ledgerId: ledgerId,
        flow: flow,
        tags: tags,
        externalIds: externalIds,
        after: after,
        before: before,
        ids: ids,
        limit: limit,
        cursor: cursor,
    };
    return rest.getPage(resource, query, user);
};
