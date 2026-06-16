const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class PixInternalTransactionReport extends Resource {
    /**
     *
     * PixInternalTransactionReport object
     *
     * @description Transactions that happen internally, outside of the SPI, must be reported to the
     * Central Bank so they are reflected in the participant's statements. A PixInternalTransactionReport
     * is the report you create for each such transaction.
     * When you initialize a PixInternalTransactionReport, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param amount [integer]: amount of the reported transaction in cents. ex: 1234 (= R$ 12.34)
     * @param created [string]: datetime when the reported transaction occurred. ex: '2020-03-10 10:30:00.000'
     * @param endToEndId [string]: central bank's unique transaction id. ex: 'E20018183202201201213u34sav898j'
     * @param method [string]: method used to process the reported transaction. ex: 'manual', 'dict', 'staticQrcode', 'dynamicQrcode'
     * @param referenceType [string]: type of the reported transaction. Options: 'request', 'reversal'
     * @param senderAccountNumber [string]: sender's bank account number. ex: '76543'
     * @param senderBranchCode [string]: sender's bank account branch code. ex: '1234'
     * @param senderAccountType [string]: sender's bank account type. Options: 'checking', 'savings', 'salary' or 'payment'
     * @param senderBankCode [string]: sender's participant code (ISPB). ex: '20018183'
     * @param senderTaxId [string]: sender's tax ID (CPF/CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     * @param receiverAccountNumber [string]: receiver's bank account number. ex: '76543'
     * @param receiverBranchCode [string]: receiver's bank account branch code. ex: '1234'
     * @param receiverAccountType [string]: receiver's bank account type. Options: 'checking', 'savings', 'salary' or 'payment'
     * @param receiverBankCode [string]: receiver's participant code (ISPB). ex: '20018183'
     * @param receiverTaxId [string]: receiver's tax ID (CPF/CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     *
     * Parameters (optional):
     * @param receiverKeyId [string, default null]: receiver's Pix Key used in the reported transaction. ex: '+5511989898989'
     * @param returnId [string, default null]: central bank's unique reversal transaction id. Required when referenceType is 'reversal'. ex: 'D20018183202201201213u34sav898j'
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixInternalTransactionReport is created. ex: '5656565656565656'
     * @param status [string]: current PixInternalTransactionReport status. ex: 'created', 'processing', 'success', 'failed'
     * @param updated [string]: latest update datetime for the PixInternalTransactionReport. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    amount, created, endToEndId, method, referenceType, senderAccountNumber,
                    senderBranchCode, senderAccountType, senderBankCode, senderTaxId, receiverAccountNumber,
                    receiverBranchCode, receiverAccountType, receiverBankCode, receiverTaxId, receiverKeyId = null,
                    returnId = null, id = null, status = null, updated = null
                }) {
        super(id);

        this.amount = amount;
        this.created = check.datetime(created);
        this.endToEndId = endToEndId;
        this.method = method;
        this.referenceType = referenceType;
        this.senderAccountNumber = senderAccountNumber;
        this.senderBranchCode = senderBranchCode;
        this.senderAccountType = senderAccountType;
        this.senderBankCode = senderBankCode;
        this.senderTaxId = senderTaxId;
        this.receiverAccountNumber = receiverAccountNumber;
        this.receiverBranchCode = receiverBranchCode;
        this.receiverAccountType = receiverAccountType;
        this.receiverBankCode = receiverBankCode;
        this.receiverTaxId = receiverTaxId;
        this.receiverKeyId = receiverKeyId;
        this.returnId = returnId;
        this.status = status;
        this.updated = check.datetime(updated);
    }
}

exports.PixInternalTransactionReport = PixInternalTransactionReport;
let resource = {'class': exports.PixInternalTransactionReport, 'name': 'PixInternalTransactionReport'};
exports.resource = resource;

exports.create = async function (reports, {user} = {}) {
    /**
     *
     * Create PixInternalTransactionReports
     *
     * @description Send a list of PixInternalTransactionReport objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param reports [list of PixInternalTransactionReport objects]: list of PixInternalTransactionReport objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixInternalTransactionReport objects with updated attributes
     *
     */
    return rest.post(resource, reports, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixInternalTransactionReport
     *
     * @description Receive a single PixInternalTransactionReport object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixInternalTransactionReport object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, status, ids, user} = {}) {
    /**
     *
     * Retrieve PixInternalTransactionReports
     *
     * @description Receive a generator of PixInternalTransactionReport objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: 'created', 'processing', 'success', 'failed'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixInternalTransactionReport objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({cursor, limit, after, before, status, ids, user} = {}) {
    /**
     *
     * Retrieve paged PixInternalTransactionReports
     *
     * @description Receive a list of up to 100 PixInternalTransactionReport objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: 'created', 'processing', 'success', 'failed'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixInternalTransactionReport objects with updated attributes and cursor to retrieve the next page of PixInternalTransactionReport objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
    };
    return rest.getPage(resource, query, user);
};
