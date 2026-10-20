const check = require('starkcore').check;
const SubResource = require('starkcore').SubResource;
const parseObjects = require('../utils/parse').parseObjects;
const Invoice = require('../creditNote/invoice/invoice.js').Invoice;
const invoiceResource = require('../creditNote/invoice/invoice.js').resource;

class CreditNotePreview extends SubResource {
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
     * @param scheduled [string]: date of transfer execution. ex: scheduled='2020-03-10'
     * @param taxId [string]: credit receiver's tax ID (CPF or CNPJ). ex: "20.018.183/0001-80"
     *
     * Parameters (conditionally required):
     * Each `type` value requires its own subset of these fields: "sac", "price", "american" and "bullet" require nominalInterest and initialDue; "sac" and "price" require exactly one of count or initialAmount (count is also required for "american") plus interval; only "custom" requires invoices, leaving the others unused. For every type, including "custom", exactly one of nominalAmount or amount must also be provided.
     * @param invoices [list of Invoice objects]: list of Invoice objects to be created and sent to the credit receiver. ex: [new Invoice(), new Invoice()]
     * @param nominalAmount [integer]: amount in cents transferred to the credit receiver, before deductions, for every type including "custom". Provide exactly one of nominalAmount or amount; the other value, along with taxAmount and the interest rates, is computed from the invoice schedule. ex: 11234 (= R$ 112.34)
     * @param amount [integer]: net amount in cents to be disbursed to the credit receiver, for every type including "custom". Provide exactly one of nominalAmount or amount; the other value, along with taxAmount and the interest rates, is computed from the invoice schedule.
     * @param nominalInterest [float]: yearly nominal interest rate of the credit note, in percentage. ex: 12.5
     * @param initialDue [string]: date of the first invoice. ex: initialDue='2020-03-10'
     * @param count [integer]: quantity of invoices for payment. ex: 12
     * @param initialAmount [integer]: value of the first invoice in cents. ex: 1234 (= R$12.34)
     * @param interval [string]: interval between invoices. ex: "year", "month"
     *
     * Parameters (optional):
     * @param rebateAmount [integer, default null]: credit analysis fee deducted from lent amount. ex: rebateAmount=11234 (= R$ 112.34)
     *
     * Attributes (return-only):
     * @param interest [float]: yearly effective interest rate of the credit note, in percentage. ex: 12.5
     * @param taxAmount [integer]: tax amount included in the CreditNote. ex: 100
     */
    constructor({ 
                    type, nominalAmount, scheduled, taxId, invoices=null, nominalInterest=null,  
                    initialDue=null, count=null, initialAmount=null, interval=null, 
                    rebateAmount=null, amount=null, taxAmount=null, interest=null
                }) {
        super();

        this.type = type;
        this.nominalAmount = nominalAmount;
        this.scheduled = check.dateTimeOrDate(scheduled);
        this.taxId = taxId;
        this.invoices = parseObjects(invoices, invoiceResource, Invoice);
        this.nominalInterest = nominalInterest;
        this.initialDue = check.datetime(initialDue);
        this.count = count;
        this.initialAmount = initialAmount;
        this.interval = interval;
        this.rebateAmount = rebateAmount;
        this.amount = amount;
        this.taxAmount = taxAmount;
        this.interest = interest;
    }
}

exports.CreditNotePreview = CreditNotePreview;
exports.subResource = {'class': exports.CreditNotePreview, 'name': 'CreditNotePreview'};
