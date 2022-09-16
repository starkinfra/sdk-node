const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const {parseObjects} = require('../utils/parse');
const {IssuingRule} = require('../issuingRule/issuingRule.js');
const ruleResource = require('../issuingRule/issuingRule').resource;
const Resource = require('../utils/resource.js').Resource


class IssuingCard extends Resource {
    /**
     *
     * IssuingCard object
     *
     * @description The IssuingCard object displays the information of Cards created in your Workspace.
     *
     * Parameters (required):
     * @param holderName [string]: cardholder name. ex: 'Tony Stark'
     * @param holderTaxId [string]: cardholder tax ID. ex: '012.345.678-90'
     * @param holderExternalId [string] cardholder unique id, generated by the user to avoid duplicated holders. ex: 'my-entity/123'
     *
     * Parameters (optional):
     * @param displayName [string, default null]: card displayed name. ex: 'ANTHONY STARK'
     * @param rules [list of IssuingRule, default []]: [EXPANDABLE] list of card spending rules.
     * @param binId [string, default null]: BIN ID to which the card is bound. ex: '53810200'
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     * @param streetLine1 [string, default sub-issuer street line 1]: cardholder main address. ex: 'Av. Paulista, 200'
     * @param streetLine2 [string, default sub-issuer street line 2]: cardholder address complement. ex: 'Apto. 123'
     * @param district [string, default sub-issuer district]: cardholder address district / neighbourhood. ex: 'Bela Vista'
     * @param city [string, default sub-issuer city]: cardholder address city. ex: 'Rio de Janeiro'
     * @param stateCode [string, default sub-issuer state code]: cardholder address state. ex: 'GO'
     * @param zipCode [string, default sub-issuer zip code]: cardholder address zip code. ex: '01311-200'
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingCard is created. ex: '5656565656565656'
     * @param holderId [string]: cardholder unique id. ex: '5656565656565656'
     * @param type [string]: card type. ex: 'virtual'
     * @param status [string]: current IssuingCard status. ex: 'canceled' or 'active'
     * @param number [string]: [EXPANDABLE] masked card number. ex: '1234 5678 1234 5678'
     * @param securityCode [string]: [EXPANDABLE] masked card verification value (cvv). Expand to unmask the value. ex: '123'.
     * @param expiration [string]: [EXPANDABLE] masked card expiration datetime. ex: '2020-03-10 10:30:00.000'
     * @param created [string]: creation datetime for the IssuingCard. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingCard. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    holderTaxId, holderName, holderExternalId, id, holderId, type, displayName, 
                    status, rules, binId, streetLine1, streetLine2, district, city, stateCode, 
                    zipCode, tags, created, updated, number, securityCode, expiration
                }) {
        super(id);
        this.holderTaxId = holderTaxId;
        this.holderName = holderName;
        this.holderExternalId = holderExternalId;
        this.holderId = holderId;
        this.type = type;
        this.displayName = displayName;
        this.status = status;
        this.rules = parseObjects(rules, ruleResource, IssuingRule);
        this.binId = binId;
        this.streetLine1 = streetLine1;
        this.streetLine2 = streetLine2;
        this.district = district;
        this.city = city;
        this.stateCode = stateCode;
        this.zipCode = zipCode;
        this.tags = tags;
        this.number = number;
        this.securityCode = securityCode;
        this.expiration = check.datetime(expiration);
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingCard = IssuingCard;
let resource = {'class': exports.IssuingCard, 'name': 'IssuingCard'};

exports.create = async function (cards, {expand, user} = {}) {
    /**
     *
     * Create IssuingCards
     *
     * @description Send a list of IssuingCard objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param cards [list of IssuingCard objects]: list of IssuingCard objects to be created in the API
     *
     * Parameters (optional):
     * @param expand [list of strings, default []]: fields to expand information. ex: ['rules', 'securityCode', 'number', 'expiration']
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingCard objects with updated attributes
     *
     */
    return rest.post(resource, cards, user, {'expand': expand});
};

exports.get = async function (id, {expand, user} = {}) {
    /**
     *
     * Retrieve a specific IssuingCard
     *
     * @description Receive a single IssuingCard object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: fields to expand information. ex: ['rules']
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingCard object with updated attributes
     *
     */
    return rest.getId(resource, id, user, {'expand': expand});
};

exports.query = async function ({ status, types, holderIds, after, before, tags, ids, limit, expand, user } = {}) {
    /**
     *
     * Retrieve IssuingCards
     *
     * @description Receive a generator of IssuingCard objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'active', 'blocked', 'expired' or 'canceled'
     * @param types [list of strings, default null]: card type. ex: ['virtual']
     * @param holderIds [list of strings]: cardholder IDs. ex: ['5656565656565656', '4545454545454545']
     * @param after [datetime.date or string, default null] date filter for objects created only after specified date. ex: datetime.date(2020, 3, 10)
     * @param before [datetime.date or string, default null] date filter for objects created only before specified date. ex: datetime.date(2020, 3, 10)
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param expand [list of strings, default []]: fields to expand information. ex: ['rules', 'securityCode', 'number', 'expiration']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call     \
     *
     * Return:
     * @returns generator of IssuingCard objects with updated attributes
     *
     */
    let query = {
        status: status,
        types: types,
        holderIds: holderIds,
        after: after,
        before: before,
        tags: tags,
        ids: ids,
        limit: limit,
        expand: expand,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, status, types, holderIds, after, before, tags, ids, limit, expand, user } = {}) {
    /**
     *
     * Retrieve paged IssuingCards
     *
     * @description Receive a list of up to 100 IssuingCard objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'paid' or 'registered'
     * @param types [list of strings, default null]: card type. ex: ['virtual']
     * @param holderIds [list of strings, default null]: cardholder IDs. ex: ['5656565656565656', '4545454545454545']
     * @param after [datetime.date or string, default null] date filter for objects created only after specified date. ex: datetime.date(2020, 3, 10)
     * @param before [datetime.date or string, default null] date filter for objects created only before specified date. ex: datetime.date(2020, 3, 10)
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param expand [list of strings, default []]: fields to expand information. ex: ['rules', 'securityCode', 'number', 'expiration']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingCard objects with updated attributes and cursor to retrieve the next page of IssuingCard objects
     *
     */
    let query = {
        cursor: cursor,
        status: status,
        types: types,
        holderIds: holderIds,
        after: after,
        before: before,
        tags: tags,
        ids: ids,
        limit: limit,
        expand: expand,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { status, displayName, rules, tags, user }) {
    /**
     *
     * Update IssuingCard entity
     *
     * @description Update an IssuingCard by passing id.
     *
     * Parameters (required):
     * @param id [string]: IssuingCard id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param status [string]: You may block the IssuingCard by passing 'blocked' or activate by passing 'active' in the status
     * @param displayName [string, default null]: card displayed name
     * @param rules [list of dictionaries, default null]: list of dictionaries with 'amount': int, 'currencyCode': string, 'id': string, 'interval': string, 'name': string pairs.
     * @param tags [list of strings]: list of strings for tagging
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target IssuingCard with updated attributes
     *
     */
    let payload = {
        status: status,
        displayName: displayName,
        rules: rules,
        tags: tags,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel an IssuingCard entity
     *
     * @description Cancel an IssuingCard entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: IssuingCard unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled IssuingCard object
     *
     */
    return rest.deleteId(resource, id, user);
};
