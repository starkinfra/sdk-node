const rest = require('../../utils/rest.js');
const check = require('../../utils/check.js');
const Resource = require('../../utils/resource.js').Resource


class Log extends Resource {
    /**
     *
     * PixReversal Log object
     *
     * @description Every time a PixReversal entity is modified, a corresponding PixReversal Log
     * is generated for the entity. This log is never generated by the
     * user.
     *
     * Attributes:
     * @param id [string]: unique id returned when the log is created. ex: '5656565656565656'
     * @param created [string]: creation datetime for the log. ex: '2020-03-10 10:30:00.000'
     * @param type [string]: type of the PixReversal event which triggered the log creation. ex: 'processing' or 'success'
     * @param errors [list of strings]: list of errors linked to this PixReversal event.
     * @param reversal [PixReversal]: PixReversal entity to which the log refers to.
     *
     */
    constructor({
                    id=null, created=null, type=null, errors=null, reversal=null
                }) {
        super(id);
        
        this.created = check.datetime(created);
        this.type = type;
        this.errors = errors;
        this.reversal = reversal;
    }
}

exports.Log = Log;
let resource = {'class': exports.Log, 'name': 'PixReversalLog'};


exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixReversal Log
     *
     * @description Receive a single PixReversal Log object previously created by the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixReversal Log object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, types, reversalIds, user} = {}) {
    /**
     *
     * Retrieve PixReversal Logs
     *
     * @description Receive a generator of PixReversal Log objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: 'success' or 'failed'
     * @param reversalIds [list of strings, default null]: list of PixReversal ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixReversal Log objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        types: types,
        reversalIds: reversalIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, types, reversalIds, user } = {}) {
    /**
     *
     * Retrieve paged PixReversal Logs
     *
     * @description Receive a list of up to 100 PixReversal.Log objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your reversals.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: 'success' or 'failed'
     * @param reversalIds [list of strings, default null]: list of PixReversal ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixReversal Log objects with updated attributes and cursor to retrieve the next page of PixReversal objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        types: types,
        reversalIds: reversalIds,
    };
    return rest.getPage(resource, query, user);
};
