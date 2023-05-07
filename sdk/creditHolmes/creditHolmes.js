const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class CreditHolmes extends Resource {
    /**
     *
     * CreditHolmes object
     *
     * @description CreditHolmes are used to obtain debt information on your customers.
     * Before you create a CreditHolmes, make sure you have your customer's express
     * authorization to verify their information in the Central Bank's SCR.
     * 
     * When you initialize a CreditHolmes, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param taxId [string]: customer's tax ID (CPF or CNPJ) for whom the credit operations will be verified. ex: "20.018.183/0001-80"
     *
     * Parameters (optional):
     * @param competence [string, default 'two months before current date']: competence month of the operation verification, format: "YYYY-MM". ex: "2021-04"
     * @param tags [list of strings, default []]: list of strings for reference when searching for CreditHolmes. ex: ["credit", "operation"]
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when the CreditHolmes is created. ex: "5656565656565656"
     * @param result [dictionary, default empty dictionary]: result of the investigation after the case is solved.
     * @param status [string]: current status of the CreditHolmes. ex: "created", "failed", "success"
     * @param created [string]: creation datetime for the CreditHolmes. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    taxId, competence = null, tags = null, id = null, result = null, 
                    status = null, created = null, updated = null 
                }) {
        super(id);
        this.taxId = taxId;
        this.competence = competence;
        this.tags = tags;
        this.id = id;
        this.result = result;
        this.status = status;
        this.created = created;
        this.updated = updated;
    }
}

exports.CreditHolmes = CreditHolmes;
let resource = {'class': exports.CreditHolmes, 'name': 'CreditHolmes'};

exports.create = async function (holmes, { user } = {}) {
    /**
     *
     * Create CreditHolmes
     *
     * @description Send a list of CreditHolmes objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param holmes [list of CreditHolmes objects]: list of CreditHolmes objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of CreditHolmes objects with updated attributes
     *
     */
    return rest.post(resource, holmes, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific CreditHolmes
     *
     * @description Receive a single CreditHolmes object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns CreditHolmes object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, tags, status, ids, user } = {}) {
    /**
     *
     * Retrieve CreditHolmes
     *
     * @description Receive a generator of CreditHolmes objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: "created", "failed", "success"
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of CreditHolmes objects with updated attributes
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
     * Retrieve paged CreditHolmes
     *
     * @description Receive a list of up to 100 CreditHolmes objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: "created", "failed", "success"
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of CreditHolmes objects with updated attributes and cursor to retrieve the next page of CreditHolmes objects
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
