const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class PixFraud extends Resource {
    /**
     *
     * PixFraud object
     *
     * @description PixFrauds are used to report a PixKey or taxId when a fraud has been confirmed.
     * When you initialize a PixFraud, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param externalId [string]: endToEndId or returnId of the transaction being reported. ex: 'my_external_id'
     * @param type [string]: type of PixFraud. Options: 'identity', 'mule', 'scam', 'other'
     * @param taxId [string]: user tax ID (CPF or CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     *
     * Parameters (optional):
     * @param keyId [string, default null]: marked PixKey id. ex: '+5511989898989'
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['fraudulent']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixFraud is created. ex: '5656565656565656'
     * @param bacenId [string]: unique transaction id returned from Central Bank. ex: 'ccf9bd9c-e99d-999e-bab9-b999ca999f99'
     * @param status [string]: current PixFraud status. Options: 'created', 'failed', 'registered', 'canceled'.
     * @param created [string]: creation datetime for the PixFraud. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the PixFraud. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    externalId, type, taxId, keyId = null, tags = null, id = null,
                    bacenId = null, status = null, created = null, updated = null
                }) {
        super(id);

        this.externalId = externalId;
        this.type = type;
        this.taxId = taxId;
        this.keyId = keyId;
        this.tags = tags;
        this.bacenId = bacenId;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixFraud = PixFraud;
let resource = {'class': exports.PixFraud, 'name': 'PixFraud'};

exports.create = async function (frauds, {user} = {}) {
    /**
     *
     * Create PixFraud objects
     *
     * @description Send a list of PixFraud objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param frauds [list of PixFraud objects]: list of PixFraud objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixFraud objects with updated attributes
     *
     */
    return rest.post(resource, frauds, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixFraud
     *
     * @description Receive a single PixFraud object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixFraud object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, ids, tags, user } = {}) {
    /**
     *
     * Retrieve PixFrauds
     *
     * @description Receive a generator of PixFraud objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'registered', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['fraudulent']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixFraud objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
        tags: tags,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, ids, tags, user } = {}) {
    /**
     *
     * Retrieve paged PixFrauds
     *
     * @description Receive a list of up to 100 PixFraud objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'registered', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ['fraudulent']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixFraud objects with updated attributes and cursor to retrieve the next page of PixFraud objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
        tags: tags,
    };
    return rest.getPage(resource, query, user);
};

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel a PixFraud entity
     *
     * @description Cancel a PixFraud entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixFraud object
     *
     */
    return rest.deleteId(resource, id, user);
};
