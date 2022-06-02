const rest = require('../utils/rest.js');
const Resource = require('../utils/resource.js').Resource


class Webhook extends Resource {
    constructor({url, subscriptions, id = null}) {
        /**
         *
         * Webhook subscription object
         *
         * @description A Webhook is used to subscribe to notification events on a user-selected endpoint.
         * Currently available services for subscription are contract, credit-note, signer, issuing-card, issuing-invoice, issuing-purchase, pix-request.in, pix-request.out, pix-reversal.in, pix-reversal.out, pix-claim, pix-key, pix-chargeback, pix-infraction.
         *
         * Parameters (required):
         * @param url [string]: Url that will be notified when an event occurs.
         * @param subscriptions [list of strings]: list of any non-empty combination of the available services. ex: ['contract', 'credit-note', 'signer', 'issuing-card', 'issuing-invoice', 'issuing-purchase', 'pix-request.in', 'pix-request.out', 'pix-reversal.in', 'pix-reversal.out', 'pix-claim', 'pix-key', 'pix-chargeback', 'pix-infraction']
         *
         * Attributes:
         * @param id [string]: unique id returned when the webhook is created. ex: '5656565656565656'
         *
         */
        super(id);
        this.url = url;
        this.subscriptions = subscriptions;
    }
}

exports.Webhook = Webhook;
let resource = {'class': exports.Webhook, 'name': 'Webhook'};

exports.create = async function ({url, subscriptions, user = null} = {}) {
    /**
     *
     * Create Webhook subscription
     *
     * @description Send a single Webhook subscription for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param url [string]: url to which notification events will be sent to. ex: 'https://webhook.site/60e9c18e-4b5c-4369-bda1-ab5fcd8e1b29'
     * @param subscriptions [list of strings]: list of any non-empty combination of the available services. ex: ['contract', 'credit-note', 'signer']
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Webhook object with updated attributes
     *
     */
    let options = {
        url: url,
        subscriptions: subscriptions,
    };
    return rest.postSingle(resource, options, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific Webhook subscription
     *
     * @description Receive a single Webhook subscription object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Webhook object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit = null, user = null} = {}) {
    /**
     *
     * Retrieve Webhook subcriptions
     *
     * @description Receive a generator of Webhook subcription objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of Webhook objects with updated attributes
     *
     */
    let query = {
        limit: limit,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor = null, limit = null, user = null } = {}) {
    /**
     *
     * Retrieve paged Webhook subcriptions
     *
     * @description Receive a list of up to 100 Webhook objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param user [Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of Webhook objects with updated attributes and cursor to retrieve the next page of Webhook objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
    };
    return rest.getPage(resource, query, user);
};

exports.delete = async function (id, {user} = {}) {
    /**
     *
     * Delete a Webhook subscription entity
     *
     * @description Delete a Webhook subscription entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: Webhook unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns deleted Webhook object
     *
     */
    return rest.deleteId(resource, id, user);
};
