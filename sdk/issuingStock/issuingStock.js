const rest = require('../utils/rest.js');
const Resource = require('../utils/resource.js').Resource


class IssuingStock extends Resource {
    /**
     *
     * IssuingStock object
     *
     * @description The IssuingStock object represents the current stock of a certain IssuingDesign linked to an Embosser available to your workspace.
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingStock is created. ex: "5656565656565656"
     * @param balance [integer]: [EXPANDABLE] current stock balance. ex: 1000
     * @param designId [string]: IssuingDesign unique id. ex: "5656565656565656"
     * @param embosserId [string]: Embosser unique id. ex: "5656565656565656"
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000' 
     * @param created [string]: creation datetime for the IssuingDesign. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    id = null, balance = null, designId = null, embosserId = null, 
                    updated = null, created = null
                }) {
        super(id);
        this.balance = balance;
        this.designId = designId;
        this.embosserId = embosserId;
        this.updated = updated;
        this.created = created;
    }
}

exports.IssuingStock = IssuingStock;
let resource = {'class': exports.IssuingStock, 'name': 'IssuingStock'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingStock
     *
     * @description Receive a single IssuingStock object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingStock object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ 
    limit = null, after = null, before = null, designIds = null, embosserIds = null, 
    ids = null, expand = null, user = null 
} = {}) {
    /**
     *
     * Retrieve IssuingStocks
     *
     * @description Receive a generator of IssuingStock objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param designIds [list of strings, default null]: IssuingDesign unique ids. ex: ["5656565656565656", "4545454545454545"]
     * @param embosserIds [list of strings, default null]: Embosser unique ids. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param expand [list of strings, default []]: fields to expand information. ex: ["balance"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingStock objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        designIds: designIds,
        embosserIds: embosserIds,
        ids: ids,
        expand: expand
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ 
    cursor = null, limit = null, after = null, before = null, designIds = null, embosserIds = null, 
    ids = null, expand = null, user = null 
} = {}) {
    /**
     *
     * Retrieve paged IssuingStocks
     *
     * @description Receive a list of up to 100 IssuingStock objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param designIds [list of strings, default null]: IssuingDesign unique ids. ex: ["5656565656565656", "4545454545454545"]
     * @param embosserIds [list of strings, default null]: Embosser unique ids. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param expand [list of strings, default []]: fields to expand information. ex: ["balance"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingStock objects with updated attributes and cursor to retrieve the next page of IssuingStock objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        designIds: designIds,
        embosserIds: embosserIds,
        ids: ids,
        expand: expand
    };
    return rest.getPage(resource, query, user);
};
