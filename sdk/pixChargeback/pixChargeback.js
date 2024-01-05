const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class PixChargeback extends Resource {
    /**
     *
     * PixChargeback object
     *
     * @description A Pix chargeback can be created when fraud is detected on a transaction or a system malfunction
     * results in an erroneous transaction.
     * It notifies another participant of your request to reverse the payment they have received.
     * When you initialize a PixChargeback, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param amount [integer]: amount in cents to be reversed. ex: 11234 (= R$ 112.34)
     * @param referenceId [string]: endToEndId or returnId of the transaction to be reversed. ex: 'E20018183202201201450u34sDGd19lz'
     * @param reason [string]: reason why the reversal was requested. Options: 'fraud', 'flaw', 'reversalChargeback'
     *
     * Parameters (optional):
     * @param description [string, default null]: description for the PixChargeback.
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixChargeback is created. ex: '5656565656565656'
     * @param analysis [string]: analysis that led to the result.
     * @param senderBankCode [string]: bankCode of the Pix participant that created the PixChargeback. ex: '20018183'
     * @param receiverBankCode [string]: bankCode of the Pix participant that received the PixChargeback. ex: '20018183'
     * @param rejectionReason [string]: reason for the rejection of the Pix chargeback. Options: 'noBalance', 'accountClosed', 'unableToReverse'
     * @param reversalReferenceId [string]: returnId or endToEndId of the reversal transaction. ex: 'D20018183202202030109X3OoBHG74wo'.
     * @param result [string]: result after the analysis of the PixChargeback by the receiving party. Options: 'rejected', 'accepted', 'partiallyAccepted'
     * @param flow [string]: direction of the Pix Chargeback. Options: 'in' for received chargebacks, 'out' for chargebacks you requested
     * @param status [string]: current PixChargeback status. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param created [string]: creation datetime for the PixChargeback. ex: '2022-01-01T12:00:00:00'.
     * @param updated [string]: latest update datetime for the PixChargeback. ex: '2022-01-01T12:00:00:00'.
     *
     */
    constructor({ 
                    amount, referenceId, reason, description = null, tags = null, 
                    id = null,  analysis = null, senderBankCode = null, receiverBankCode = null, 
                    rejectionReason = null, reversalReferenceId = null, result = null, 
                    flow = null, status = null, created = null, updated = null 
                }) {
        super(id);

        this.amount = amount;
        this.referenceId = referenceId;
        this.reason = reason;
        this.description = description;
        this.tags = tags;
        this.analysis = analysis;
        this.senderBankCode = senderBankCode;
        this.receiverBankCode = receiverBankCode;
        this.rejectionReason = rejectionReason;
        this.reversalReferenceId = reversalReferenceId;
        this.result = result;
        this.flow = flow;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixChargeback = PixChargeback;
let resource = {'class': exports.PixChargeback, 'name': 'PixChargeback'};

exports.create = async function (chargebacks, {user} = {}) {
    /**
     *
     * Create PixChargeback objects
     *
     * @description Create PixChargebacks in the Stark Infra API
     *
     * Parameters (required):
     * @param chargebacks [list of PixChargebacks]: list of PixChargeback objects to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixChargeback objects with updated attributes.
     *
     */
    return rest.post(resource, chargebacks, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a PixChargeback object
     *
     * @description Retrieve the PixChargeback object linked to your Workspace in the Stark Infra API using its id.
     *
     * Parameters (required):
     * @param id [string]: PixChargeback object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixChargeback object that corresponds to the given id.
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, ids, flow, tags, user } = {}) {
    /**
     *
     * Retrieve PixChargebacks
     *
     * @description Receive a generator of PixChargeback objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param flow [string, default null]: direction of the Pix Chargeback. Options: 'in' for received chargebacks, 'out' for chargebacks you requested
     * @param tags [list of strings, default null]: filter for tags of retrieved objects. ex: ['travel', 'food']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixChargeback objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: check.date(after),
        before: check.date(before),
        status: status,
        ids: ids,
        flow: flow,
        tags: tags
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, ids, flow, tags, user } = {}) {
    /**
     *
     * Retrieve paged PixChargebacks
     *
     * @description Receive a list of up to 100 PixChargeback objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param flow [string, default null]: direction of the Pix Chargeback. Options: 'in' for received chargebacks, 'out' for chargebacks you requested
     * @param tags [list of strings, default null]: filter for tags of retrieved objects. ex: ['travel', 'food']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixChargeback objects with updated attributes and cursor to retrieve the next page of PixChargeback objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: check.date(after),
        before: check.date(before),
        status: status,
        ids: ids,
        flow: flow,
        tags: tags
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function ( id, result, { rejectionReason, reversalReferenceId, analysis, user } = {}) {
    /**
     *
     * Update PixChargeback entity
     *
     * @description Respond to a received PixChargeback.
     *
     * Parameters (required):
     * @param id [string]: PixChargeback id. ex: '5656565656565656'
     * @param result [string]: result after the analysis of the PixChargeback. Options: 'rejected', 'accepted', 'partiallyAccepted'.
     *
     * Parameters (conditionally required):
     * @param rejectionReason [string, default null]: if the PixChargeback is rejected a reason is required. Options: 'noBalance', 'accountClosed', 'unableToReverse',
     * @param reversalReferenceId [string, default null]: returnId of the reversal transaction. ex: 'D20018183202201201450u34sDGd19lz'
     *
     * Parameters (optional):
     * @param analysis [string, default null]: description of the analysis that led to the result.
     *
     * Return:
     * @returns PixChargeback with updated attributes.
     *
     */
    let payload = {
        'result': result,
        'rejectionReason': rejectionReason,
        'reversalReferenceId': reversalReferenceId,
        'analysis': analysis
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, { user } = {}) {
    /**
     *
     * Cancel a PixChargeback entity
     *
     * @description Cancel a PixChargeback entity previously created in the Stark Infra API.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixChargeback object
     *
     */
    return rest.deleteId(resource, id, user);
};
