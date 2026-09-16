const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class IndividualIdentity extends Resource {
    /**
     *
     * IndividualIdentity object
     *
     * @description An IndividualIdentity represents an end-to-end identity verification of a Brazilian individual.
     * It is created already carrying the proofs the holder must submit through the returned validatorLink -- there
     * is no separate individual-document resource, and no 'created' method on such a resource to attach documents to.
     * When you initialize a IndividualIdentity, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param name [string]: individual's full name. ex: 'Edward Stark'
     * @param email [string]: individual's email; used to deliver the validatorLink when deliveryMethod is 'automatic'. ex: 'edward@starkbank.com'
     * @param deliveryMethod [string]: how the validatorLink is delivered to the holder. Options: 'automatic', 'manual'
     * @param proofs [list of strings]: proofs the holder must submit through the validatorLink. Options: 'identity', 'biometric' (each must be enabled on the workspace's Identity Profile)
     *
     * Parameters (optional):
     * @param taxId [string, default null]: individual's tax ID (CPF). ex: '594.739.480-42'
     * @param phone [string, default null]: individual's phone number. ex: '+5511989898989'
     * @param tags [list of strings, default []]: list of strings for tagging. ex: ['travel', 'food']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IndividualIdentity is created. ex: '5656565656565656'
     * @param validatorLink [string]: link used by the holder to submit the required proofs.
     * @param sourceId [string]: id of the source that originated this identity.
     * @param sourceType [string]: type of the source that originated this identity. Options: 'onboarding', 'reboarding', 'external'
     * @param workspaceId [string]: workspace unique id. ex: '5656565656565656'
     * @param status [string]: current IndividualIdentity status. Options: 'created', 'processing', 'pending', 'success', 'failed'
     * @param created [string]: creation datetime for the IndividualIdentity. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IndividualIdentity. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    name, taxId, birthDate = null, tags = null, id = null, status = null,
                    created = null,
                }) {
        super(id);
        this.name = name;
        this.taxId = taxId;
        this.birthDate = check.date(birthDate);
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);
    }
}

exports.IndividualIdentity = IndividualIdentity;
let resource = {'class': exports.IndividualIdentity, 'name': 'IndividualIdentity'};

exports.create = async function (identities, { user } = {}) {
    /**
     *
     * Create IndividualIdentities
     *
     * @description Send a list of IndividualIdentity objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param identities [list of IndividualIdentity objects]: list of IndividualIdentity objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IndividualIdentity objects with updated attributes
     *
     */
    return rest.post(resource, identities, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IndividualIdentity
     *
     * @description Receive a single IndividualIdentity object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IndividualIdentity object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, tags, status, ids, user } = {}) {
    /**
     *
     * Retrieve IndividualIdentities
     *
     * @description Receive a generator of IndividualIdentity objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "canceled", "processing", "failed", "success"]
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IndividualIdentity objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, tags, status, ids, user } = {}) {
    /**
     *
     * Retrieve paged IndividualIdentities
     *
     * @description Receive a list of up to 100 IndividualIdentity objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "canceled", "processing", "failed", "success"]
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IndividualIdentity objects with updated attributes and cursor to retrieve the next page of IndividualIdentity objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { status, user }) {
    /**
     *
     * Update IndividualIdentity entity
     *
     * @description Update the taxId of an IndividualIdentity after it has been created -- useful when the CPF is
     * only collected during the proof-submission flow. There is no status parameter; status is never accepted on
     * update.
     *
     * Parameters (required):
     * @param id [string]: IndividualIdentity id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param taxId [string, default null]: CPF to assign to the identity.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target IndividualIdentity with updated attributes
     *
     */
    let payload = {
        status: status
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel an IndividualIdentity entity
     *
     * @description Cancel an IndividualIdentity (soft delete). Only identities in 'created' or 'pending' status can be canceled; the identity moves to 'failed', every pending proof is canceled, and a 'canceled' log is delivered through the webhook.
     *
     * Parameters (required):
     * @param id [string]: IndividualIdentity unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled IndividualIdentity object
     *
     */
    return rest.deleteId(resource, id, user);
};
