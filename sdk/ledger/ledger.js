const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const {parseObjects} = require('../utils/parse');
const Resource = require('starkcore').Resource;
const {Rule} = require('./rule/rule.js');
const ruleResource = require('./rule/rule.js').subResource;


class Ledger extends Resource {
    /**
     *
     * Ledger object
     *
     * @description Ledgers are used to track the balance of a given amount by inserting LedgerTransactions to them.
     * They can represent a bank account, a digital wallet, an inventory product, etc.
     *
     * Parameters (required):
     * @param externalId [string]: string that must be unique among all your Ledgers. ex: 'my-internal-id-123456'
     *
     * Parameters (optional):
     * @param rules [list of Ledger.Rule objects, default []]: list of Rule objects linked to the Ledger. Rules are used to limit the balance of the Ledger. ex: [new starkinfra.ledger.Rule({key: 'minimumBalance', value: 0})]
     * @param tags [list of strings, default []]: list of strings for reference when searching for Ledgers. ex: ['account/123', 'savings']
     * @param metadata [dictionary object, default {}]: dictionary object used to store additional information about the Ledger object. ex: { accountId: '123', accountType: 'savings' }
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the Ledger is created. ex: '5656565656565656'
     * @param created [string]: creation datetime for the Ledger. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the Ledger. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    externalId, id=null, rules=null, tags=null, metadata=null,
                    created=null, updated=null
                }) {
        super(id);

        this.externalId = externalId;
        this.rules = parseObjects(rules, ruleResource, Rule);
        this.tags = tags;
        this.metadata = metadata;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.Ledger = Ledger;
let resource = {'class': exports.Ledger, 'name': 'Ledger'};

exports.create = async function (ledgers, {user} = {}) {
    /**
     *
     * Create Ledgers
     *
     * @description Send a list of Ledger objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param ledgers [list of Ledger objects]: list of Ledger objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of Ledger objects with updated attributes
     *
     */
    return rest.post(resource, ledgers, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific Ledger
     *
     * @description Receive a single Ledger object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Ledger object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, ids, externalIds, tags, user } = {}) {
    /**
     *
     * Retrieve Ledgers
     *
     * @description Receive a generator of Ledger objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param externalIds [list of strings, default null]: list of external ids to filter retrieved objects. ex: ['my-internal-id-123456', 'my-internal-id-654321']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['account/123', 'savings']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of Ledger objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        ids: ids,
        externalIds: externalIds,
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, ids, externalIds, tags, user } = {}) {
    /**
     *
     * Retrieve paged Ledgers
     *
     * @description Receive a list of up to 100 Ledger objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param externalIds [list of strings, default null]: list of external ids to filter retrieved objects. ex: ['my-internal-id-123456', 'my-internal-id-654321']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['account/123', 'savings']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of Ledger objects with updated attributes and cursor to retrieve the next page of Ledger objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        ids: ids,
        externalIds: externalIds,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { rules, tags, metadata, user } = {}) {
    /**
     *
     * Update Ledger entity
     *
     * @description Update a Ledger by passing id.
     *
     * Parameters (required):
     * @param id [string]: Ledger unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param rules [list of Ledger.Rule objects, default null]: list of Rule objects linked to the Ledger. Rules are used to limit the balance of the Ledger. ex: [new starkinfra.ledger.Rule({key: 'minimumBalance', value: 0})]
     * @param tags [list of strings, default null]: list of strings for reference when searching for Ledgers. ex: ['account/123', 'savings']
     * @param metadata [dictionary object, default null]: dictionary object used to store additional information about the Ledger object. ex: { accountId: '123', accountType: 'savings' }
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target Ledger with updated attributes
     *
     */
    let payload = {
        rules: rules,
        tags: tags,
        metadata: metadata,
    };
    return rest.patchId(resource, id, payload, user);
};
