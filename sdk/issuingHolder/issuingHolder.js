const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const {parseObjects} = require('../utils/parse');
const {IssuingRule} = require('../issuingRule/issuingRule.js');
const ruleResource = require('../issuingRule/issuingRule').resource;
const Resource = require('../utils/resource.js').Resource


class IssuingHolder extends Resource {
    /**
     *
     * IssuingHolder object
     *
     * @description The IssuingHolder object displays the information of Cards created in your Workspace.
     *
     * Parameters (required):
     * @param name [string]: cardholder name. ex: 'Tony Stark'
     * @param taxId [string]: cardholder tax ID. ex: '012.345.678-90'
     * @param externalId [string] cardholder unique id, generated by the user to avoid duplicated holders. ex: 'my-entity/123'
     *
     * Parameters (optional):
     * @param rules [list of IssuingRules, default []]: [EXPANDABLE] list of holder spending rules.
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingHolder is created. ex: '5656565656565656'
     * @param status [string]: current IssuingHolder status. Options: 'active', 'blocked', 'canceled'
     * @param created [string]: creation datetime for the IssuingHolder. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingHolder. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    name, taxId, externalId, rules=null, tags=null, id=null, 
                    status=null, created=null, updated=null 
                }) {
        super(id);
        
        this.name = name;
        this.taxId = taxId;
        this.externalId = externalId;
        this.rules = parseObjects(rules, ruleResource, IssuingRule);
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingHolder = IssuingHolder;
let resource = {'class': exports.IssuingHolder, 'name': 'IssuingHolder'};

exports.create = async function (holders, { expand, user } = {}) {
    /**
     *
     * Create IssuingHolder
     *
     * @description Send a list of IssuingHolder objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param holders [list of IssuingHolder objects]: list of IssuingHolder objects to be created in the API
     *
     * Parameters (optional):
     * @param expand [list of strings, default []]: fields to expand information. ex: ['rules']
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingHolder objects with updated attributes
     *
     */
    return rest.post(resource, holders, user, {'expand': expand});
};

exports.get = async function (id, {expand, user} = {}) {
    /**
     *
     * Retrieve a specific IssuingHolder
     *
     * @description The IssuingHolder describes a cardholder that may group several cards.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param expand [list of strings, default []]: fields to expand information. ex: ['rules']
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingHolder object with updated attributes
     *
     */
    return rest.getId(resource, id, user, {'expand': expand});
};

exports.query = async function ({ limit, after, before, status, tags, ids, expand, user } = {}) {
    /**
     *
     * Retrieve IssuingHolders
     *
     * @description Receive a generator of IssuingHolder objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [DateTime or string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [DateTime or string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'paid' or 'registered'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param expand [string, default null]: fields to expand information. ex: 'rules'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingHolder objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        expand: expand,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, expand, user } = {}) {
    /**
     *
     * Retrieve paged IssuingHolders
     *
     * @description Receive a list of IssuingHolder objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [DateTime or string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [DateTime or string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'paid' or 'registered'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param expand [string, default null]: fields to expand information. ex: 'rules'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingHolder objects with updated attributes and cursor to retrieve the next page of IssuingHolder objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        expand: expand,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { status, name, rules, tags, user }) {
    /**
     *
     * Update IssuingHolder entity
     *
     * @description Update IssuingHolder by passing id.
     *
     * Parameters (required):
     * @param id [string]: IssuingHolder unique ids. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param status [string, default null]: You may block the IssuingHolder by passing 'blocked' in the status
     * @param name [string, default null]: cardholder name. ex: 'Tony Stark'
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['tony', 'stark']
     * @param rules [list of dictionaries, default null]: list of dictionaries with 'amount': int, 'currencyCode': string, 'id': string, 'interval': string, 'name': string pairs
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target IssuingHolder with updated attributes
     *
     */
    let payload = {
        status: status,
        name: name,
        rules: rules,
        tags: tags,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel an IssuingHolder entity
     *
     * @description Cancel an IssuingHolder entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: IssuingHolder unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled IssuingHolder object
     *
     */
    return rest.deleteId(resource, id, user);
};