const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IssuingBillingInvoice extends Resource {
    /**
     *
     * IssuingBillingInvoice object
     *
     * @description The IssuingBillingInvoice objects are the invoices charged by Stark Infra to your Workspace
     * for the usage of the Issuing product. They are generated automatically and cannot be created by the user.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingBillingInvoice is created. ex: '5656565656565656'
     * @param name [string]: payer name. ex: 'Iron Bank S.A.'
     * @param taxId [string]: payer tax ID (CPF or CNPJ). ex: '01234567890' or '20.018.183/0001-80'
     * @param fine [float]: fine amount charged when the invoice is paid after the due date. ex: 10.0
     * @param interest [float]: interest amount charged when the invoice is paid after the due date. ex: 1.0
     * @param status [string]: current IssuingBillingInvoice status. ex: 'created', 'paid', 'overdue', 'expired' or 'canceled'
     * @param amount [integer]: IssuingBillingInvoice amount in cents, including fine and interest if paid after the due date. ex: 11234 (= R$ 112.34)
     * @param nominalAmount [integer]: IssuingBillingInvoice nominal amount in cents, without fine or interest. ex: 11234 (= R$ 112.34)
     * @param brcode [string]: BR Code for the IssuingBillingInvoice payment. ex: '00020101021226930014br.gov.bcb.pix2571brcode-h.development.starkinfra.com/v2/d7f6546e194d4c64a153e8f79f1c41ac5204000053039865802BR5925Stark Bank S.A. - Institu6009Sao Paulo62070503***63042109'
     * @param link [string]: public IssuingBillingInvoice webpage URL. ex: 'https://starkbank-card-issuer.development.starkbank.com/invoicelink/d7f6546e194d4c64a153e8f79f1c41ac'
     * @param due [string]: IssuingBillingInvoice due datetime in UTC ISO format. ex: '2020-10-28T17:59:26.249976+00:00'
     * @param start [string]: billing period start datetime in UTC ISO format. ex: '2020-10-01T00:00:00.249976+00:00'
     * @param end [string]: billing period end datetime in UTC ISO format. ex: '2020-10-28T17:59:26.249976+00:00'
     * @param created [string]: creation datetime for the IssuingBillingInvoice. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingBillingInvoice. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    id = null, name = null, taxId = null, fine = null, interest = null,
                    status = null, amount = null, nominalAmount = null, brcode = null,
                    link = null, due = null, start = null, end = null, created = null,
                    updated = null
                }) {
        super(id);

        this.name = name;
        this.taxId = taxId;
        this.fine = fine;
        this.interest = interest;
        this.status = status;
        this.amount = amount;
        this.nominalAmount = nominalAmount;
        this.brcode = brcode;
        this.link = link;
        this.due = check.datetime(due);
        this.start = check.datetime(start);
        this.end = check.datetime(end);
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingBillingInvoice = IssuingBillingInvoice;
let resource = {'class': exports.IssuingBillingInvoice, 'name': 'IssuingBillingInvoice'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingBillingInvoice
     *
     * @description Receive a single IssuingBillingInvoice object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingBillingInvoice object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, id, tags, user } = {}) {
    /**
     *
     * Retrieve IssuingBillingInvoices
     *
     * @description Receive a generator of IssuingBillingInvoice objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'created', 'paid', 'overdue', 'expired' or 'canceled'
     * @param id [string, default null]: filter for the IssuingBillingInvoice id.
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of IssuingBillingInvoice objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        id: id,
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, tags, user } = {}) {
    /**
     *
     * Retrieve paged IssuingBillingInvoices
     *
     * @description Receive a list of up to 100 IssuingBillingInvoice objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'created', 'paid', 'overdue', 'expired' or 'canceled'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingBillingInvoice objects with updated attributes and cursor to retrieve the next page of IssuingBillingInvoice objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};
