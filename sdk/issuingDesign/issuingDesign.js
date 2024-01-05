const rest = require('../utils/rest.js');
const Resource = require('starkcore').Resource;


class IssuingDesign extends Resource {
    /**
     *
     * IssuingDesign object
     *
     * @description The IssuingDesign object displays information on the card and card package designs available to your Workspace.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingDesign is created. ex: "5656565656565656"
     * @param name [string]: card or package design name. ex: " stark-plastic-dark-001"
     * @param embosserIds [list of strings]: list of embosser unique ids. ex: ["5136459887542272", "5136459887542273"]
     * @param type [string]: card or package design type. Options: "card", "envelope"
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000' 
     * @param created [string]: creation datetime for the IssuingDesign. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    id = null, name = null, embosserIds = null, type = null, 
                    updated = null, created = null, 
                }) {
        super(id);
        this.name = name;
        this.embosserIds = embosserIds;
        this.type = type;
        this.updated = updated;
        this.created = created;
    }
}

exports.IssuingDesign = IssuingDesign;
exports.resource = {'class': exports.IssuingDesign, 'name': 'IssuingDesign'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingDesign
     *
     * @description Receive a single IssuingDesign object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingDesign object with updated attributes
     *
     */
    return rest.getId(exports.resource, id, user);
};

exports.query = async function ({ limit, ids, user } = {}) {
    /**
     *
     * Retrieve IssuingDesigns
     *
     * @description Receive a generator of IssuingDesign objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingDesign objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        ids: ids
    };
    return rest.getList(exports.resource, query, user);
};

exports.page = async function ({ cursor, limit, ids, user } = {}) {
    /**
     *
     * Retrieve paged IssuingDesigns
     *
     * @description Receive a list of up to 100 IssuingDesign objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingDesign objects with updated attributes and cursor to retrieve the next page of IssuingDesign objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        ids: ids
    };
    return rest.getPage(exports.resource, query, user);
};

exports.pdf = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific IssuingDesign pdf file
     *
     * @description Receive a single IssuingDesign pdf file generated in the Stark Bank API by passing its id.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingDesign pdf file
     *
     */
    return rest.getContent(exports.resource, id, null, user, 'pdf');
};
