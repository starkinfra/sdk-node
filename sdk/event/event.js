const Resource = require('../utils/resource.js').Resource;
const check = require('../utils/check.js');
const parse = require('../utils/parse.js');


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
     * @param log [Log]: a Log object from one the subscription services (Transfer Log, Boleto Log, BoletoHolmes Log, BoletoPayment Log, BrcodePayment Log, Deposit Log, Invoice Log or UtilityPayment Log)
     * @param created [string]: creation datetime for the notification event. ex: '2020-03-10 10:30:00.000'
     * @param delivered [string]: delivery datetime when the notification was delivered to the user url. Will be null if no successful attempts to deliver the event occurred. ex: '2020-03-10 10:30:00.000'
     * @param subscription [string]: service that triggered this event. ex: 'transfer', 'utility-payment'
     * @param workspaceId [string]: ID of the Workspace that generated this event. Mostly used when multiple Workspaces have Webhooks registered to the same endpoint. ex: '4545454545454545'
     *
     */
    constructor({created, isDelivered, subscription, log, id, workspaceId} = {}) {
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


exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create single notification Event from a content string
     *
     * @description Create a single Event object received from event listening at subscribed user endpoint.
     * If the provided digital signature does not check out with the Stark public key, a
     * stark.exception.InvalidSignatureException will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Event object with updated attributes
     *
     */
    return parse.parseAndVerify(resource, content, signature, user)
};
