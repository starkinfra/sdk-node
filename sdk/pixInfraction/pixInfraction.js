const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class PixInfraction extends Resource {
    /**
     *
     * PixInfraction object
     *
     * @description Infraction reports are used to report transactions that are suspected of
     * fraud, to request a refund or to reverse a refund.
     * When you initialize a PixInfraction, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param referenceId [string]: endToEndId or returnId of the transaction being reported. ex: 'E20018183202201201450u34sDGd19lz'
     * @param type [string]: type of infraction report. Options: 'reversal', 'reversalChargeback'
     * @param method [string]:  method of Pix Infraction. Options: "scam", "unauthorized", "coercion", "invasion", "other", "unknown"
     * 
     * Parameters (optional):
     * @param description [string, default null]: description for any details that can help with the infraction investigation.
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     * @param fraudType [string, default null]: type of Pix Fraud. Options: "identity", "mule", "scam", "unknown", "other"
     * @param operatorEmail [string]: contact email of the operator responsible for the PixInfraction.
     * @param operatorPhone [string]: contact phone number of the operator responsible for the PixInfraction.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixInfraction is created. ex: '5656565656565656'
     * @param creditedBankCode [string]: bankCode of the credited Pix participant in the reported transaction. ex: '20018183'
     * @param debitedBankCode [string]: bankCode of the debited Pix participant in the reported transaction. ex: '20018183'
     * @param flow [string]: direction of the PixInfraction flow. Options: 'out' if you created the PixInfraction, 'in' if you received the PixInfraction.
     * @param analysis [string]: analysis that led to the result.
     * @param reportedBy [string]: agent that reported the PixInfraction. Options: 'debited', 'credited'.
     * @param result [string]: result after the analysis of the PixInfraction by the receiving party. Options: 'agreed', 'disagreed'
     * @param status [string]: current PixInfraction status. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param created [string]: creation datetime for the PixInfraction. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the PixInfraction. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    referenceId, type, method, description = null, tags = null, fraudType = null,
                    id = null, creditedBankCode = null, debitedBankCode = null, flow = null, 
                    analysis = null, reportedBy = null, result = null, status = null,  
                    created = null, updated = null, operatorEmail = null, operatorPhone = null
                }) {
        super(id);

        this.referenceId = referenceId;
        this.type = type;
        this.method = method;
        this.description = description;
        this.tags = tags;
        this.fraudType = fraudType;
        this.operatorEmail = operatorEmail;
        this.operatorPhone = operatorPhone;
        this.creditedBankCode = creditedBankCode;
        this.debitedBankCode = debitedBankCode;
        this.flow = flow;
        this.analysis = analysis;
        this.reportedBy = reportedBy;
        this.result = result;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixInfraction = PixInfraction;
let resource = {'class': exports.PixInfraction, 'name': 'PixInfraction'};

exports.create = async function (infractions, {user} = {}) {
    /**
     *
     * Create PixInfraction objects
     *
     * @description Create PixInfractions in the Stark Infra API
     *
     * Parameters (required):
     * @param infractions [list of PixInfractions]: list of PixInfraction objects to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns List of PixInfraction objects with updated attributes.
     *
     */
    return rest.post(resource, infractions, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a PixInfraction object
     *
     * @description Retrieve the PixInfraction object linked to your Workspace in the Stark Infra API using its id.
     *
     * Parameters (required):
     * @param id [string]: PixInfraction object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixInfraction object that corresponds to the given id.
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, ids, type, flow, tags, user } = {}) {
    /**
     *
     * Retrieve PixInfractions
     *
     * @description Receive a generator of PixInfraction objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param type [list of strings, default null]: filter for the type of retrieved PixInfractions. Options: 'fraud', 'reversal', 'reversalChargeback'
     * @param flow [string, default null]: direction of the PixInfraction flow. Options: 'out' if you created the PixInfraction, 'in' if you received the PixInfraction.
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['travel', 'food']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixInfraction objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
        type: type,
        flow: flow, 
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, ids, type, flow, tags, user } = {}) {
    /**
     *
     * Retrieve paged PixInfractions
     *
     * @description Receive a list of up to 100 PixInfraction objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param type [list of strings, default null]: filter for the type of retrieved PixInfractions. Options: 'fraud', 'reversal', 'reversalChargeback'
     * @param flow [string, default null]: direction of the PixInfraction flow. Options: 'out' if you created the PixInfraction, 'in' if you received the PixInfraction.
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['travel', 'food']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixInfraction objects with updated attributes and cursor to retrieve the next page of PixInfraction objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
        type: type,
        flow: flow,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function ( id, result, { fraudType, analysis, user } = {}) {
    /**
     *
     * Update PixInfraction entity
     *
     * @description Update the PixInfraction information by its id.
     *
     * Parameters (required):
     * @param id [string]: PixInfraction id. ex: '5656565656565656'
     * @param result [string]: result after the analysis of the PixInfraction. Options: 'agreed', 'disagreed'
     * 
     * Parameters (conditionally required):
     * @param fraudType [string, default null]: type of Pix Fraud. Options: "identity", "mule", "scam", "unknown", "other"
     *
     * Parameters (optional):
     * @param analysis [string, default null]: analysis that led to the result.
     *
     * Return:
     * @returns list of PixInfraction objects with updated attributes and cursor to retrieve the next page of PixInfraction objects
     *
     */
    let payload = {
        'result': result,
        'fraudType': fraudType,
        'analysis': analysis,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel a PixInfraction entity
     *
     * @description Cancel a PixInfraction entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixInfraction object
     *
     */
    return rest.deleteId(resource, id, user);
};
