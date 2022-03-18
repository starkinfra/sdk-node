const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const parse = require('../utils/parse.js');
const Resource = require('../utils/resource.js').Resource


class PixReversal extends Resource {
    /**
     *
     * PixReversal object
     *
     * @description When you initialize a PixReversal, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param amount [integer]: amount in cents to be transferred. ex: 11234 (= R$ 112.34)
     * @param externalId [string]: url safe string that must be unique among all your PixReversals. Duplicated external IDs will cause failures. By default, this parameter will block any PixReversals that repeats amount and receiver information on the same date. ex: "my-internal-id-123456"
     * @param endToEndId [string]: central bank's unique transaction ID. ex: "E79457883202101262140HHX553UPqeq"
     * @param reason [string]: reason why the PixReversal is being reversed. Options are "bankError", "fraud", "chashierError", "customerRequest"
     *
     * Parameters (optional):
     * @param tags [array of strings, default null]: list of strings for reference when searching for PixReversals. ex: ["employees", "monthly"]
     *
     * Attributes (return-only):
     * @param id [string, default null]: unique id returned when the PixReversal is created. ex: "5656565656565656"
     * @param returnId [string, default null]: central bank's unique reversal transaction ID. ex: "D20018183202202030109X3OoBHG74wo".
     * @param bankCode [string, default null]: code of the bank institution in Brazil. ex: "20018183" or "341"
     * @param fee [integer, default null]: fee charged when PixReversal is paid. ex: 200 (= R$ 2.00)
     * @param status [string, default null]: current PixReversal status. ex: "registered" or "paid"
     * @param flow [string, default null]: direction of money flow. ex: "in" or "out"
     * @param created [string, default null]: creation datetime for the PixReversal. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     * @param updated [string, default null]: latest update datetime for the PixReversal. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     *
     */
    constructor({ amount, externalId, endToEndId, reason, tags, id, returnId, bankCode, fee, status,
                    flow, created, updated}) {
        super(id);
        this.amount = amount;
        this.externalId = externalId;
        this.endToEndId = endToEndId;
        this.reason = reason;
        this.tags = tags;
        this.id = id;
        this.returnId = returnId;
        this.bankCode = bankCode;
        this.fee = fee;
        this.status = status;
        this.flow = flow;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixReversal = PixReversal;
let resource = {'class': exports.PixReversal, 'name': 'PixReversal'};

exports.create = async function (reversals, {user} = {}) {
    /**
     *
     * Create PixReversals
     *
     * @description Send a list of PixReversal objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param reversals [list of PixReversal objects]: list of PixReversal objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixReversal objects with updated attributes
     *
     */
    return rest.post(resource, reversals, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixReversal
     *
     * @description Receive a single PixReversal object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixReversal object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ fields, limit, after, before, status, tags, ids, returnIds, externalIds, user} = {}) {
    /**
     *
     * Retrieve PixReversals
     *
     * @description Receive a generator of PixReversal objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param fields [array of strings, default null]:  parameters to be retrieved from PixReversal objects. ex: ["amount", "id"]
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [array of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [array of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [array of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param returnIds [array of strings, default null]: central bank's unique transaction IDs. ex: ["E79457883202101262140HHX553UPqeq", "E79457883202101262140HHX553UPxzx"]
     * @param externalIds [array of strings, default null]: url safe strings that must be unique among all your PixReversals. Duplicated external IDs will cause failures. By default, this parameter will block any PixReversals that repeats amount and receiver information on the same date. ex: ["my-internal-id-123456", "my-internal-id-654321"]
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixReversal objects with updated attributes
     *
     */
    let query = {
        fields: fields,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        returnId: returnIds,
        externalIds: externalIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, fields, limit, after, before, status, tags, ids, returnIds, externalIds, user} = {}) {
    /**
     *
     * Retrieve paged PixReversals
     *
     * @description Receive a list of up to 100 PixReversal objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your reversals.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param fields [array of strings, default null]:  parameters to be retrieved from PixReversal objects. ex: ["amount", "id"]
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [array of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [array of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [array of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param endToEndIds [array of strings, default null]: central bank's unique transaction IDs. ex: ["E79457883202101262140HHX553UPqeq", "E79457883202101262140HHX553UPxzx"]
     * @param externalIds [array of strings, default null]: url safe strings that must be unique among all your PixReversals. Duplicated external IDs will cause failures. By default, this parameter will block any PixReversals that repeats amount and receiver information on the same date. ex: ["my-internal-id-123456", "my-internal-id-654321"]
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixReversal objects with updated attributes and cursor to retrieve the next page of PixReversal objects
     *
     */
    let query = {
        cursor: cursor,
        fields: fields,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        returnIds: returnIds,
        externalIds: externalIds,
    };
    return rest.getPage(resource, query, user);
};

exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create single verified PixReversal object from a content string
     *
     * @description Create a single PixReversal object from a content string received from a handler listening at
     * the reversal url. If the provided digital signature does not check out with the Stark public key, a
     * stark.error.InvalidSignatureError will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from reversal received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header "Digital-Signature"
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Parsed PixReversal object
     *
     */
    return parse.parseAndVerify(resource, content, signature, user);
};
