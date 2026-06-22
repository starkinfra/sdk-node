const rest = require('../utils/rest.js');
const api = require('starkcore').api;
const check = require('starkcore').check;
const parse = require('../utils/parse.js');
const Resource = require('starkcore').Resource;


class PixPullSubscription extends Resource {
    /**
     *
     * PixPullSubscription object
     *
     * @description A recurring Pix debit authorization. It defines the frequency, amount, and required payer
     * authorizations for a series of Pix debits to be pulled from the sender by the receiver. Each cycle of an
     * active subscription is triggered by a PixPullRequest (its subscriptionId references the subscription's id).
     *
     * Parameters (required):
     * @param bacenId [string]: Central Bank's unique recurrency id. Identifies the subscription in the Pix infrastructure.
     * @param externalId [string]: safe string that must be unique among all your Pix Pull Subscriptions. Used for idempotency.
     * @param installmentStart [string]: start datetime of settlements allowed for this subscription. ISO 8601. ex: '2026-03-10T19:32:35.418698+00:00'
     * @param interval [string]: cycle definition. Options: 'week', 'month', 'quarter', 'semester', 'year'
     * @param receiverName [string]: receiver's full name. ex: 'Edward Stark'
     * @param receiverTaxId [string]: receiver's tax ID (CPF or CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     * @param senderAccountNumber [string]: sender's bank account number. Use '-' before the verifier digit. ex: '876543-2'
     * @param senderBankCode [string]: sender's bank institution code in Brazil. ex: '20018183'
     * @param senderBranchCode [string]: sender's bank account branch code. Use '-' in case there is a verifier digit. ex: '1357-9'
     * @param senderTaxId [string]: sender's tax ID (CPF or CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     * @param type [string]: subscription journey type. Options: 'push', 'qrcode', 'qrcodeAndPayment' or 'paymentAndOrQrcode'.
     *
     * Parameters (conditionally required):
     * @param amount [integer, default null]: amount in cents charged every cycle. Required if the subscription has a fixed amount. ex: 11234 (= R$ 112.34)
     * @param amountMinLimit [integer, default null]: floor value for the maximum amount the sender can set when approving. Required if the subscription has a variable amount.
     *
     * Parameters (optional):
     * @param description [string, default null]: additional information delivered to the sender. ex: 'A Lannister always pays his debts'
     * @param due [string, default null]: due date for the sender's answer. ISO 8601. ex: '2026-04-17T02:59:59.999000+00:00'
     * @param installmentEnd [string, default null]: end datetime of settlements allowed for this subscription. ISO 8601. ex: '2026-12-18T02:59:59.999999+00:00'
     * @param receiverBankCode [string, default null]: receiver's bank institution code. Defaults to the workspace's primary institution when omitted. ex: '32160637'
     * @param referenceCode [string, default null]: commercial-relation identifier. ex: '36135971'
     * @param pullRetryLimit [integer, default null]: max number of retries the receiver may issue for a single failed pull cycle. ex: 3
     * @param senderCityCode [string, default null]: IBGE code of the payer's city. Required when patching status to 'confirmed'. ex: '1100015'
     * @param senderFinalName [string, default null]: final sender name when the sender differs from the originating institution. ex: 'STARK SCD S.A.'
     * @param senderFinalTaxId [string, default null]: final sender tax ID. ex: '39.908.427/0001-28'
     * @param tags [list of strings, default null]: list of strings for reference when searching for PixPullSubscriptions. ex: ['test', 'pix-pull']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixPullSubscription is created. ex: '5656565656565656'
     * @param status [string]: current lifecycle state. Options: 'created', 'pending', 'failed', 'denied', 'approved', 'active', 'expired', 'canceled'
     * @param flow [string]: direction of money flow. Options: 'in', 'out'
     * @param created [string]: creation datetime for the PixPullSubscription. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the PixPullSubscription. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    bacenId, externalId, installmentStart, interval, receiverName, receiverTaxId,
                    senderAccountNumber, senderBankCode, senderBranchCode, senderTaxId, type,
                    amount = null, amountMinLimit = null, description = null, due = null, installmentEnd = null,
                    receiverBankCode = null, referenceCode = null, pullRetryLimit = null, senderCityCode = null,
                    senderFinalName = null, senderFinalTaxId = null, tags = null,
                    id = null, status = null, flow = null, created = null, updated = null
                }) {
        super(id);

        this.bacenId = bacenId;
        this.externalId = externalId;
        this.installmentStart = check.datetime(installmentStart);
        this.interval = interval;
        this.receiverName = receiverName;
        this.receiverTaxId = receiverTaxId;
        this.senderAccountNumber = senderAccountNumber;
        this.senderBankCode = senderBankCode;
        this.senderBranchCode = senderBranchCode;
        this.senderTaxId = senderTaxId;
        this.type = type;
        this.amount = amount;
        this.amountMinLimit = amountMinLimit;
        this.description = description;
        this.due = check.datetime(due === "" ? null : due);
        this.installmentEnd = check.datetime(installmentEnd === "" ? null : installmentEnd);
        this.receiverBankCode = receiverBankCode;
        this.referenceCode = referenceCode;
        this.pullRetryLimit = pullRetryLimit;
        this.senderCityCode = senderCityCode;
        this.senderFinalName = senderFinalName;
        this.senderFinalTaxId = senderFinalTaxId;
        this.tags = tags;
        this.status = status;
        this.flow = flow;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixPullSubscription = PixPullSubscription;
let resource = {'class': exports.PixPullSubscription, 'name': 'PixPullSubscription'};

exports.create = async function (subscriptions, {user} = {}) {
    /**
     *
     * Create PixPullSubscriptions
     *
     * @description Send a list of PixPullSubscription objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param subscriptions [list of PixPullSubscription objects]: list of PixPullSubscription objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixPullSubscription objects with updated attributes
     *
     */
    return rest.post(resource, subscriptions, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific PixPullSubscription
     *
     * @description Receive a single PixPullSubscription object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixPullSubscription object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve PixPullSubscriptions
     *
     * @description Receive a generator of PixPullSubscription objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['active', 'canceled']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixPullSubscription objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        tags: tags,
        ids: ids,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({cursor, limit, after, before, status, tags, ids, user} = {}) {
    /**
     *
     * Retrieve paged PixPullSubscriptions
     *
     * @description Receive a list of up to 100 PixPullSubscription objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call. ex: 'bf85ddf6-7d1e-4f0a-9c0a-1d2e3f4a5b6c'
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max 100. ex: 35
     * @param after [string, default null]: date filter for objects created after specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. ex: ['active', 'canceled']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixPullSubscription objects with updated attributes and cursor to retrieve the next page
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
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, {status, senderCityCode, reason, amount, amountMinLimit, due, pullRetryLimit, tags, user} = {}) {
    /**
     *
     * Update PixPullSubscription entity
     *
     * @description Update a PixPullSubscription's mutable parameters by passing its id.
     * When patching `status` to 'confirmed', `senderCityCode` MUST be present in the patch.
     *
     * Parameters (required):
     * @param id [string]: PixPullSubscription unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param status [string, default null]: new status to set. ex: 'confirmed'. When set to 'confirmed', senderCityCode is required.
     * @param senderCityCode [string, default null]: IBGE code of the payer's city. Required when status is being set to 'confirmed'. ex: "3550308"
     * @param reason [string, default null]: reason for the patch. Options: 'accountClosed', 'accountBlocked', 'invalidBranchCode', 'notRecognizedBySender', 'userRejected', 'notOffered'.
     * @param amount [integer, default null]: new amount in cents. ex: 11234 (= R$ 112.34)
     * @param amountMinLimit [integer, default null]: new amount minimum limit. ex: 1000 (= R$ 10.00)
     * @param due [string, default null]: new due date for the sender's answer. ex: "2026-04-03T12:00:00+00:00"
     * @param pullRetryLimit [integer, default null]: new max number of retries. ex: 3
     * @param tags [list of strings, default null]: new list of tags. ex: ["car", "house"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixPullSubscription with updated attributes
     *
     */
    let payload = {
        'status': status,
        'senderCityCode': senderCityCode,
        'reason': reason,
        'amount': amount,
        'amountMinLimit': amountMinLimit,
        'due': due,
        'pullRetryLimit': pullRetryLimit,
        'tags': tags,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, reason, {user} = {}) {
    /**
     *
     * Cancel a PixPullSubscription entity
     *
     * @description Cancel a PixPullSubscription entity previously created in the Stark Infra API.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     * @param reason [string]: reason why the PixPullSubscription is being cancelled. Options as receiver: 'accountClosed', 'receiverOrganizationClosed', 'receiverInternalError', 'fraud', 'receiverUserRequested'. Options as sender: 'accountClosed', 'senderDeceased', 'fraud', 'senderUserRequested'.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixPullSubscription object
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
    return Object.assign(new exports.PixPullSubscription(entity), entity);
};

exports.parse = async function (content, signature, {user} = {}) {
    /**
     *
     * Create a single verified PixPullSubscription object from a content string
     *
     * @description Create a single PixPullSubscription object from a content string received from a handler listening at
     * the subscription url. If the provided digital signature does not check out with the Stark public key, a
     * stark.error.InvalidSignatureError will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns Parsed PixPullSubscription object
     *
     */
    return parse.parseAndVerify(resource, content, signature, user);
};
