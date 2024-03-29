const rest = require('../../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('../../utils/resource.js').Resource


class Log extends Resource {
    /**
     *
     * PixRequest Log object
     *
     * @description Every time a PixRequest entity is modified, a corresponding PixRequest Log
     * is generated for the entity. This log is never generated by the
     * user.
     *
     * Attributes:
     * @param id [string]: unique id returned when the log is created. ex: '5656565656565656'
     * @param created [string]: creation datetime for the log. ex: '2020-03-10 10:30:00.000'
     * @param type [string]: type of the PixRequest event which triggered the log creation. ex: 'processing' or 'success'
     * @param errors [list of strings]: list of errors linked to this PixRequest event.
     * @param request [PixRequest]: PixRequest entity to which the log refers to.
     *
     */
    constructor({ 
                    id=null, created=null, type=null, errors=null, request=null
                }) {
        super(id);
        
        this.created = check.datetime(created);
        this.type = type;
        this.errors = errors;
        this.request = request;
    }
}

exports.Log = Log;
let resource = {'class': exports.Log, 'name': 'PixRequestLog'};


exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixRequest Log
     *
     * @description Receive a single PixRequest Log object previously created by the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixRequest Log object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, types, requestIds, user} = {}) {
    /**
     *
     * Retrieve PixRequest Logs
     *
     * @description Receive a generator of PixRequest Log objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: 'success' or 'failed'
     * @param requestIds [list of strings, default null]: list of PixRequest ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixRequest Log objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        types: types,
        requestIds: requestIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, types, requestIds, user } = {}) {
    /**
     *
     * Retrieve paged PixRequest Logs
     *
     * @description Receive a list of up to 100 PixRequest.Log objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: 'success' or 'failed'
     * @param requestIds [list of strings, default null]: list of PixRequest ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixRequest Log objects with updated attributes and cursor to retrieve the next page of PixRequest objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        types: types,
        requestIds: requestIds,
    };
    return rest.getPage(resource, query, user);
};
