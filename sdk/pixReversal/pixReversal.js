const rest = require('../utils/rest.js');
const api = require('core-node').api;
const check = require('core-node').check;
const parse = require('../utils/parse.js');
const Resource = require('core-node').Resource;


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
     * @param externalId [string]: url safe string that must be unique among all your PixReversals. Duplicated external IDs will cause failures. By default, this parameter will block any PixReversals that repeats amount and receiver information on the same date. ex: 'my-internal-id-123456'
     * @param endToEndId [string]: central bank's unique transaction ID. ex: 'E79457883202101262140HHX553UPqeq'
     * @param reason [string]: reason why the PixReversal is being reversed. Options are 'bankError', 'fraud', 'chashierError', 'customerRequest'
     *
     * Parameters (optional):
     * @param tags [list of strings, default null]: list of strings for reference when searching for PixReversals. ex: ['employees', 'monthly']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixReversal is created. ex: '5656565656565656'
     * @param returnId [string]: central bank's unique reversal transaction ID. ex: 'D20018183202202030109X3OoBHG74wo'.
     * @param fee [integer]: fee charged when PixReversal is paid. ex: 200 (= R$ 2.00)
     * @param status [string]: current PixReversal status. ex: 'registered' or 'paid'
     * @param flow [string]: direction of money flow. ex: 'in' or 'out'
     * @param created [string]: creation datetime for the PixReversal. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the PixReversal. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    amount, externalId, endToEndId, reason, tags=null, id=null, 
                    returnId=null, fee=null, status=null, flow=null, created=null, 
                    updated=null
                }) {
        super(id);

        this.amount = amount;
        this.externalId = externalId;
        this.endToEndId = endToEndId;
        this.reason = reason;
        this.tags = tags;
        this.id = id;
        this.returnId = returnId;
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
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
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
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixReversal object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, returnIds, externalIds, user} = {}) {
    /**
     *
     * Retrieve PixReversals
     *
     * @description Receive a generator of PixReversal objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param returnIds [list of strings, default null]: central bank's unique transaction IDs. ex: ['E79457883202101262140HHX553UPqeq', 'E79457883202101262140HHX553UPxzx']
     * @param externalIds [list of strings, default null]: url safe strings that must be unique among all your PixReversals. Duplicated external IDs will cause failures. By default, this parameter will block any PixReversals that repeats amount and receiver information on the same date. ex: ['my-internal-id-123456', 'my-internal-id-654321']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixReversal objects with updated attributes
     *
     */
    let query = {
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

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, returnIds, externalIds, user} = {}) {
    /**
     *
     * Retrieve paged PixReversals
     *
     * @description Receive a list of up to 100 PixReversal objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your reversals.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param returnIds [list of strings, default null]: central bank's unique transaction IDs. ex: ['E79457883202101262140HHX553UPqeq', 'E79457883202101262140HHX553UPxzx']
     * @param externalIds [list of strings, default null]: url safe strings that must be unique among all your PixReversals. Duplicated external IDs will cause failures. By default, this parameter will block any PixReversals that repeats amount and receiver information on the same date. ex: ['my-internal-id-123456', 'my-internal-id-654321']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixReversal objects with updated attributes and cursor to retrieve the next page of PixReversal objects
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
        returnIds: returnIds,
        externalIds: externalIds,
    };
    return rest.getPage(resource, query, user);
};

exports.parse = async function (content, signature, {user} = {}) {
    /**
     *
     * Create a single verified PixReversal object from a content string
     *
     * @description Create a single PixReversal object from a content string received from a handler listening at
     * the reversal url. If the provided digital signature does not check out with the Stark public key, a
     * stark.error.InvalidSignatureError will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from reversal received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Parsed PixReversal object
     *
     */
    let reversal = await parse.parseAndVerify(resource, content, signature, user);

    reversal.fee = reversal.fee ? reversal.fee : 0;
    reversal.tags = reversal.tags ? reversal.tags : [];
    reversal.externalIds = reversal.externalIds ? reversal.externalIds : "";
    reversal.description = reversal.description ? reversal.description : "";
    
    return reversal
};

exports.response = async function ({
                                        status, reason=null
                                    }) {
    /**
     *
     * Helps you respond to a PixReversal authorization
     *
     * Parameters (required):
     * @param status [string]: response to the authorization. Options: 'approved' or 'denied'
     *
     * Parameters (conditionally required):
     * @param reason [string, default null]: denial reason. Options: 'invalidAccountNumber', 'blockedAccount', 'accountClosed', 'invalidAccountType', 'invalidTransactionType', 'taxIdMismatch', 'invalidTaxId', 'orderRejected', 'reversalTimeExpired', 'settlementFailed'
     *
     * Return:
     * @returns Dumped JSON string that must be returned to us
     *
     */
    let response = {
        'authorization': {
            'status': status,
            'reason': reason,
        }
    };
    api.removeNullKeys(response);
    return JSON.stringify(response);
};
