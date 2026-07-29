const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;
const { parseObjects } = require('../utils/parse.js');
const { Address } = require('./address.js');
const { Owner } = require('./owner.js');
const ownerResource = require('./owner.js').subResource;


class BusinessAccountRequest extends Resource {
    /**
     *
     * BusinessAccountRequest object
     *
     * @description You can create a business account request to request an account for a specific company, opening the
     * account with identity verification by webview for each of its owners.
     *
     * When you initialize a BusinessAccountRequest, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param address [Address object]: structured address of the company. ex: new Address({street: 'Av. Faria Lima', number: '2000', neighborhood: 'Itaim Bibi', city: 'São Paulo', state: 'SP', zipCode: '04538-132'})
     * @param revenue [number]: company's annual revenue in cents. ex: 100000000
     * @param name [string]: company's legal name (minimum 5 characters). ex: 'Stark Bank S.A.'
     * @param taxId [string]: company's tax ID (CNPJ). ex: '12.345.678/0001-90'
     * @param owners [list of Owner objects]: list of 1 to 10 company owners. Each owner has taxId, name and role. ex: [new Owner({taxId: '012.345.678-90', name: 'Jamie Lannister', role: 'partner'})]
     *
     * Parameters (optional):
     * @param tags [list of strings, default null]: list of strings for reference when searching for BusinessAccountRequests. ex: ['employees', 'monthly']
     *
     * Attributes (return-only):
     * @param accountType [string]: type of the account. ex: 'business'
     * @param flags [list of dictionaries]: flags that motivated the decision, populated when the request is denied. Each flag has a code and a message.
     * @param id [string]: unique id returned when BusinessAccountRequest is created. ex: '5656565656565656'
     * @param status [string]: current status of the BusinessAccountRequest. Options: 'created', 'processing', 'approved', 'denied'
     * @param created [string]: creation datetime for the BusinessAccountRequest. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the BusinessAccountRequest. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    address, revenue, name, taxId, owners, tags = null, accountType = null, flags = null,
                    id = null, status = null, created = null, updated = null
                }) {
        super(id);
        this.address = _parseAddress(address);
        this.revenue = revenue;
        this.name = name;
        this.taxId = taxId;
        this.owners = parseObjects(owners, ownerResource, Owner);
        this.accountType = accountType;
        this.flags = flags;
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

const _parseAddress = (address) => {
    if (address) {
        return new Address({
            street: address.street,
            number: address.number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            complement: address.complement
        });
    }
    return null;
}

exports.BusinessAccountRequest = BusinessAccountRequest;
let resource = {'class': exports.BusinessAccountRequest, 'name': 'BusinessAccountRequest'};

exports.create = async function (accountRequests, { user } = {}) {
    /**
     *
     * Create BusinessAccountRequests
     *
     * @description Send a list of BusinessAccountRequest objects for creation in the Stark Infra API and receive the list of created objects.
     *
     * Parameters (required):
     * @param accountRequests [list of BusinessAccountRequest objects]: list of BusinessAccountRequest objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessAccountRequest objects with updated attributes
     *
     */
    return rest.post(resource, accountRequests, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific BusinessAccountRequest
     *
     * @description Receive a single BusinessAccountRequest object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns BusinessAccountRequest object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve BusinessAccountRequests
     *
     * @description Receive a generator of BusinessAccountRequest objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'processing', 'approved', 'denied'
     * @param tags [list of strings, default null]: list of strings for reference when searching for BusinessAccountRequests. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of BusinessAccountRequest ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessAccountRequest objects with updated attributes
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

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve paged BusinessAccountRequests
     *
     * @description Receive a list of BusinessAccountRequest objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'processing', 'approved', 'denied'
     * @param tags [list of strings, default null]: list of strings for reference when searching for BusinessAccountRequests. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of BusinessAccountRequest ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BusinessAccountRequest objects with updated attributes and a cursor to the next page
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
