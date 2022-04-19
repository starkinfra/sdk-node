const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const parse = require('../utils/parse.js');
const Resource = require('../utils/resource.js').Resource


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
     * @param templateId [string]: ID of the contract template which the credit note will be based on. ex: templateId="0123456789101112"
     * @param name [string]: credit receiver's full name. ex: name="Anthony Edward Stark"
     * @param taxId [string]: credit receiver's tax ID (CPF or CNPJ). ex: taxId="20.018.183/0001-80"
     * @param nominalAmount [integer]: amount in cents transferred to the credit receiver, before deductions. ex: nominalAmount=11234 (= R$ 112.34)
     * @param scheduled [datetime.date, datetime.datetime or string, default now]: date of transfer execution. ex: scheduled=datetime(2020, 3, 10)
     * @param invoices [list of Invoice objects]: list of Invoice objects to be created and sent to the credit receiver. ex: invoices=[Invoice(), Invoice()]
     * @param transfer [Transfer object]: Transfer object to be created and sent to the credit receiver. ex: transfer=Transfer()
     * @param signers [list of contacts]: name and e-mail of signers that sign the contract. ex: signers=[{"name": "Tony Stark", "contact": "tony@starkindustries.com", "method": "link"}]
     *
     * Parameters (optional):
     * @param rebateAmount [integer, default None]: credit analysis fee deducted from lent amount. ex: rebateAmount=11234 (= R$ 112.34)
     * @param tags [list of strings, default None]: list of strings for reference when searching for CreditNotes. ex: tags=[\"employees\", \"monthly\"]
     * @param externalId [string]: url safe string that must be unique among all your CreditNotes. ex: externalId="my-internal-id-123456"
     *
     * Attributes (return-only):
     * @param id [string, default None]: unique id returned when the CreditNote is created. ex: "5656565656565656"
     * @param interest [float]: yearly effective interest rate of the credit note, in percentage. ex: 12.5
     * @param created [datetime.datetime, default None]: creation datetime for the CreditNote. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     * @param updated [datetime.datetime, default None]: latest update datetime for the CreditNote. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     */
    constructor({
                    templateId, name, taxId, nominalAmount, scheduled, invoices, transfer, signers, externalId, interest,
                    rebateAmount, tags, created, updated, id
                }) {
        super(id);
        this.templateId = templateId;
        this.name = name;
        this.taxId = taxId;
        this.nominalAmount = nominalAmount;
        this.scheduled = scheduled;
        this.invoices = invoices;
        this.transfer = transfer;
        this.signers = signers;
        this.externalId = externalId;
        this.interest = interest;
        this.rebateAmount = rebateAmount;
        this.tags = tags;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
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
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
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
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns CreditNote object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ fields, limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve CreditNotes
     *
     * @description Receive a generator of CreditNote objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param fields [array of strings, default null]:  parameters to be retrieved from CreditNote objects. ex: ["amount", "id"]
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [array of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [array of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [array of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of CreditNote objects with updated attributes
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
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, fields, limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve paged CreditNotes
     *
     * @description Receive a list of up to 100 CreditNote objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param fields [array of strings, default null]:  parameters to be retrieved from CreditNote objects. ex: ["amount", "id"]
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created or updated only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created or updated only before specified date. ex: '2020-03-10'
     * @param status [array of strings, default null]: filter for status of retrieved objects. ex: 'success' or 'failed'
     * @param tags [array of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [array of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of CreditNote objects with updated attributes and cursor to retrieve the next page of CreditNote objects
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
    };
    return rest.getPage(resource, query, user);
};

exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create single verified CreditNote object from a content string
     *
     * @description Create a single CreditNote object from a content string received from a handler listening at
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
     * @returns Parsed CreditNote object
     *
     */
    return parse.parseAndVerify(resource, content, signature, user);
};
