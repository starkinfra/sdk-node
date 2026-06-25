const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class BusinessAttachment extends Resource {
    /**
     *
     * BusinessAttachment object
     *
     * @description A BusinessAttachment represents a document (incorporation document / articles of association etc.)
     * sent to a BusinessIdentity. You must reference the desired BusinessIdentity by its id. A BusinessIdentity
     * accepts at most 2 attachments.
     *
     * When you initialize a BusinessAttachment, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param name [string]: document name. It must be unique among the identity's active attachments. ex: 'contrato-social.pdf'
     * @param content [string]: Base64 data url of the file. ex: data:application/pdf;base64,JVBERi0xLjQ...
     * @param businessIdentityId [string]: unique id of the BusinessIdentity this attachment belongs to. ex: '5656565656565656'
     * @param contentType [string]: content MIME type. This parameter is required as input only. ex: 'application/pdf', 'image/png' or 'image/jpeg'
     *
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for reference when searching for BusinessAttachments. ex: ['doc-principal']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when BusinessAttachment is created. ex: '5656565656565656'
     * @param attachmentId [string]: id of the document in the external attachment service. ex: '5104320788332544'
     * @param status [string]: current status of the BusinessAttachment. Options: 'created', 'canceled', 'approved', 'denied'
     * @param created [string]: creation datetime for the BusinessAttachment. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the BusinessAttachment. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    name, content = null, businessIdentityId, contentType = null, tags = null, id = null,
                    attachmentId = null, status = null, created = null, updated = null
                }) {
        super(id);
        this.name = name;
        this.content = content;
        this.businessIdentityId = businessIdentityId;
        this.attachmentId = attachmentId;
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);

        if (contentType) {
            if (!content) {
                throw new Error("content is required when contentType is provided");
            }
            this.content = "data:" + contentType + ";base64," + content.toString("base64");
            this.contentType = null;
        }
    }
}

exports.BusinessAttachment = BusinessAttachment;
let resource = {'class': exports.BusinessAttachment, 'name': 'BusinessAttachment'};

exports.create = async function (attachments, { user } = {}) {
    /**
     *
     * Create BusinessAttachments
     *
     * @description Send a list of BusinessAttachment objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param attachments [list of BusinessAttachment objects]: list of BusinessAttachment objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessAttachment objects with updated attributes
     *
     */
    return rest.post(resource, attachments, user);
};

exports.get = async function (id, { expand, user } = {}) {
    /**
     *
     * Retrieve a specific BusinessAttachment
     *
     * @description Receive a single BusinessAttachment object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: fields to expand information. ex: ['content']
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns BusinessAttachment object with updated attributes
     *
     */
    return rest.getId(resource, id, user, {'expand': expand});
};

exports.query = async function ({ limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve BusinessAttachments
     *
     * @description Receive a generator of BusinessAttachment objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'canceled', 'approved', 'denied'
     * @param tags [list of strings, default null]: list of strings for reference when searching for BusinessAttachments. ex: ['doc-principal']
     * @param ids [list of strings, default null]: list of BusinessAttachment ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessAttachment objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve paged BusinessAttachments
     *
     * @description Receive a list of BusinessAttachment objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'canceled', 'approved', 'denied'
     * @param tags [list of strings, default null]: list of strings for reference when searching for BusinessAttachments. ex: ['doc-principal']
     * @param ids [list of strings, default null]: list of BusinessAttachment ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessAttachment objects with updated attributes and a cursor to the next page
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids
    };
    return rest.getPage(resource, query, user);
};

exports.cancel = async function (id, { user } = {}) {
    /**
     *
     * Cancel a BusinessAttachment entity
     *
     * @description Cancel a BusinessAttachment entity previously created in the Stark Infra API. Only attachments that
     * have not been sent to processing (status 'created') can be canceled.
     *
     * Parameters (required):
     * @param id [string]: BusinessAttachment unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled BusinessAttachment object
     *
     */
    return rest.deleteId(resource, id, user);
};
