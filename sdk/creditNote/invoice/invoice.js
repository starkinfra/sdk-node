const check = require('../../utils/check.js');
const {parseOptionalObjects} = require('../../utils/parse');
const {Description} = require('./description');
const descriptionResource = require('./description.js').subResource;
const {Discount} = require('./discount');
const discountResource = require('./discount.js').subResource;
const Resource = require('../../utils/resource.js').Resource


class Invoice extends Resource {
    /**
     *
     * CreditNote Invoice object
     *
     * @description Invoice issued after the contract is signed, to be paid by the credit receiver.
     *
     * Parameters (required):
     * @param amount [integer]: amount in cents to be transferred. ex: 1234 (= R$ 12.34)
     *
     * Parameters (optional):
     * @param due [string, default now + 2 days]: Invoice due date in UTC ISO format. ex: '2020-10-28T17:59:26.249976+00:00' for immediate invoices and '2020-10-28' for scheduled invoices
     * @param expiration [integer, default 5097600 (59 days)]: time interval in seconds between due date and expiration date. ex 123456789
     * @param fine [float, default 2.0]: Invoice fine for overdue payment in %. ex: 2.5
     * @param interest [float, default 1.0]: Invoice monthly interest for overdue payment in %. ex: 5.2
     * @param tags [list of strings, default null]: list of strings for tagging
     * @param descriptions [list of invoice.Description objects or dictionaries, default null]: list of invoice.Description objects
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when Invoice is created. ex: '5656565656565656'
     * @param name [string]: payer name. ex: 'Iron Bank S.A.'
     * @param taxId [string]: payer tax ID (CPF or CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     * @param pdf [string]: public Invoice PDF URL. ex: 'https://invoice.starkbank.com/pdf/d454fa4e524441c1b0c1a729457ed9d8'
     * @param link [string]: public Invoice webpage URL. ex: 'https://my-workspace.sandbox.starkbank.com/invoicelink/d454fa4e524441c1b0c1a729457ed9d8'
     * @param nominalAmount [integer]: Invoice emission value in cents (will change if invoice is updated, but not if it's paid). ex: 400000
     * @param fineAmount [integer]: Invoice fine value calculated over nominal_amount. ex: 20000
     * @param interestAmount [integer]: Invoice interest value calculated over nominal_amount. ex: 10000
     * @param discountAmount [integer]: Invoice discount value calculated over nominal_amount. ex: 3000
     * @param discounts [list of invoice.Discount objects]: list of invoice.Discount objects
     * @param brcode [string]: BR Code for the Invoice payment. ex: '00020101021226800014br.gov.bcb.pix2558invoice.starkbank.com/f5333103-3279-4db2-8389-5efe335ba93d5204000053039865802BR5913Arya Stark6009Sao Paulo6220051656565656565656566304A9A0'
     * @param status [string]: current Invoice status. ex: 'registered' or 'paid'
     * @param fee [integer]: fee charged by this Invoice. ex: 200 (= R$ 2.00)
     * @param transactionIds [list of strings]: ledger transaction ids linked to this Invoice (if there are more than one, all but the first are reversals or failed reversal chargebacks). ex: ['19827356981273']
     * @param created [string]: creation datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    amount, due = null, expiration = null, fine = null, interest = null, tags = null,
                    descriptions = null, id = null, name = null, taxId = null, pdf = null, link = null,
                    nominalAmount = null, fineAmount = null, interestAmount = null, discountAmount = null,
                    discounts = null, brcode = null, status = null, fee = null, transactionIds = null,
                    created = null, updated = null
                }) {
        super(id);

        this.amount = amount;
        this.due = check.datetimeOrDate(due);
        this.expiration = expiration;
        this.fine = fine;
        this.interest = interest;
        this.tags = tags;
        this.descriptions = parseOptionalObjects(descriptions, descriptionResource, Description);
        this.name = name;
        this.taxId = taxId;
        this.pdf = pdf;
        this.link = link;
        this.nominalAmount = nominalAmount;
        this.fineAmount = fineAmount;
        this.interestAmount = interestAmount;
        this.discountAmount = discountAmount;
        this.discounts = parseOptionalObjects(discounts, discountResource, Discount);
        this.brcode = brcode;
        this.status = status;
        this.fee = fee;
        this.transactionIds = transactionIds;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.Invoice = Invoice;
exports.resource = {'class': exports.Invoice, 'name': 'Invoice'};
