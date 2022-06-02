const rest = require('../../utils/rest.js');
const check = require('../../utils/check.js');
const Resource = require('../../utils/resource.js').Resource


class Log extends Resource {
    /**
     *
     * CreditNote Log object
     *
     * @description Every time a CreditNote entity is modified, a corresponding CreditNote Log
     * is generated for the entity. This log is never generated by the
     * user.
     *
     * Attributes:
     * @param id [string]: unique id returned when the log is created. ex: '5656565656565656'
     * @param created [string]: creation datetime for the log. ex: '2020-03-10 10:30:00.000'
     * @param type [string]: type of the CreditNote event which triggered the log creation. ex: 'processing' or 'success'
     * @param errors [list of strings]: list of errors linked to this CreditNote event.
     * @param note [CreditNote]: CreditNote entity to which the log refers to.
     *
     */
    constructor({ created, type, errors, note, id }) {
        super(id);
        this.created = check.datetime(created);
        this.type = type;
        this.errors = errors;
        this.note = note;
    }
}

exports.Log = Log;
let resource = {'class': exports.Log, 'name': 'CreditNoteLog'};


exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific CreditNote Log
     *
     * @description Receive a single CreditNote Log object previously created by the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns CreditNote Log object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, types, noteIds, user} = {}) {
    /**
     *
     * Retrieve CreditNote Logs
     *
     * @description Receive a generator of CreditNote Log objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: ['registered', 'paid']
     * @param noteIds [list of strings, default null]: list of CreditNote ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of CreditNote Log objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        types: types,
        noteIds: noteIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, types, noteIds, user } = {}) {
    /**
     *
     * Retrieve paged CreditNote Logs
     *
     * @description Receive a list of up to 100 CreditNote.Log objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: ['registered', 'paid']
     * @param noteIds [list of strings, default null]: list of CreditNote ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of CreditNote Log objects with updated attributes and cursor to retrieve the next page of CreditNote objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        types: types,
        noteIds: noteIds,
    };
    return rest.getPage(resource, query, user);
};
