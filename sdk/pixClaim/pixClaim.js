const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class PixClaim extends Resource {
    /**
     *
     * PixClaim object
     *
     * @description PixClaims intend to transfer a PixKey from one account to another.
     * When you initialize a PixClaim, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param accountCreated [string]: opening Date or DateTime for the account claiming the PixKey. ex: '2022-01-01'.
     * @param accountNumber [string]: number of the account claiming the PixKey. ex: '76543'.
     * @param accountType [string]: type of the account claiming the PixKey. Options: 'checking', 'savings', 'salary' or 'payment'.
     * @param branchCode [string]: branch code of the account claiming the PixKey. ex: 1234'.
     * @param name [string]: holder's name of the account claiming the PixKey. ex: 'Jamie Lannister'.
     * @param taxId [string]: holder's taxId of the account claiming the PixKey (CPF/CNPJ). ex: '012.345.678-90'.
     * @param keyId [string]: id of the registered Pix Key to be claimed. Allowed keyTypes are CPF, CNPJ, phone number or email. ex: '+5511989898989'.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the PixClaim is created. ex: '5656565656565656'
     * @param status [string]: current PixClaim status. Options: 'created', 'failed', 'delivered', 'confirmed', 'success', 'canceled'
     * @param type [string]: type of Pix Claim. Options: 'ownership', 'portability'.
     * @param keyType [string]: keyType of the claimed PixKey. Options: 'CPF', 'CNPJ', 'phone' or 'email'
     * @param agent [string]: Options: 'claimer' if you requested the PixClaim or 'claimed' if you received a PixClaim request.
     * @param bankCode [string]: bankCode of the account linked to the PixKey being claimed. ex: '20018183'.
     * @param claimedBankCode [string]: bankCode of the account donating the PixKey. ex: '20018183'.
     * @param created [string]: creation datetime for the PixClaim. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the PixClaim. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    accountCreated, accountNumber, accountType, branchCode, name, taxId, id = null, keyId = null, status = null,
                    type = null, keyType = null, agent = null, bankCode = null, claimedBankCode = null,
                    created = null, updated = null
                }) {
        super(id);

        this.accountCreated = check.datetime(accountCreated);
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.branchCode = branchCode;
        this.name = name;
        this.taxId = taxId;
        this.keyId = keyId;
        this.status = status;
        this.type = type;
        this.keyType = keyType;
        this.agent = agent;
        this.bankCode = bankCode;
        this.claimedBankCode = claimedBankCode;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.PixClaim = PixClaim;
let resource = {'class': exports.PixClaim, 'name': 'PixClaim'};

exports.create = async function (claim, {user} = {}) {
    /**
     *
     * Create a PixClaim object
     *
     * @description Create a PixClaim to request the transfer of a PixKey to an account hosted at other Pix participants in the Stark Infra API.
     *
     * Parameters (required):
     * @param claim [PixClaim object]: PixClaim object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixClaim object with updated attributes.
     *
     */
    return rest.postSingle(resource, claim, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a PixClaim object
     *
     * @description Retrieve a PixClaim object linked to your Workspace in the Stark Infra API by its id.
     *
     * Parameters (required):
     * @param id [string]: PixClaim object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixClaim object that corresponds to the given id.
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, ids, type, agent, keyType, keyId, user } = {}) {
    /**
     *
     * Retrieve PixClaims
     *
     * @description Receive a generator of PixClaim objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020, 3, 10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020, 3, 10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'confirmed', 'success', 'canceled'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param type [strings, default null]: filter for the type of retrieved PixClaims. Options: 'ownership' or 'portability'.
     * @param agent [string, default null]: filter for the agent of retrieved PixClaims. Options: 'claimer' or 'claimed'.
     * @param keyType [string, default null]: filter for the PixKey type of retrieved PixClaims. Options: 'cpf', 'cnpj', 'phone', 'email' and 'evp',
     * @param keyId [string, default null]: filter PixClaims linked to a specific PixKey id. Example: '+5511989898989'.
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixClaim objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: check.date(after),
        before: check.date(before),
        status: status,
        ids: ids,
        type: type,
        agent: agent,
        keyType: keyType,
        keyId: keyId,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, ids, type, agent, keyType, keyId, user } = {}) {
    /**
     *
     * Retrieve paged PixClaims
     *
     * @description Receive a list of up to 100 PixClaims objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call.
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020, 3, 10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020, 3, 10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'confirmed', 'success', 'canceled'
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param type [strings, default null]: filter for the type of retrieved PixClaims. Options: 'ownership' or 'portability'.
     * @param agent [string, default null]: filter for the agent of retrieved PixClaims. Options: 'claimer' or 'claimed'.
     * @param keyType [string, default null]: filter for the PixKey type of retrieved PixClaims. Options: 'cpf', 'cnpj', 'phone', 'email' and 'evp',
     * @param keyId [string, default null]: filter PixClaims linked to a specific PixKey id. Example: '+5511989898989'.
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixClaim objects with updated attributes and cursor to retrieve the next page of PixClaim objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: check.date(after),
        before: check.date(before),
        status: status,
        ids: ids,
        type: type,
        agent: agent,
        keyType: keyType,
        keyId: keyId,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function ( id, status, { reason, user } = {}) {
    /**
     *
     * Update PixClaim entity
     *
     * @description Update a PixClaim parameters by passing id.
     *
     * Parameters (required):
     * @param id [string]: PixClaim id. ex: '5656565656565656'
     * @param status [string]: patched status for Pix Claim. Options: 'confirmed' and 'canceled'
     *
     * Parameters (optional):
     * @param reason [string, default: 'userRequested']: reason why the PixClaim is being patched. Options: 'fraud', 'userRequested', 'accountClosure'.
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixClaim objects with updated attributes and cursor to retrieve the next page of PixClaim objects
     *
     */
    let payload = {
        'status': status,
        'reason': reason,
    };
    return rest.patchId(resource, id, payload, user);
};
