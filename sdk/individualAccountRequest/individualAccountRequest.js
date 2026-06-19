const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;
const { Address } = require('./address.js');


class IndividualAccountRequest extends Resource {
    /**
     *
     * IndividualAccountRequest object
     *
     * @description You can create an individual account request to request an account for a specific individual.
     * 
     * When you initialize a IndividualAccountRequest, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param address [Address object]: structured residential address of the individual. ex: new Address({street: 'R. Pamplona', number: '123', neighborhood: 'Jardim Paulista', city: 'São Paulo', state: 'SP', zipCode: '01405030'})
     * @param income [number]: Income of the individual. ex: 5000
     * @param name [string]: Name of the individual. ex: 'John Doe'
     * @param taxId [string]: Tax ID of the individual. ex: '012.345.678-90'
     *
     * Parameters (optional):
     * @param birthDate [string, default null]: birth date of the individual. ex: '2012-03-06'
     * @param tags [list of strings, default []]: list of strings for reference when searching for IndividualAccountRequests. ex: ['employees', 'monthly']
     *
     * Attributes (return-only):
     * @param accountType [string]: type of the account. ex: "individual"
     * @param flags [string]: flags associated with the IndividualAccountRequest.
     * @param id [string]: unique id returned when IndividualAccountRequest is created. ex: '5656565656565656'
     * @param status [string]: current status of the IndividualAccountRequest. Options: 'created', 'canceled', 'processing', 'failed', 'success'
     * @param created [string]: creation datetime for the IndividualAccountRequest. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IndividualAccountRequest. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    address, income, name, taxId, birthDate = null, tags = null, accountType = null, flags = null,
                    id = null, status = null, created = null, updated = null
                }) {
        super(id);
        this.address = _parseAddress(address);
        this.income = income;
        this.name = name;
        this.taxId = taxId;
        this.birthDate = check.date(birthDate);
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
            zipCode: address.zipCode
        });
    }
    return null;
}

exports.IndividualAccountRequest = IndividualAccountRequest;
let resource = {'class': exports.IndividualAccountRequest, 'name': 'IndividualAccountRequest'};

exports.create = async function (accountRequests, { user } = {}) {
    /**
     *
     * Create IndividualAccountRequests
     *
     * @description Send a list of IndividualAccountRequest objects for creation in the Stark Infra API and receive the list of created objects.
     *
     * Parameters (required):
     * @param accountRequests [list of IndividualAccountRequest objects]: list of IndividualAccountRequest objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IndividualAccountRequest objects with updated attributes
     *
     */
    return rest.post(resource, accountRequests, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IndividualAccountRequest
     *
     * @description Receive a single IndividualAccountRequest object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IndividualAccountRequest object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, tags, ids, user } = {}) {
    /**
     *
     * Retrieve IndividualAccountRequests
     *
     * @description Receive a generator of IndividualAccountRequest objects previously created in the Stark Infra API and the cursor to the next page. 
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'canceled', 'processing', 'failed', 'success'
     * @param tags [list of strings, default null]: list of strings for reference when searching for IndividualAccountRequests. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of IndividualAccountRequest ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IndividualAccountRequest objects with updated attributes
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
     * Retrieve paged IndividualAccountRequests
     *
     * @description Receive a list of IndividualAccountRequest objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null]: date filter for objects created after this date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before this date. ex: '2020-03-10'
     * @param status [string, default null]: filter for status of the retrieved objects. ex: 'created', 'canceled', 'processing', 'failed', 'success'
     * @param tags [list of strings, default null]: list of strings for reference when searching for IndividualAccountRequests. ex: ['employees', 'monthly']
     * @param ids [list of strings, default null]: list of IndividualAccountRequest ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IndividualAccountRequest objects with updated attributes and a cursor to the next page
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

exports.update = async function (id, { address, income, name, taxId, birthDate, status, tags, user } = {}) {
    /**
     * Parameters (required):
     * @param id [string]: IndividualAccountRequest id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param address [Address object]: structured residential address of the individual. ex: new Address({street: 'R. Pamplona', number: '123', neighborhood: 'Jardim Paulista', city: 'São Paulo', state: 'SP', zipCode: '01405030'})
     * @param income [number]: Income of the individual. ex: 5000
     * @param name [string]: Name of the individual. ex: 'John Doe'
     * @param taxId [string]: Tax ID of the individual. ex: '012.345.678-90'
     * @param birthDate [string]: birth date of the individual. ex: '2012-03-06'
     * @param status [string]: Status of the individual account request. ex: 'processing'
     * @param tags [list of strings, default []]: list of strings for reference when searching for IndividualAccountRequests. ex: ['employees', 'monthly']
     * @param user [Organization/Project object]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IndividualAccountRequest object with updated attributes
     *
     */
    let payload = {
        address: address,
        income: income,
        name: name,
        taxId: taxId,
        birthDate: check.date(birthDate),
        status: status,
        tags: tags
    };
    return rest.patchId(resource, id, payload, user);
}
