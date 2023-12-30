const rest = require('../utils/rest.js');
const check = require('core-node').check;
const {parseObjects} = require('../utils/parse');
const Resource = require('core-node').Resource;


class IssuingTokenDesign extends Resource {
    /**
     *
     * IssuingTokenDesign object
     *
     * @description The IssuingTokenDesign object displays the information of the token designs created in your Workspace.
     * This resource represents the existent designs for the cards which will be tokenized.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingTokenDesign is created. ex: '5656565656565656'
     * @param name [string]: Design name. ex: "Stark Bank - White Metal"
     * @param created [string]: creation datetime for the IssuingTokenDesign. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingTokenDesign. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    id=null, name=null, created=null, updated=null 
                }) {
        super(id);
        
        this.name = name;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.IssuingTokenDesign = IssuingTokenDesign;
let resource = {'class': exports.IssuingTokenDesign, 'name': 'IssuingTokenDesign'};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific IssuingTokenDesign
     *
     * @description The IssuingTokenDesign describes a cardholder that may group several cards.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingTokenDesign object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, ids, user } = {}) {
    /**
     *
     * Retrieve IssuingTokenDesigns
     *
     * @description Receive a generator of IssuingTokenDesign objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingTokenDesign objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        ids: ids,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, tags, ids, expand, user } = {}) {
    /**
     *
     * Retrieve paged IssuingTokenDesigns
     *
     * @description Receive a list of IssuingTokenDesign objects previously created in the Stark Infra API and the cursor to the next page.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingTokenDesign objects with updated attributes and cursor to retrieve the next page of IssuingTokenDesign objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        ids: ids,
    };
    return rest.getPage(resource, query, user);
};

exports.pdf = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific IssuingTokenDesign pdf file
     *
     * @description Receive a single IssuingTokenDesign pdf file generated in the Stark Bank API by passing its id.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingTokenDesign pdf file
     *
     */
    return rest.getPdf(exports.resource, id, null, user);
};