const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IssuingInvoice extends Resource {
    /**
     *
     * IssuingInvoice object
     *
     * @description The IssuingInvoice objects created in your Workspace load your Issuing balance when paid.
     *
     * Parameters (required):
     * @param amount [integer]: amount in cents to be transferred. ex: 11234 (= R$ 112.34)
     *
     * Parameters (optional):
     * @param taxId [string, default null]: payer tax ID (CPF or CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     * @param name [string, default null]: payer name. ex: 'Iron Bank S.A.'
     * @param tags [list of strings, default []]: list of strings for tagging
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the IssuingInvoice is created. ex: '5656565656565656'
     * @param brcode [string]: BR Code for the Invoice payment. ex: "00020101021226930014br.gov.bcb.pix2571brcode-h.development.starkinfra.com/v2/d7f6546e194d4c64a153e8f79f1c41ac5204000053039865802BR5925Stark Bank S.A. - Institu6009Sao Paulo62070503***63042109"
     * @param due [string]: Invoice due and expiration date in UTC ISO format. ex: "2020-10-28T17:59:26.249976+00:00"
     * @param link [string]: public Invoice webpage URL. ex: "https://starkbank-card-issuer.development.starkbank.com/invoicelink/d7f6546e194d4c64a153e8f79f1c41ac"
     * @param status [string]: current IssuingInvoice status. ex: 'created', 'paid', 'canceled' or 'overdue'
     * @param issuingTransactionId [string]: ledger transaction ids linked to this IssuingInvoice. ex: 'issuing-invoice/5656565656565656'
     * @param created [string]: creation datetime for the IssuingInvoice. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingInvoice. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    amount, taxId, name, tags, id=null, brcode=null, due=null, 
                    link=null, status=null, issuingTransactionId=null, created=null, 
                    updated=null
                }) {
        super(id);
        
        this.amount = amount;
        this.taxId = taxId;
        this.name = name;
        this.tags = tags;
        this.brcode = brcode;
        this.due = due;
        this.link = link;
        this.status = status;
        this.issuingTransactionId = issuingTransactionId;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingInvoice = IssuingInvoice;
let resource = {'class': exports.IssuingInvoice, 'name': 'IssuingInvoice'};

exports.create = async function ({ amount, name=null, taxId=null, tags=null, user = null } = {}) {
    /**
     *
     * Create Invoices
     *
     * @description Send a list of IssuingInvoice objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param invoices [list of IssuingInvoice objects]: list of IssuingInvoice objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingInvoice objects with updated attributes
     *
     */
    let options = {
        amount: amount,
        name: name,
        taxId: taxId,
        tags: tags,
    };
    return rest.postSingle(resource, options, user);
};


exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingInvoice
     *
     * @description Receive a single IssuingInvoice object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingInvoice object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ status, after, before, tags, limit, user } = {}) {
    /**
     *
     * Retrieve IssuingInvoices
     *
     * @description Receive an generator of IssuingInvoice objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'created', 'paid', 'canceled' or 'overdue'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of IssuingInvoice objects with updated attributes
     *
     */
    let query = {
        status: status,
        after: after,
        before: before,
        tags: tags,
        limit: limit,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, status, after, before, tags, limit, user } = {}) {
    /**
     *
     * Retrieve paged IssuingInvoices
     *
     * @description Receive a list of up to 100 IssuingInvoice objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'created', 'paid', 'canceled' or 'overdue'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingInvoice objects with updated attributes and cursor to retrieve the next page of IssuingInvoice objects
     *
     */
    let query = {
        cursor: cursor,
        status: status,
        after: after,
        before: before,
        tags: tags,
        limit: limit,
    };
    return rest.getPage(resource, query, user);
};
