const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource
const Invoice = require('../creditNote/invoice/invoice.js').Invoice;
const parseObjects = require('../utils/parse').parseObjects;
const invoiceResource = require('../creditNote/invoice/invoice.js').resource;

class CreditNotePreview extends Resource {
    /**
     * 
     * CreditNotePreview object
     * 
     * @description A CreditNotePreview is used to preview a CCB contract between the borrower and lender with a specific table type.
     * When you initialize a CreditNotePreview, the entity will not be automatically
     * send in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of preview data.
     * 
     * Parameters (required):
     * @param type [string]: table type that defines the amortization system. Options: "sac", "price", "american", "bullet", "custom"
     * @param nominalAmount [integer]: amount in cents transferred to the credit receiver, before deductions. ex: nominal_amount=11234 (= R$ 112.34)
     * @param scheduled [string]: date of transfer execution. ex: scheduled='2020-03-10'
     * @param taxId [string]: credit receiver's tax ID (CPF or CNPJ). ex: "20.018.183/0001-80"
     *
     * Parameters (conditionally required):
     * @param invoices [list of Invoice objects]: list of Invoice objects to be created and sent to the credit receiver.
     * @param nominalInterest [float]: yearly nominal interest rate of the credit note, in percentage. ex: 12.5
     * @param initialDue [string]: date of the first invoice. ex: initialDue='2020-03-10'
     * @param count [integer]: quantity of invoices for payment. ex: 12
     * @param initialAmount [integer]: value of the first invoice in cents. ex: 1234 (= R$12.34)
     * @param interval [string]: interval between invoices. ex: "year", "month"
     * 
     * Parameters (optional):
     * @param rebateAmount [integer, default 0]: credit analysis fee deducted from lent amount. ex: rebate_amount=11234 (= R$ 112.34)
     * 
     * Attributes (return-only):
     * @param amount [integer]: CreditNote value in cents. ex: 1234 (= R$ 12.34)
     * @param taxAmount [integer]: tax amount included in the CreditNote. ex: 100
     * @param interest [float]: yearly effective interest rate of the credit note, in percentage. ex: 12.5
     */
    constructor({type, nominalAmount, scheduled, taxId, invoices, nominalInterest, 
                initialDue, count, initialAmount, interval, rebateAmount, amount, 
                taxAmount, interest}) {
        super();
        this.type = type;
        this.nominalAmount = nominalAmount;
        this.scheduled = check.datetimeOrDate(scheduled);
        this.taxId = taxId;
        this.invoices = parseObjects(invoices, invoiceResource, Invoice);
        this.nominalInterest = nominalInterest;
        this.initialDue = initialDue;
        this.count = count;
        this.initialAmount = initialAmount;
        this.interval = interval;
        this.rebateAmount = check.datetimeOrDate(rebateAmount);
        this.amount = amount;
        this.taxAmount = taxAmount;
        this.interest = interest;
    }
}

exports.CreditNotePreview = CreditNotePreview;
let resource = {'class': exports.CreditNotePreview, 'name': 'CreditNotePreview'};

exports.create = async function(requests, {user}={}) {
    /**
     * 
     * Create CreditNotePreviews
     * 
     * @description Send a list of CreditNotePreview objects for creation at the Stark Infra API
     *
     * Parameters (required):
     * @param previews [list of CreditNotePreview objects]: list of CreditNotePreview objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @param list of CreditNotePreview objects with updated attributes
     */

    return rest.post(resource, requests, user);
}
