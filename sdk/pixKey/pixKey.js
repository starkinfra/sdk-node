const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class PixKey extends Resource {
    /**
     *
     * PixKey object
     *
     * @description PixKeys link bank account information to key ids.
     * Key ids are a convenient way to search and pass bank account information.
     * When you initialize a Pix Key, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param accountCreated [string]: opening Date or DateTime for the linked account. ex: '2022-01-01T12:00:00:00'.
     * @param accountNumber [string]: number of the linked account. ex: '76543'.
     * @param accountType [string]: type of the linked account. Options: 'checking', 'savings', 'salary' or 'payment'.
     * @param branchCode [string]: branch code of the linked account. ex: 1234'.
     * @param name [string]: holder's name of the linked account. ex: 'Jamie Lannister'.
     * @param taxId [string]: holder's taxId (CPF/CNPJ) of the linked account. ex: '012.345.678-90'.
     *
     * Parameters (optional):
     * @param id [string, default null]: id of the registered PixKey. Allowed types are: CPF, CNPJ, phone number or email. If this parameter is not passed, an EVP will be created. ex: '+5511989898989';
     * @param tags [list of strings, default null]: list of strings for reference when searching for PixKeys. ex: ['employees', 'monthly']
     *
     * Attributes (return-only):
     * @param owned [string]: datetime when the key was owned by the holder. ex: '2022-01-01T12:00:00:00'.
     * @param ownerType [string]: type of the owner of the PixKey. Options: 'business' or 'individual'.
     * @param status [string]: current PixKey status. Options: 'created', 'registered', 'canceled', 'failed'
     * @param bankCode [string]: bankCode of the account linked to the Pix Key. ex: '20018183'.
     * @param bankName [string]: name of the bank that holds the account linked to the PixKey. ex: 'StarkBank'
     * @param type [string]: type of the PixKey. Options: 'cpf', 'cnpj', 'phone', 'email' and 'evp',
     * @param created [string]: creation datetime for the PixKey. ex: '2022-01-01T12:00:00:00'.
     *
     */
    constructor({ 
                    accountCreated, accountNumber, accountType, branchCode, name, 
                    taxId, id = null, tags = null, owned = null, ownerType = null, 
                    status = null, bankCode = null, bankName = null, type = null, 
                    created = null 
                }) {
        super(id);

        this.accountCreated = check.datetime(accountCreated);
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.branchCode = branchCode;
        this.name = name;
        this.taxId = taxId;
        this.tags = tags;
        this.owned = check.datetime(owned);
        this.ownerType = ownerType;
        this.status = status;
        this.bankCode = bankCode;
        this.bankName = bankName;
        this.type = type;
        this.created = check.datetime(created);
    }
}

exports.PixKey = PixKey;
let resource = {'class': exports.PixKey, 'name': 'PixKey'};

exports.create = async function (report, {user} = {}) {
    /**
     *
     * Create a PixKey object
     *
     * @description Create a PixKey linked to a specific account in the Stark Infra API
     *
     * Parameters (required):
     * @param key [PixKey object]: PixKey object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixKey object with updated attributes.
     *
     */
    return rest.postSingle(resource, report, user);
};

exports.get = async function (id, payerId, { endToEndId, user } = {}) {
    /**
     *
     * Retrieve a PixKey object
     *
     * @description Retrieve the PixKey object linked to your Workspace in the Stark Infra API by its id.
     *
     * Parameters (required):
     * @param id [string]: PixKey object unique id. ex: '5656565656565656'
     * @param payerId [string]: tax id (CPF/CNPJ) of the individual or business requesting the PixKey information. This id is used by the Central Bank to limit request rates. ex: '20.018.183/0001-80'.
     *
     * Parameters (optional):
     * @param endToEndId [string, default null]: central bank's unique transaction id. If the request results in the creation of a PixRequest, the same endToEndId should be used. If this parameter is not passed, one endToEndId will be automatically created. Example: 'E00002649202201172211u34srod19le'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixKey object that corresponds to the given id.
     *
     */
    return rest.getId(resource, id, user, {'payerId': payerId, 'endToEndId': endToEndId});
};

exports.query = async function ({ limit, after, before, status, tags, ids, type, user } = {}) {
    /**
     *
     * Retrieve PixKeys
     *
     * @description Receive a generator of PixKey objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param type [string, default null]: filter for the type of retrieved PixKeys. Options: 'cpf', 'cnpj', 'phone', 'email' and 'evp'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of PixKey objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: check.date(after),
        before: check.date(before),
        status: status,
        tags: tags,
        ids: ids,
        type: type,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, type, user } = {}) {
    /**
     *
     * Retrieve paged PixKeys
     *
     * @description Receive a list of up to 100 PixKey objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: 'created', 'failed', 'delivered', 'closed', 'canceled'.
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param type [string, default null]: filter for the type of retrieved PixKeys. Options: 'cpf', 'cnpj', 'phone', 'email' and 'evp'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of PixKey objects with updated attributes and cursor to retrieve the next page of PixKey objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: check.date(after),
        before: check.date(before),
        status: status,
        tags: tags,
        ids: ids,
        type: type,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function ( id, reason, { accountCreated, accountNumber, accountType, branchCode, name, user }) {
    /**
     *
     * Update PixKey entity
     *
     * @description Update a PixKey parameters by passing its id.
     *
     * Parameters (required):
     * @param id [string]: PixKey id. ex: '5656565656565656'
     * @param reason [string]: reason why the PixKey is being patched. Options: 'branchTransfer', 'reconciliation' or 'userRequested'.
     *
     * Parameters (optional):
     * @param accountCreated [string, default null]: opening Date or DateTime for the account to be linked. ex: '2022-01-01.
     * @param accountNumber [string, default null]: number of the account to be linked. ex: '76543'.
     * @param accountType [string, default null]: type of the account to be linked. Options: 'checking', 'savings', 'salary' or 'payment'.
     * @param branchCode [string, default null]: branch code of the account to be linked. ex: 1234'.
     * @param name [string, default null]: holder's name of the account to be linked. ex: 'Jamie Lannister'.
     *
     * Return:
     * @returns PixKey with updated attributes
     *
     */
    let payload = {
        'reason': reason,
        'accountCreated': accountCreated,
        'accountNumber': accountNumber,
        'accountType': accountType,
        'branchCode': branchCode,
        'name': name,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel the PixKey object by its id
     *
     * @description Cancel a PixKey object linked to your Workspace in the Stark Infra API.
     * This will also remove the link this participant has with the Central Bank.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled PixKey object with updated attributes
     *
     */
    return rest.deleteId(resource, id, user);
};
