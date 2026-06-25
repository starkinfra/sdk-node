const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IssuingBillingTransaction extends Resource {
    /**
     *
     * IssuingBillingTransaction object
     *
     * @description Displays the IssuingBillingTransaction objects created in your Workspace.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingBillingTransaction is created. ex: '5656565656565656'
     * @param amount [integer]: transaction amount in cents. ex: 1234 (= R$ 12.34)
     * @param invoiceId [string]: parent billing invoice id. May be null. ex: '5656565656565656'
     * @param installment [integer]: installment number. ex: 1
     * @param installmentCount [integer]: total installment count. ex: 12
     * @param balance [integer]: remaining balance in cents. ex: 1234 (= R$ 12.34)
     * @param holderName [string]: card holder name. ex: 'Tony Stark'
     * @param source [string]: transaction source. ex: 'issuing-purchase'
     * @param externalId [string]: external transaction id. ex: 'my-external-id-123456'
     * @param description [string]: transaction description. ex: 'Office Supplies'
     * @param cardEnding [string]: last 4 digits of the card number. ex: '1234'
     * @param tax [float]: tax amount in cents. ex: 1234 (= R$ 12.34)
     * @param rate [float]: tax rate as a percentage. ex: 1.5
     * @param merchantAmount [integer]: merchant amount in cents. ex: 1234 (= R$ 12.34)
     * @param merchantCurrencyCode [string]: merchant currency code (ISO 4217). ex: 'USD'
     * @param created [string]: creation datetime for the IssuingBillingTransaction. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    id = null, amount = null, invoiceId = null, installment = null, installmentCount = null,
                    balance = null, holderName = null, source = null, externalId = null, description = null,
                    cardEnding = null, tax = null, rate = null, merchantAmount = null, merchantCurrencyCode = null,
                    created = null
                }) {
        super(id);

        this.amount = amount;
        this.invoiceId = invoiceId;
        this.installment = installment;
        this.installmentCount = installmentCount;
        this.balance = balance;
        this.holderName = holderName;
        this.source = source;
        this.externalId = externalId;
        this.description = description;
        this.cardEnding = cardEnding;
        this.tax = tax;
        this.rate = rate;
        this.merchantAmount = merchantAmount;
        this.merchantCurrencyCode = merchantCurrencyCode;
        this.created = check.datetime(created);
    }
}

exports.IssuingBillingTransaction = IssuingBillingTransaction;
let resource = {'class': exports.IssuingBillingTransaction, 'name': 'IssuingBillingTransaction'};

exports.query = async function ({limit, after, before, invoiceId, tags, user} = {}) {
    /**
     *
     * Retrieve IssuingBillingTransactions
     *
     * @description Receive a generator of IssuingBillingTransaction objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-04-03'
     * @param invoiceId [string, default null]: filter for transactions of a specific billing invoice. ex: '5656565656565656'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of IssuingBillingTransaction objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        invoiceId: invoiceId,
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({cursor, limit, after, before, invoiceId, tags, user} = {}) {
    /**
     *
     * Retrieve paged IssuingBillingTransactions
     *
     * @description Receive a list of up to 100 IssuingBillingTransaction objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-04-03'
     * @param invoiceId [string, default null]: filter for transactions of a specific billing invoice. ex: '5656565656565656'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingBillingTransaction objects with updated attributes and cursor to retrieve the next page of IssuingBillingTransaction objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        invoiceId: invoiceId,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};
