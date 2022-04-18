const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const parse = require('../utils/parse.js');
const Resource = require('../utils/resource.js').Resource


class PixRequest extends Resource {
    /**
     *
     * PixRequest object
     *
     * @description When you initialize a PixRequest, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param amount [integer]: amount in cents to be transferred. ex: 11234 (= R$ 112.34)
     * @param externalId [string]: url safe string that must be unique among all your PixRequests. Duplicated external IDs will cause failures. By default, this parameter will block any PixRequests that repeats amount and receiver information on the same date. ex: "my-internal-id-123456"
     * @param senderName [string]: sender's full name. ex: "Anthony Edward Stark"
     * @param senderTaxId [string]: sender's tax ID (CPF or CNPJ) with or without formatting. ex: "01234567890" or "20.018.183/0001-80"
     * @param senderBranchCode [string]: sender's bank account branch code. Use '-' in case there is a verifier digit. ex: "1357-9"
     * @param senderAccountNumber [string]: sender's bank account number. Use '-' before the verifier digit. ex: "876543-2"
     * @param senderAccountType [string]: sender's bank account type. ex: "checking", "savings", "salary" or "payment"
     * @param receiverName [string]: receiver's full name. ex: "Anthony Edward Stark"
     * @param receiverTaxId [string]: receiver's tax ID (CPF or CNPJ) with or without formatting. ex: "01234567890" or "20.018.183/0001-80"
     * @param receiverBankCode [string]: receiver's bank institution code in Brazil. ex: "20018183" or "341"
     * @param receiverAccountNumber [string]: receiver's bank account number. Use '-' before the verifier digit. ex: "876543-2"
     * @param receiverBranchCode [string]: receiver's bank account branch code. Use '-' in case there is a verifier digit. ex: "1357-9"
     * @param receiverAccountType [string]: receiver's bank account type. ex: "checking", "savings", "salary" or "payment"
     * @param endToEndId [string]: central bank's unique transaction ID. ex: "E79457883202101262140HHX553UPqeq"
     *
     * Parameters (optional):
     * @param receiverKeyId [string, default null]: receiver's dict key. ex: "20.018.183/0001-80"
     * @param description [string, default null]: optional description to override default description to be shown in the bank statement. ex: "Payment for service #1234"
     * @param reconciliationId [string, default null]: Reconciliation ID linked to this payment. ex: "b77f5236-7ab9-4487-9f95-66ee6eaf1781"
     * @param initiatorTaxId [string, default null]: Payment initiator's tax id (CPF/CNPJ). ex: "01234567890" or "20.018.183/0001-80"
     * @param cashAmount [integer, default null]: Amount to be withdrawal from the cashier in cents. ex: 1000 (= R$ 10.00)
     * @param cashierBankCode [string, default null]: Cashier's bank code. ex: "00000000"
     * @param cashierType [string, default null]: Cashier's type. ex: [merchant, other, participant]
     * @param tags [array of strings, default null]: list of strings for reference when searching for PixRequests. ex: ["employees", "monthly"]
     * @param method [string, default null]: execution  method for thr creation of the Pix. ex: "manual", "payerQrcode", "dynamicQrcode".
     *
     * Attributes (return-only):
     * @param id [string, default null]: unique id returned when the PixRequest is created. ex: "5656565656565656"
     * @param fee [integer, default null]: fee charged when PixRequest is paid. ex: 200 (= R$ 2.00)
     * @param status [string, default null]: current PixRequest status. ex: "registered" or "paid"
     * @param flow [string, default null]: direction of money flow. ex: "in" or "out"
     * @param senderBankCode [string, default null]: sender's bank institution code in Brazil. If an ISPB (8 digits) is informed. ex: "20018183" or "341"
     * @param created [string, default null]: creation datetime for the PixRequest. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     * @param updated [string, default null]: latest update datetime for the PixRequest. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     *
     */
    constructor({
                    amount, externalId, senderName, senderTaxId, senderBranchCode, senderAccountNumber,
                    senderAccountType, receiverName, receiverTaxId, receiverBankCode, receiverAccountNumber,
                    receiverBranchCode, receiverAccountType, endToEndId, receiverKeyId, description, reconciliationId,
                    initiatorTaxId, cashAmount, cashierBankCode, cashierType, tags, method, id, fee, status, flow,
                    senderBankCode, created, updated,
                }) {
        super(id);
        this.amount = amount;
        this.externalId = externalId;
        this.senderName = senderName;
        this.senderTaxId = senderTaxId;
        this.senderBranchCode = senderBranchCode;
        this.senderAccountNumber = senderAccountNumber;
        this.senderAccountType = senderAccountType;
        this.receiverName = receiverName;
        this.receiverTaxId = receiverTaxId;
        this.receiverBankCode = receiverBankCode;
        this.receiverAccountNumber = receiverAccountNumber;
        this.receiverBranchCode = receiverBranchCode;
        this.receiverAccountType = receiverAccountType;
        this.endToEndId = endToEndId;
        this.receiverKeyId = receiverKeyId;
        this.description = description;
        this.reconciliationId = reconciliationId;
        this.initiatorTaxId = initiatorTaxId;
        this.cashAmount = cashAmount;
        this.cashierBankCode = cashierBankCode;
        this.cashierType = cashierType;
        this.tags = tags;
        this.method = method;
        this.fee = fee;
        this.status = status;
        this.flow = flow;
        this.senderBankCode = senderBankCode;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixRequest = PixRequest;
let resource = {'class': exports.PixRequest, 'name': 'PixRequest'};

exports.create = async function (requests, {user} = {}) {
    /**
     *
     * Create PixRequests
     *
     * @description Send a list of PixRequest objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param requests [list of PixRequest objects]: list of PixRequest objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixRequest objects with updated attributes
     *
     */
    return rest.post(resource, requests, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixRequest
     *
     * @description Receive a single PixRequest object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixRequest object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ fields, limit, after, before, status, tags, ids, endToEndIds, externalIds, user} = {}) {
    /**
     *
     * Retrieve PixRequests
     *
     * @description Receive a generator of PixRequest objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param fields [array of strings, default null]:  parameters to be retrieved from PixRequest objects. ex: ["amount", "id"]
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [array of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [array of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [array of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param endToEndIds [array of strings, default null]: central bank's unique transaction IDs. ex: ["E79457883202101262140HHX553UPqeq", "E79457883202101262140HHX553UPxzx"]
     * @param externalIds [array of strings, default null]: url safe strings that must be unique among all your PixRequests. Duplicated external IDs will cause failures. By default, this parameter will block any PixRequests that repeats amount and receiver information on the same date. ex: ["my-internal-id-123456", "my-internal-id-654321"]
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixRequest objects with updated attributes
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
        endToEndIds: endToEndIds,
        externalIds: externalIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, fields, limit, after, before, status, tags, ids, endToEndIds, externalIds, user} = {}) {
    /**
     *
     * Retrieve paged PixRequests
     *
     * @description Receive a list of up to 100 PixRequest objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param fields [array of strings, default null]:  parameters to be retrieved from PixRequest objects. ex: ["amount", "id"]
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [array of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [array of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [array of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param endToEndIds [array of strings, default null]: central bank's unique transaction IDs. ex: ["E79457883202101262140HHX553UPqeq", "E79457883202101262140HHX553UPxzx"]
     * @param externalIds [array of strings, default null]: url safe strings that must be unique among all your PixRequests. Duplicated external IDs will cause failures. By default, this parameter will block any PixRequests that repeats amount and receiver information on the same date. ex: ["my-internal-id-123456", "my-internal-id-654321"]
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixRequest objects with updated attributes and cursor to retrieve the next page of PixRequest objects
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
        endToEndIds: endToEndIds,
        externalIds: externalIds,
    };
    return rest.getPage(resource, query, user);
};

exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create single verified PixRequest object from a content string
     *
     * @description Create a single PixRequest object from a content string received from a handler listening at
     * the request url. If the provided digital signature does not check out with the Stark public key, a
     * stark.error.InvalidSignatureError will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header "Digital-Signature"
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Parsed PixRequest object
     *
     */
    return parse.parseAndVerify(resource, content, signature, user);
};
