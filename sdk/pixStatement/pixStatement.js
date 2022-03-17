const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class PixStatement extends Resource {
    /**
     *
     * PixStatement object
     *
     * @description The PixStatement object stores information about all the transactions that happened on
     * a specific day at the workspace. It must be created by the user before it can be
     * accessed by the user. This feature is only available for direct participants.
     *
     * Parameters (required):
     * @param before [string]: transactions that happened at this date are stored in the PixStatement, must be the same as before. ex: (2022-01-01)
     * @param after [string]: transactions that happened at this date are stored in the PixStatement, must be the same as after. ex: (2022-01-01)
     * @param type [string]: types of entities to include in statement. Options: ["interchange", "interchangeTotal", "transaction"]
     *
     * Attributes (return-only):
     * @param id [string, default null]: unique id returned when the PixStatement is created. ex: "5656565656565656"
     * @param status [string, default null]: current PixStatement status. ex: "success" or "failed"
     * @param transactionCount [string, default null]: PixStatement status. ex: "success" or "failed"t None]: number of transactions that happened during the day that the PixStatement was requested. ex 11
     * @param created [string, default null]: creation datetime for the PixStatement. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     * @param updated [string, default null]: latest update datetime for the PixStatement. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     *
     */
    constructor({
                    before, after, type, id, status, transactionCount, created, updated
                }) {
        super(id);
        this.before = check.date(before);
        this.after = check.date(after);
        this.type = type;
        this.status = status;
        this.transactionCount = transactionCount;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixStatement = PixStatement;
let resource = {'class': exports.PixStatement, 'name': 'PixStatement'};

exports.create = async function (statement, {user} = {}) {
    /**
     *
     * Create PixStatement
     *
     * @description Send a PixStatement object for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param statement [PixStatement object]: list of PixStatement objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixStatement object with updated attributes
     *
     */
    return rest.postSingle(resource, statement, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixStatement
     *
     * @description Receive a single PixStatement object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixStatement object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, ids, user} = {}) {
    /*
     *
     * Retrieve PixStatements
     *
     * @description Receive a generator of PixStatement objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixStatement objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        ids: ids,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, ids, user} = {}) {
    /**
     *
     * Retrieve paged PixStatements
     *
     * @description Receive a list of up to 100 PixStatement objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your statements.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixStatement objects with updated attributes and cursor to retrieve the next page of PixStatement objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        ids: ids,
     };
    return rest.getPage(resource, query, user);
};

exports.csv = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a .cvs PixStatement
     *
     * @description Retrieve a specific PixStatement by its ID in a .csv file.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixStatement csv file
     *
     */
    return rest.getCsv(resource, id, {}, user);
};
