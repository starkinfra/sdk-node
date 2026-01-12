const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;
const parseObjects = require('../utils/parse.js').parseObjects;
const { Transaction } = require('./transaction.js');
const transactionResource = require('./transaction.js').subResource;


class PixDispute extends Resource {
    /**
     *
     * PixDispute object
     *
     * @description Pix disputes can be created when a fraud is detected creating a chain of transactions
     * in order to reverse the funds to the origin. When you initialize a PixDispute, the 
     * entity will not be automatically created in the Stark Infra API. The 'create' function
     * sends the objects to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param referenceId [string]: endToEndId of the transaction being reported. ex: "E20018183202201201450u34sDGd19lz"
     * @param method [string]: method used to perform the fraudulent action. Options: "scam", "unauthorized", "coercion", "invasion", "other"
     * @param operatorEmail [string]: contact email of the operator responsible for the dispute.
     * @param operatorPhone [string]: contact phone number of the operator responsible for the dispute.
     *
     * Parameters (conditionally required):
     * @param description [string, default null]: description including any details that can help with the dispute investigation. The description parameter is required when method is "other".
     *
     * Parameters (optional):
     * @param tags [list of strings]: list of strings for tagging. ex: ["travel", "food"]
     * @param minTransactionAmount [integer]: minimum transaction amount to be considered for the graph creation.
     * @param maxTransactionCount [integer]: maximum number of transactions to be considered for the graph creation.
     * @param maxHopInterval [integer]: mean time between transactions to be considered for the graph creation.
     * @param maxHopCount [integer]: depth to be considered for the graph creation.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixDispute is created. ex: "5656565656565656"
     * @param bacenId [string]: Central Bank's unique dispute id. ex: "817fc523-9e9d-40ab-9e53-dacb71454a05"
     * @param flow [string]: indicates the flow of the Pix Dispute. Options: "in" if you received the PixDispute, "out" if you created the PixDispute.
     * @param status [string]: current PixDispute status. Options: "created", "delivered", "analysed", "processing", "closed", "failed", "canceled".
     * @param transactions [list of PixDispute.Transaction]: list of transactions related to the dispute.
     * @param created [string]: creation datetime for the PixDispute. ex: "2020-03-10 10:30:00.000000+00:00"
     * @param updated [string]: latest update datetime for the PixDispute. ex: "2020-03-10 10:30:00.000000+00:00"
     *
     */

    constructor({ 
                    referenceId, method, operatorEmail, operatorPhone, description=null, tags=null, 
                    minTransactionAmount=null, maxTransactionCount=null, maxHopInterval=null, maxHopCount=null, 
                    id=null, bacenId=null, flow=null, status=null, transactions=null, created=null, updated=null
                }) {
        super(id);
        
        this.referenceId = referenceId;
        this.method = method;
        this.operatorEmail = operatorEmail;
        this.operatorPhone = operatorPhone;
        this.description = description;
        this.tags = tags;
        this.minTransactionAmount = minTransactionAmount;
        this.maxTransactionCount = maxTransactionCount;
        this.maxHopInterval = maxHopInterval;
        this.maxHopCount = maxHopCount;
        this.bacenId = bacenId;
        this.flow = flow;
        this.status = status;
        this.transactions = parseObjects(transactions, transactionResource, Transaction);
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixDispute = PixDispute;
let resource = {'class': exports.PixDispute, 'name': 'PixDispute'};

exports.create = async function (disputes, {user} = {}) {
    /**
     *
     * Create PixDisputes
     *
     * @description Send a list of PixDispute objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param disputes [list of PixDispute objects]: list of PixDispute objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixDispute objects with updated attributes
     *
     */
    return rest.post(resource, disputes, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixDispute
     *
     * @description Receive a single PixDispute object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixDispute object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve PixDisputes
     *
     * @description Receive a generator of PixDispute objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixDispute objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({cursor, limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve paged PixDisputes
     *
     * @description Receive a list of up to 100 PixDispute objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixDispute objects with updated attributes and cursor to retrieve the next page of PixDispute objects
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
    };
    return rest.getPage(resource, query, user);
}

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel a PixDispute entity
     *
     * @description Cancel a PixDispute entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixDispute object
     *
     */
    return rest.deleteId(resource, id, user);
};
