const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class PixKeyHolmes extends Resource {
    /**
     *
     * PixKeyHolmes object
     *
     * @description PixKeyHolmes are used to investigate the registration status of a Pix Key
     * in the Central Bank's DICT. When you initialize a PixKeyHolmes, the entity will not be
     * automatically created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param keyId [string]: Pix Key to be investigated. ex: '+5511989898989', '11.222.333/0001-00', 'valid@sandbox.com'
     *
     * Parameters (optional):
     * @param tags [list of strings, default null]: list of strings for reference when searching for PixKeyHolmes. ex: ['pix', 'key']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixKeyHolmes is created. ex: '5656565656565656'
     * @param result [string]: result of the investigation after the case is solved. Options: 'registered', 'unregistered'
     * @param status [string]: current PixKeyHolmes status. Options: 'created', 'solving', 'solved', 'failed'
     * @param created [string]: creation datetime for the PixKeyHolmes. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the PixKeyHolmes. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    keyId, tags = null, id = null, result = null,
                    status = null, created = null, updated = null
                }) {
        super(id);

        this.keyId = keyId;
        this.tags = tags;
        this.result = result;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixKeyHolmes = PixKeyHolmes;
let resource = {'class': exports.PixKeyHolmes, 'name': 'PixKeyHolmes'};

exports.create = async function (holmes, {user} = {}) {
    /**
     *
     * Create PixKeyHolmes objects
     *
     * @description Send a list of PixKeyHolmes objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param holmes [list of PixKeyHolmes objects]: list of PixKeyHolmes objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixKeyHolmes objects with updated attributes
     *
     */
    return rest.post(resource, holmes, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve PixKeyHolmes
     *
     * @description Receive a generator of PixKeyHolmes objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'solving', 'solved', 'failed'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixKeyHolmes objects with updated attributes
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

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve paged PixKeyHolmes
     *
     * @description Receive a list of up to 100 PixKeyHolmes objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created only before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'solving', 'solved', 'failed'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixKeyHolmes objects with updated attributes and cursor to retrieve the next page of PixKeyHolmes objects
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
