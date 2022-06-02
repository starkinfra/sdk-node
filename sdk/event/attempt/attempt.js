const rest = require('../../utils/rest.js');
const check = require('../../utils/check.js');
const Resource = require('../../utils/resource.js').Resource


class Attempt extends Resource {
    /**
     *
     * Event Attempt object
     *
     * @description When an Event delivery fails, an event attempt will be registered.
     * It carries information meant to help you debug event reception issues.
     *
     * Attributes:
     * @param id [string]: unique id that identifies the delivery attempt. ex: '5656565656565656'
     * @param code [string]: delivery error code. ex: badHttpStatus, badConnection, timeout
     * @param message [string]: delivery error full description. ex: 'HTTP POST request returned status 404'
     * @param eventId [string]: ID of the Event whose delivery failed. ex: '4848484848484848'
     * @param webhookId [string]: ID of the Webhook that triggered this event. ex: '5656565656565656'
     * @param created [string]: datetime representing the moment when the attempt was made. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ id, code, message, webhookId, eventId, created }) {
        super(id);
        this.code = code;
        this.message = message;
        this.webhookId = webhookId;
        this.eventId = eventId;
        this.created = check.datetime(created);
    }
}

exports.Attempt = Attempt;
let resource = {'class': exports.Attempt, 'name': 'EventAttempt'};


exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific Event Attempt
     *
     * @description Receive a single Event Attempt object previously created by the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Event Attempt object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ resource, limit, after, before, eventIds, webhookIds, user } = {}) {
    /**
     *
     * Retrieve Event Attempts
     *
     * @description Receive a generator of Event Attempt objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param eventIds [list of strings, default []]: list of Event ids to filter attempts. ex: ['5656565656565656', '4545454545454545']
     * @param webhookIds [list of strings, default []]: list of Webhook ids to filter attempts. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of Event Attempt objects with updated attributes
     *
     */
    let query = {
        resource: resource,
        limit: limit,
        after: after,
        before: before,
        eventIds: eventIds,
        webhookIds: webhookIds
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, resource, limit, after, before, eventIds, webhookIds, user } = {}) {
    /**
     *
     * Retrieve paged Event Attempts
     *
     * @description Receive a list of up to 100 Event.Attempt objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your cards.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param eventIds [list of strings, default []]: list of Event ids to filter attempts. ex: ['5656565656565656', '4545454545454545']
     * @param webhookIds [list of strings, default []]: list of Webhook ids to filter attempts. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of Event Attempt objects with updated attributes and cursor to retrieve the next page of Event Attempt objects
     *
     */
    let query = {
        cursor: cursor,
        resource: resource,
        limit: limit,
        after: after,
        before: before,
        eventIds: eventIds,
        webhookIds: webhookIds
    };
    return rest.getPage(resource, query, user);
};
