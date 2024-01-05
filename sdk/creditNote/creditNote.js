const {Invoice} = require('./invoice/invoice.js');
const invoiceResource = require('./invoice/invoice.js').resource;
const {CreditSigner} = require('../creditSigner/creditSigner.js');
const creditSignerResource = require('../creditSigner/creditSigner.js').resource;
const {Transfer} = require('./transfer.js');
const transferResource = require('./transfer.js').resource;
const rest = require('../utils/rest.js');
const {parseObjects} = require('../utils/parse.js');
const Resource = require('starkcore').Resource;
const check = require('starkcore').check;


class CreditNote extends Resource {
    /**
     *
     * CreditNote object
     *
     * @description When you initialize a CreditNote, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param templateId [string]: ID of the contract template on which the credit note will be based. ex: '0123456789101112'
     * @param name [string]: credit receiver's full name. ex: 'Anthony Edward Stark'
     * @param taxId [string]: credit receiver's tax ID (CPF or CNPJ). ex: '20.018.183/0001-80'
     * @param scheduled [string]: date for the payment execution. ex: '2020-03-10'
     * @param invoices [list of CreditNote.Invoice objects or dictionaries]: list of Invoice objects to be created and sent to the credit receiver.
     * @param payment [CreditNote.Transfer object]: payment entity to be created and sent to the credit receiver. ex: creditNote.Transfer()
     * @param signers [list of CreditSigner objects]: Object containing the signer's name, contact and delivery method for the signature request. ex: [CreditSigner(), CreditSigner()]
     * @param externalId [string]: url safe string that must be unique among all your CreditNotes. ex: 'my-internal-id-123456'
     * @param streetLine1 [string]: credit receiver main address. ex: "Av. Paulista, 200"
     * @param streetLine2 [string]: credit receiver address complement. ex: "Apto. 123"
     * @param district [string]: credit receiver address district / neighbourhood. ex: "Bela Vista"
     * @param city [string]: credit receiver address city. ex: "Rio de Janeiro"
     * @param stateCode [string]: credit receiver address state. ex: "GO"
     * @param zipCode [string]: credit receiver address zip code. ex: "01311-200"
     *
     * Parameters (conditionally required):
     * @param nominalAmount [integer]: CreditNote value in cents. The nominalAmount parameter is required when amount is not sent. ex: 1234 (= R$ 12.34)
     * @param amount [integer]: amount in cents transferred to the credit receiver, before deductions. The amount parameter is required when nominalAmount is not sent. ex: 1234 (= R$ 12.34)
     * @param paymentType [string]: payment type, inferred from the payment parameter if it is not a dictionary. ex: 'transfer'
     *
     * Parameters (optional):
     * @param rebateAmount [integer, default null]: credit analysis fee deducted from lent amount. ex: 11234 (= R$ 112.34)
     * @param tags [list of strings, default null]: list of strings for reference when searching for CreditNotes. ex: ['employees', 'monthly']
     * @param expiration [integer, default 604800 (7 days)]: time interval in seconds between due date and expiration date. ex 123456789
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the CreditNote is created. ex: '5656565656565656'
     * @param documentId [string]: ID of the signed document to execute this CreditNote. ex: '4545454545454545'
     * @param status [string]: current status of the CreditNote. Options: 'canceled', 'created', 'expired', 'failed', 'processing', 'signed', 'success'
     * @param transactionIds [list of strings]: ledger transaction ids linked to this CreditNote. ex: ['19827356981273']
     * @param workspaceId [string]: ID of the Workspace that generated this CreditNote. ex: '4545454545454545'
     * @param taxAmount [integer]: tax amount included in the CreditNote. ex: 100
     * @param nominalInterest [float]: yearly nominal interest rate of the CreditNote, in percentage. ex: 11.5
     * @param interest [float]: yearly effective interest rate of the credit note, in percentage. ex: 12.5
     * @param created [string]: creation datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     */
    constructor({
                    templateId, name, taxId, scheduled, invoices, payment, signers, 
                    externalId, streetLine1, streetLine2, district, city, stateCode, 
                    zipCode, paymentType=null, nominalAmount = null, amount=null, 
                    rebateAmount=null, tags=null, expiration=null, id=null, documentId=null, 
                    status=null, transactionIds=null, workspaceId=null, taxAmount=null, 
                    nominalInterest=null, interest=null, created=null, updated=null
                }) {
        super(id);
        
        this.templateId = templateId;
        this.name = name;
        this.taxId = taxId;
        this.scheduled = scheduled;
        this.invoices = parseObjects(invoices, invoiceResource, Invoice);
        this.signers = parseObjects(signers, creditSignerResource, CreditSigner);
        this.externalId = externalId;
        this.streetLine1 = streetLine1;
        this.streetLine2 = streetLine2;
        this.district = district;
        this.city = city;
        this.stateCode = stateCode;
        this.zipCode = zipCode;
        this.nominalAmount = nominalAmount;
        this.amount = amount;
        this.rebateAmount = rebateAmount;
        this.tags = tags;
        this.expiration = expiration;
        this.documentId = documentId;
        this.status = status;
        this.transactionIds = transactionIds;
        this.workspaceId = workspaceId;
        this.taxAmount = taxAmount;
        this.nominalInterest = nominalInterest;
        this.interest = interest;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);

        let parsePaymentObject = parsePayment(payment, paymentType);
        this.payment = parsePaymentObject['payment'];
        this.paymentType = parsePaymentObject['paymentType'];
    }
}

parsePayment = function (payment, paymentType) {
    if (payment.constructor === Object) {
        if (paymentType){
            const paymentResource = {
                'transfer': transferResource
            }[paymentType];
            return { 'payment': Object.assign(new paymentResource['class'](payment), payment), 'paymentType': paymentType };
        }
        throw 'if payment is a dictionary, paymentType must be' +
            ' transfer';
    }

    if (payment instanceof Transfer)
        return { 'payment': payment, 'paymentType': 'transfer' };

    throw new Error('payment must be either ' +
        'a dictionary' +
        ', a starkinfra.creditNote.Transfer' +
        ', but not a ' + typeof (payment)
    );
}

exports.CreditNote = CreditNote;
let resource = {'class': exports.CreditNote, 'name': 'CreditNote'};

exports.create = async function (requests, {user} = {}) {
    /**
     *
     * Create CreditNotes
     *
     * @description Send a list of CreditNote objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param requests [list of CreditNote objects]: list of CreditNote objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of CreditNote objects with updated attributes
     *
     */
    return rest.post(resource, requests, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific CreditNote
     *
     * @description Receive a single CreditNote object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns CreditNote object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve CreditNotes
     *
     * @description Receive a generator of CreditNote objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'canceled', 'created', 'expired', 'failed', 'processing', 'signed', 'success'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of CreditNote objects with updated attributes
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

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve paged CreditNotes
     *
     * @description Receive a list of up to 100 CreditNote objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'canceled', 'created', 'expired', 'failed', 'processing', 'signed', 'success'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of CreditNote objects with updated attributes and cursor to retrieve the next page of CreditNote objects
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

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel a CreditNote entity
     *
     * @description Cancel a CreditNote entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: CreditNote unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled CreditNote object
     *
     */
    return rest.deleteId(resource, id, user);
};
