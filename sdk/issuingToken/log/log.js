const rest = require('../../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('../../utils/resource.js').Resource


class Log extends Resource {
    /**
     *
     * IssuingToken Log object
     *
     * @description Every time a CreditHolmes entity is modified, a corresponding IssuingToken Log
     * is generated for the entity. This log is never generated by the
     * user.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the log is created. ex: '5656565656565656'
     * @param token [IssuingToken]: IssuingToken entity to which the log refers to.
     * @param errors [list of strings]: list of errors linked to this IssuingToken event.
     * @param type [string]: type of the IssuingToken event which triggered the log creation. ex: 'active', 'blocked', 'canceled', 'frozen' or 'pending'
     * @param created [string]: creation datetime for the log. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    id=null, token=null, errors=null, type=null, created=null
                }) {
        super(id);
        this.token = token;
        this.errors = errors;
        this.type = type;
        this.created = check.datetime(created);
    }
}

exports.Log = Log;
let resource = {'class': exports.Log, 'name': 'IssuingTokenLog'};


exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingToken Log
     *
     * @description Receive a single IssuingToken Log object previously created by the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingToken Log object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, types, tokenIds, user } = {}) {
    /**
     *
     * Retrieve IssuingToken Logs
     *
     * @description Receive a generator of IssuingToken Log objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: ['active', 'blocked', 'canceled', 'frozen', 'pending']
     * @param tokenIds [list of strings, default []]: list of IssuingToken ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingToken Log objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        types: types,
        tokenIds: tokenIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, ids, limit, after, before, types, tokenIds, user } = {}) {
    /**
     *
     * Retrieve paged IssuingToken Logs
     *
     * @description Receive a list of up to 100 IssuingToken.Log objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your holmes.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: ['active', 'blocked', 'canceled', 'frozen', 'pending']
     * @param tokenIds [list of strings, default []]: list of IssuingToken ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingToken Log objects with updated attributes and cursor to retrieve the next page of IssuingToken Log objects
     *
     */
    let query = {
        cursor: cursor,
        ids: ids,
        limit: limit,
        after: after,
        before: before,
        types: types,
        tokenIds: tokenIds,
    };
    return rest.getPage(resource, query, user);
};
