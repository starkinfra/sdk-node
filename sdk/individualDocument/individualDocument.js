const rest = require('../utils/rest.js');
const check = require('core-node').check;
const Resource = require('core-node').Resource;


class IndividualDocument extends Resource {
    /**
     *
     * IndividualDocument object
     *
     * @description Individual documents are images containing either side of a document or a selfie
     * to be used in a matching validation. When created, they must be attached to an individual
     * identity to be used for its validation.
     * 
     * When you initialize a IndividualDocument, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param type [string]: type of the IndividualDocument. Options: 'drivers-license-front', 'drivers-license-back', 'identity-front', 'identity-back' or 'selfie'
     * @param content [string]: Base64 data url of the picture. ex: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...
     * @param contentType [string]: content MIME type. This parameter is required as input only. ex: 'image/png' or 'image/jpeg'
     * @param identityId [string]: Unique id of IndividualIdentity. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param tags [list of strings, default []]: list of strings for reference when searching for IndividualDocuments. ex: ['employees', 'monthly']
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when IndividualDocument is created. ex: '5656565656565656'
     * @param status [string]: current status of the IndividualDocument. Options: 'created', 'canceled', 'processing', 'failed', 'success'
     * @param created [string]: creation datetime for the IndividualDocument. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    type, content, contentType, identityId, tags = null, id = null, 
                    status = null, created = null
                }) {
        super(id);
        this.type = type;
        this.content = content;
        this.contentType = contentType;
        this.identityId = identityId;
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);

        if(contentType) {
            this.content = "data:" + contentType + ";base64," + content.toString("base64");
            this.contentType = null;
        }
    }
}

exports.IndividualDocument = IndividualDocument;
let resource = {'class': exports.IndividualDocument, 'name': 'IndividualDocument'};

exports.create = async function (documents, { user } = {}) {
    /**
     *
     * Create IndividualDocuments
     *
     * @description Send a list of IndividualDocument objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param documents [list of IndividualDocument objects]: list of IndividualDocument objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IndividualDocument objects with updated attributes
     *
     */
    return rest.post(resource, documents, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IndividualDocument
     *
     * @description Receive a single IndividualDocument object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IndividualDocument object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, tags, status, ids, user } = {}) {
    /**
     *
     * Retrieve IndividualDocuments
     *
     * @description Receive a generator of IndividualDocument objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "canceled", "processing", "failed", "success"]
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IndividualDocument objects with updated attributes
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

exports.page = async function ({ cursor, limit, after, before, tags, status, ids, user } = {}) {
    /**
     *
     * Retrieve paged IndividualDocuments
     *
     * @description Receive a list of up to 100 IndividualDocument objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "canceled", "processing", "failed", "success"]
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IndividualDocument objects with updated attributes and cursor to retrieve the next page of IndividualDocument objects
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
