const rest = require('../utils/rest.js');
const api = require('starkcore').api;
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class PixPullRequest extends Resource {
    /**
     *
     * PixPullRequest object
     *
     * @description A Pix Pull Request is a command sent to the payer's bank to trigger the automatic
     * debit linked to an active PixPullSubscription. Each pull request references a parent
     * PixPullSubscription via `subscriptionId`.
     *
     * Parameters (required):
     * @param amount [integer]: amount to be charged in cents. ex: 11234 (= R$ 112.34)
     * @param due [string]: due date for answering with an approval or denial. ISO 8601. ex: '2026-03-18T19:17:44.382949+00:00'
     * @param endToEndId [string]: Central Bank's unique transaction id. ex: 'E32160637202617031917FXbuEOeqxTE'
     * @param receiverAccountNumber [string]: receiver's bank account number. ex: '00000000'
     * @param receiverAccountType [string]: receiver's account type. Options: 'checking', 'savings', 'salary', 'payment'
     * @param receiverBankCode [string]: receiver's bank code. ex: '32160637'
     * @param reconciliationId [string]: id used for conciliation of the resulting Pix transaction. ex: '20260317191744.382994-03001917VKqeyyGMWvK'
     * @param subscriptionId [string]: unique id of the parent PixPullSubscription. ex: '6366699370577920'
     *
     * Parameters (optional):
     * @param attemptType [string, default null]: Options: 'default', 'instantRetry', 'scheduledRetry'
     * @param description [string, default null]: additional information delivered to the sender. ex: 'Monthly fare'
     * @param receiverBranchCode [string, default null]: receiver's branch code. ex: '1357-9'
     * @param tags [list of strings, default null]: list of strings for reference. ex: ['test', 'pix-pull']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixPullRequest is created. ex: '5656565656565656'
     * @param status [string]: current PixPullRequest status. Options: 'created', 'processing', 'scheduled', 'denied', 'success', 'canceled', 'expired'
     * @param flow [string]: direction of money flow. Options: 'in', 'out'
     * @param receiverName [string]: receiver's full name. ex: 'Stark Bank'
     * @param receiverTaxId [string]: receiver's tax ID. ex: '39.908.427/0001-28'
     * @param senderBankCode [string]: sender's bank institution code. ex: '20018183'
     * @param senderFinalName [string]: sender's final name. ex: 'STARK SCD S.A.'
     * @param senderTaxId [string]: sender's tax ID. ex: '99.999.919/9999-79'
     * @param subscriptionBacenId [string]: bacenId of the parent subscription. ex: 'RR321606372026170319175775651'
     * @param created [string]: creation datetime. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    amount, due, endToEndId, receiverAccountNumber, receiverAccountType,
                    receiverBankCode, reconciliationId, subscriptionId,
                    attemptType = null, description = null, receiverBranchCode = null, tags = null,
                    id = null, status = null, flow = null, receiverName = null, receiverTaxId = null,
                    senderBankCode = null, senderFinalName = null, senderTaxId = null,
                    subscriptionBacenId = null, created = null, updated = null
                }) {
        super(id);

        this.amount = amount;
        this.due = check.datetime(due === "" ? null : due);
        this.endToEndId = endToEndId;
        this.receiverAccountNumber = receiverAccountNumber;
        this.receiverAccountType = receiverAccountType;
        this.receiverBankCode = receiverBankCode;
        this.reconciliationId = reconciliationId;
        this.subscriptionId = subscriptionId;
        this.attemptType = attemptType;
        this.description = description;
        this.receiverBranchCode = receiverBranchCode;
        this.tags = tags;
        this.status = status;
        this.flow = flow;
        this.receiverName = receiverName;
        this.receiverTaxId = receiverTaxId;
        this.senderBankCode = senderBankCode;
        this.senderFinalName = senderFinalName;
        this.senderTaxId = senderTaxId;
        this.subscriptionBacenId = subscriptionBacenId;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixPullRequest = PixPullRequest;
let resource = {'class': exports.PixPullRequest, 'name': 'PixPullRequest'};


exports.create = async function (requests, {user} = {}) {
    /**
     *
     * Create PixPullRequests
     *
     * @description Send a list of PixPullRequest objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param requests [list of PixPullRequest objects]: list of PixPullRequest objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixPullRequest objects with updated attributes
     *
     */
    return rest.post(resource, requests, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixPullRequest
     *
     * @description Receive a single PixPullRequest object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixPullRequest object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, status, tags, ids, flows, subscriptionIds, user} = {}) {
    /**
     *
     * Retrieve PixPullRequests
     *
     * @description Receive a generator of PixPullRequest objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['created', 'success']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param flows [list of strings, default null]: filter for direction of money flow. Options: 'in', 'out'. ex: ['out']
     * @param subscriptionIds [list of strings, default null]: list of PixPullSubscription ids to filter retrieved objects. ex: ['6366699370577920', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixPullRequest objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        flows: flows,
        subscriptionIds: subscriptionIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({cursor, limit, after, before, status, tags, ids, flows, subscriptionIds, user} = {}) {
    /**
     *
     * Retrieve paged PixPullRequests
     *
     * @description Receive a list of up to 100 PixPullRequest objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call. ex: 'bf85ddf6-7d1e-4f0a-9c0a-1d2e3f4a5b6c'
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max 100. ex: 35
     * @param after [string, default null]: date filter for objects created after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['created', 'success']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param flows [list of strings, default null]: filter for direction of money flow. Options: 'in', 'out'. ex: ['out']
     * @param subscriptionIds [list of strings, default null]: list of PixPullSubscription ids to filter retrieved objects. ex: ['6366699370577920', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixPullRequest objects with updated attributes and cursor to retrieve the next page
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
        flows: flows,
        subscriptionIds: subscriptionIds,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, {status, reason, user} = {}) {
    /**
     *
     * Update PixPullRequest entity
     *
     * @description Update a PixPullRequest's status by passing its id. Change status to 'scheduled' or 'denied'.
     *
     * Parameters (required):
     * @param id [string]: PixPullRequest unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param status [string, default null]: new status to set. ex: 'scheduled' or 'denied'.
     * @param reason [string, default null]: reason for the patch. Required when denying. Options: 'senderAccountClosed', 'senderAccountBlocked', 'amountNotAllowed'.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixPullRequest with updated attributes
     *
     */
    let payload = {
        'status': status,
        'reason': reason,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, reason, {user} = {}) {
    /**
     *
     * Cancel a PixPullRequest entity
     *
     * @description Cancel a PixPullRequest entity previously created in the Stark Infra API.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     * @param reason [string]: reason why the PixPullRequest is being cancelled. Options as receiver: 'accountClosed', 'receiverOrganizationClosed', 'receiverInternalError', 'fraud', 'receiverUserRequested'. Options as sender: 'accountClosed', 'senderDeceased', 'fraud', 'senderUserRequested'.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixPullRequest object
     *
     */
    let response = await rest.deleteRaw(
        `/${api.endpoint(resource.name)}/${id}`,
        null,
        null,
        true,
        user,
        {reason: reason}
    );
    let json = response.json();
    let entity = json[api.lastName(resource.name)];
    return Object.assign(new exports.PixPullRequest(entity), entity);
};
