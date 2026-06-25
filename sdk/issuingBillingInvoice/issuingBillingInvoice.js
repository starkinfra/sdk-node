const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IssuingBillingInvoice extends Resource {
    /**
     *
     * IssuingBillingInvoice object
     *
     * @description Displays the IssuingBillingInvoice objects created in your Workspace.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingBillingInvoice is created. ex: '5656565656565656'
     * @param taxId [string]: payer tax ID. ex: '012.345.678-90'
     * @param name [string]: payer name. ex: 'Tony Stark'
     * @param fine [float]: fine amount charged in the invoice. ex: 1234 (= R$ 12.34)
     * @param interest [float]: interest amount charged in the invoice. ex: 1234 (= R$ 12.34)
     * @param amount [integer]: invoice value in cents. ex: 1234 (= R$ 12.34)
     * @param nominalAmount [integer]: nominal amount in cents. ex: 1234 (= R$ 12.34)
     * @param status [string]: current IssuingBillingInvoice status. ex: 'paid'
     * @param brcode [string]: BR Code for the invoice payment. ex: '00020101021226930014br.gov.bcb.pix'
     * @param link [string]: public invoice webpage URL. ex: 'https://starkinfra.com/invoicelink/5656565656565656'
     * @param due [string]: invoice due datetime. ex: '2020-03-10 10:30:00.000'
     * @param start [string]: billing cycle start datetime. ex: '2020-03-10 10:30:00.000'
     * @param end [string]: billing cycle end datetime. ex: '2020-03-10 10:30:00.000'
     * @param created [string]: creation datetime for the IssuingBillingInvoice. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingBillingInvoice. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    id = null, taxId = null, name = null, fine = null, interest = null, amount = null,
                    nominalAmount = null, status = null, brcode = null, link = null, due = null,
                    start = null, end = null, created = null, updated = null
                }) {
        super(id);

        this.taxId = taxId;
        this.name = name;
        this.fine = fine;
        this.interest = interest;
        this.amount = amount;
        this.nominalAmount = nominalAmount;
        this.status = status;
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

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific IssuingBillingInvoice
     *
     * @description Receive a single IssuingBillingInvoice object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingBillingInvoice object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve IssuingBillingInvoices
     *
     * @description Receive a generator of IssuingBillingInvoice objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['paid']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
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
        tags: tags,
        ids: ids,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({cursor, limit, after, before, status, tags, ids, user} = {}) {
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
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['paid']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
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
        ids: ids,
    };
    return rest.getPage(resource, query, user);
};
