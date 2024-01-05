const rest = require('../utils/rest');
const check = require('starkcore').check;
const parse = require('../utils/parse.js');
const Resource = require('starkcore').Resource;


class Event extends Resource {
    /**
     *
     * Webhook Event object
     *
     * @description An Event is the notification received from the subscription to the Webhook.
     * Events cannot be created, but may be retrieved from the Stark Infra API to
     * list all generated updates on entities.
     *
     * Attributes:
     * @param id [string]: unique id returned when the event is created. ex: '5656565656565656'
     * @param log [Log]: a Log object from one the subscription services (PixRequest Log, PixReversal Log)
     * @param created [string]: creation datetime for the notification event. ex: '2020-03-10 10:30:00.000'
     * @param delivered [string]: delivery datetime when the notification was delivered to the user url. Will be null if no successful attempts to deliver the event occurred. ex: '2020-03-10 10:30:00.000'
     * @param subscription [string]: service that triggered this event. ex: 'pix-request.in', 'pix-request.out'
     * @param workspaceId [string]: ID of the Workspace that generated this event. Mostly used when multiple Workspaces have Webhooks registered to the same endpoint. ex: '4545454545454545'
     *
     */
    constructor({
                    id=null, log=null, created=null, isDelivered=null, 
                    subscription=null, workspaceId=null
                } = {}) {
        super(id);
        
        this.log = log;
        this.created = check.datetime(created);
        this.isDelivered = isDelivered;
        this.subscription = subscription;
        this.workspaceId = workspaceId;
    }
}

exports.Event = Event;
let resource = {'class': exports.Event, 'name': 'Event'};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific notification Event
     *
     * @description Receive a single notification Event object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Event object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, isDelivered, user } = {}) {
    /**
     *
     * Retrieve notification Events
     *
     * @description Receive a generator of notification Event objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020, 3, 10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020, 3, 10'
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param isDelivered [bool, default null]: bool to filter successfully delivered events. ex: true or false
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of Event objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        isDelivered: isDelivered,
        user: user,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, isDelivered, user } = {}) {
    /**
     *
     * Retrieve paged Events
     *
     * @description Receive a list of up to 100 Event objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020, 3, 10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020, 3, 10'
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param isDelivered [bool, default null]: bool to filter successfully delivered events. ex: true or false
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of Event objects with updated attributes and cursor to retrieve the next page of Event objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        isDelivered: isDelivered,
        user: user,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { isDelivered, user } = {}) {
    /**
     *
     * Update notification Event entity
     *
     * @description Update notification Event by passing id.
     * If isDelivered is true, the event will no longer be returned on queries with isDelivered=false.
     *
     * Parameters (required):
     * @param id [list of strings]: Event unique ids. ex: '5656565656565656'
     * @param isDelivered [bool]: If True and event hasn't been delivered already, event will be set as delivered. ex: true
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target Event with updated attributes
     *
     */
    let payload = {
        isDelivered: isDelivered
    };
    return rest.patchId(resource, id, payload, user);
};

exports.delete = async function (id, {user} = {}) {
    /**
     *
     * Delete a Webhook Event entity
     *
     * @description Delete a notification Event entity previously created in the Stark Infra API by its ID
     *
     * Parameters (required):
     * @param id [string]: IssuingCard unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns deleted Event object
     *
     */
    return rest.deleteId(resource, id, user);
};

exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create a single notification Event from a content string
     *
     * @description Create a single Event object received from event listening at subscribed user endpoint.
     * If the provided digital signature does not check out with the Stark public key, a
     * starkinfra.error.InvalidSignatureError will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Event object with updated attributes
     *
     */
    return parse.parseAndVerify(resource, content, signature, user)
};
