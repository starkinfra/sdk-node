const rest = require('../utils/rest.js');
const {parseObjects} = require('../utils/parse.js');
const Resource = require('starkcore').Resource;
const {IssuingDesign} = require('../issuingDesign/issuingDesign.js');
const issuingDesignResource = require('../issuingDesign/issuingDesign.js').resource;


class IssuingEmbossingKit extends Resource {
    /**
     *
     * IssuingEmbossingKit object
     *
     * @description The IssuingEmbossingKit object displays information on the embossing kits available to your Workspace.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingEmbossingKit is created. ex: "5656565656565656"
     * @param name [string]: card or package design name. ex: " stark-plastic-dark-001"
     * @param designs [list of IssuingDesign objects]: list of IssuingDesign objects. ex: [new IssuingDesign({}), new IssuingDesign({})]
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000' 
     * @param created [string]: creation datetime for the IssuingEmbossingKit. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    id = null, name = null, designs = null, updated = null, created = null
                }) {
        super(id);
        this.name = name;
        this.designs = parseObjects(designs, issuingDesignResource, IssuingDesign);
        this.updated = updated;
        this.created = created;
    }
}

exports.IssuingEmbossingKit = IssuingEmbossingKit;
let resource = {'class': exports.IssuingEmbossingKit, 'name': 'IssuingEmbossingKit'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingEmbossingKit
     *
     * @description Receive a single IssuingEmbossingKit object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingEmbossingKit object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, designIds, ids, user } = {}) {
    /**
     *
     * Retrieve IssuingEmbossingKits
     *
     * @description Receive a generator of IssuingEmbossingKit objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "processing", "success", "failed"]
     * @param designIds [list of string, default null]: list of designIds to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingEmbossingKit objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after, 
        before: before, 
        status: status, 
        designIds: designIds, 
        ids: ids
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, designIds, status, ids, user } = {}) {
    /**
     *
     * Retrieve paged IssuingEmbossingKits
     *
     * @description Receive a list of up to 100 IssuingEmbossingKit objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "processing", "success", "failed"]
     * @param designIds [list of string, default null]: list of designIds to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingEmbossingKit objects with updated attributes and cursor to retrieve the next page of IssuingEmbossingKit objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after, 
        before: before, 
        status: status, 
        designIds: designIds, 
        ids: ids
    };
    return rest.getPage(resource, query, user);
};
