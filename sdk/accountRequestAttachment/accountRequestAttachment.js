const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AccountRequestAttachment extends Resource {
    /**
     *
     * AccountRequestAttachment object
     *
     * @description You can create an Account Request Attachment to attach images of documents
     * to a specific Individual Account Request. You must reference the desired Individual Account Request by its id.
     * 
     * When you initialize a AccountRequestAttachment, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param type [string]: type of the AccountRequestAttachment. Options: 'drivers-license-front', 'drivers-license-back', 'identity-front', 'identity-back' or 'selfie'
     * @param content [string]: Base64 data url of the picture. ex: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...
     * @param accountRequestId [string]: Unique id of IndividualAccountRequest. ex: '5656565656565656'
     * @param contentType [string]: content MIME type. This parameter is required as input only. ex: 'image/png' or 'image/jpeg'
     * 
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for reference when searching for AccountRequestAttachments. ex: ['employees', 'monthly']
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when AccountRequestAttachment is created. ex: '5656565656565656'
     * @param status [string]: current status of the AccountRequestAttachment. ex: 'created'
     * @param created [string]: creation datetime for the AccountRequestAttachment. ex: '2020-03-10 10:30:00.000'
     * 
     */
    constructor({
        type, content = null, accountRequestId, contentType, created = null, status = null, id = null
    }) {
        super(id);
        this.type = type;
        this.content = content;
        this.accountRequestId = accountRequestId;
        this.created = check.datetime(created);
        this.status = status;

        if(contentType) {
            if(!content) {
                throw new Error("content is required when contentType is provided");
            }
            this.content = "data:" + contentType + ";base64," + content.toString("base64");
            this.contentType = null;
        }
    }
}

exports.AccountRequestAttachment = AccountRequestAttachment;
let resource = {'class': exports.AccountRequestAttachment, 'name': 'AccountRequestAttachment'};

exports.create = async function (attachments, { user } = {}) {
    /**
     *
     * Create AccountRequestAttachments
     *
     * @description Send a list of AccountRequestAttachment objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param attachments [list of AccountRequestAttachment objects]: list of AccountRequestAttachment objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of AccountRequestAttachment objects with updated attributes
     *
     */
    return rest.post(resource, attachments, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific AccountRequestAttachment
     *
     * @description Receive a single AccountRequestAttachment object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AccountRequestAttachment object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve AccountRequestAttachments
     *
     * @description Receive a generator of AccountRequestAttachment objects previously created in the Stark Infra API and the cursor to the next page. 
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'canceled', 'processing', 'failed', 'success'
     * @param tags [list of strings, default null]: list of strings for reference when searching for AccountRequestAttachments. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of AccountRequestAttachment ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of AccountRequestAttachment objects with updated attributes
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
     * Retrieve paged AccountRequestAttachments
     *
     * @description Receive a list of AccountRequestAttachment objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'canceled', 'processing', 'failed', 'success'
     * @param tags [list of strings, default null]: list of strings for reference when searching for AccountRequestAttachments. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of AccountRequestAttachment ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of AccountRequestAttachment objects with updated attributes and a cursor to the next page
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
