const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class BusinessIdentity extends Resource {
    /**
     *
     * BusinessIdentity object
     *
     * @description A BusinessIdentity represents a company to be validated through its tax ID (CNPJ). It can have up to two
     * business attachments attached to it, which are used to validate the company's identity. Once a business identity is
     * created, business attachments must be attached to it using the create method of the business attachment resource.
     * When all the required business attachments are attached to a business identity it can be sent to validation by
     * patching its status to processing.
     *
     * When you initialize a BusinessIdentity, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param taxId [string]: company's tax ID (CNPJ). ex: '20.018.183/0001-80'
     *
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['onboarding-123']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when BusinessIdentity is created. ex: '5656565656565656'
     * @param name [string]: company's corporate name retrieved from the tax ID bureau. ex: 'Stark Bank S.A.'
     * @param taxIdStatus [string]: status of the tax ID (CNPJ) at the bureau. ex: 'active', 'blocked', 'pending'
     * @param insightTaxId [string]: tax ID (CNPJ) extracted from the document by the insight. ex: '20.018.183/0001-80'
     * @param insightDocumentType [string]: type of document detected by the insight. ex: 'incorporation'
     * @param numPages [integer]: number of pages of the document. ex: 12
     * @param representatives [string]: JSON string with the company's representatives (legal structure). ex: '[{"name": "Edward Stark", "qualification": "Director"}]'
     * @param attachments [list of strings]: list of attachment references linked to this identity in the format 'attachment/<attachmentId>'. ex: ['attachment/5104320788332544']
     * @param rules [string]: JSON string with the complemented signature rules extracted from the documents.
     * @param status [string]: current BusinessIdentity status. Options: 'created', 'pending', 'canceled', 'processing', 'success', 'failed'
     * @param created [string]: creation datetime for the BusinessIdentity. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the BusinessIdentity. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    taxId, tags = null, id = null, name = null, taxIdStatus = null,
                    insightTaxId = null, insightDocumentType = null, numPages = null,
                    representatives = null, attachments = null, rules = null,
                    status = null, created = null, updated = null
                }) {
        super(id);
        this.taxId = taxId;
        this.tags = tags;
        this.name = name;
        this.taxIdStatus = taxIdStatus;
        this.insightTaxId = insightTaxId;
        this.insightDocumentType = insightDocumentType;
        this.numPages = numPages;
        this.representatives = representatives;
        this.attachments = attachments;
        this.rules = rules;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.BusinessIdentity = BusinessIdentity;
let resource = {'class': exports.BusinessIdentity, 'name': 'BusinessIdentity'};

exports.create = async function (identities, { user } = {}) {
    /**
     *
     * Create BusinessIdentities
     *
     * @description Send a list of BusinessIdentity objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param identities [list of BusinessIdentity objects]: list of BusinessIdentity objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessIdentity objects with updated attributes
     *
     */
    return rest.post(resource, identities, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific BusinessIdentity
     *
     * @description Receive a single BusinessIdentity object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns BusinessIdentity object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, taxIds, user } = {}) {
    /**
     *
     * Retrieve BusinessIdentities
     *
     * @description Receive a generator of BusinessIdentity objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ['created', 'pending', 'canceled', 'processing', 'success', 'failed']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param taxIds [list of strings, default null]: list of tax IDs (CNPJ) to filter retrieved objects. ex: ['20.018.183/0001-80']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of BusinessIdentity objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        taxIds: taxIds
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, taxIds, user } = {}) {
    /**
     *
     * Retrieve paged BusinessIdentities
     *
     * @description Receive a list of up to 100 BusinessIdentity objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ['created', 'pending', 'canceled', 'processing', 'success', 'failed']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param taxIds [list of strings, default null]: list of tax IDs (CNPJ) to filter retrieved objects. ex: ['20.018.183/0001-80']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of BusinessIdentity objects with updated attributes and cursor to retrieve the next page of BusinessIdentity objects
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
        taxIds: taxIds
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { status, tags, user } = {}) {
    /**
     *
     * Update BusinessIdentity entity
     *
     * @description Update a BusinessIdentity by passing id.
     *
     * Parameters (required):
     * @param id [string]: BusinessIdentity id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param status [string]: You may send BusinessAttachments to validation by passing 'processing' in the status
     * @param tags [list of strings, default null]: list of strings for tagging
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target BusinessIdentity with updated attributes
     *
     */
    let payload = {
        status: status,
        tags: tags
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, { user } = {}) {
    /**
     *
     * Cancel a BusinessIdentity entity
     *
     * @description Cancel a BusinessIdentity entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: BusinessIdentity unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled BusinessIdentity object
     *
     */
    return rest.deleteId(resource, id, user);
};
