const rest = require('../utils/rest.js');
const check = require('core-node').check;
const Resource = require('core-node').Resource;


class IssuingEmbossingRequest extends Resource {
    /**
     *
     * IssuingEmbossingRequest object
     * 
     * @description The IssuingEmbossingRequest object displays the information of embossing requests in your Workspace.
     * 
     * When you initialize a IssuingEmbossingRequest, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param cardId [string]: id of the IssuingCard to be embossed. ex "5656565656565656"
     * @param kitId [string]: card embossing kit id. ex "5656565656565656"
     * @param displayName1 [string]: card displayed name. ex: "ANTHONY STARK"
     * @param shippingCity [string]: shipping city. ex: "NEW YORK"
     * @param shippingCountryCode [string]: shipping country code. ex: "US"
     * @param shippingDistrict [string]: shipping district. ex: "NY"
     * @param shippingStateCode [string]: shipping state code. ex: "NY"
     * @param shippingStreetLine1 [string]: shipping main address. ex: "AVENUE OF THE AMERICAS"
     * @param shippingStreetLine2 [string]: shipping address complement. ex: "Apt. 6"
     * @param shippingService [string]: shipping service. ex: "loggi"
     * @param shippingTrackingNumber [string]: shipping tracking number. ex: "5656565656565656"
     * @param shippingZipCode [string]: shipping zip code. ex: "12345-678"
     *
     * Parameters (optional):
     * @param embosserId [string]: id of the card embosser. ex: "5656565656565656"
     * @param displayName2 [string]: card displayed name. ex: "IT Services"
     * @param displayName3 [string]: card displayed name. ex: "StarkBank S.A."
     * @param shippingPhone [string]: shipping phone. ex: "+5511999999999"
     * @param tags [list of strings, default null]: list of strings for tagging. ex: ["card", "corporate"]
     * 
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingEmbossingRequest is created. ex: "5656565656565656"
     * @param fee [integer]: fee charged when IssuingEmbossingRequest is created. ex: 1000
     * @param status [string]: status of the IssuingEmbossingRequest. ex: "created", "processing", "success", "failed"
     * @param updated [string]: latest update datetime for the IssuingEmbossingRequest. ex: '2020-03-10 10:30:00.000'
     * @param created [string]: creation datetime for the IssuingEmbossingRequest. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    cardId, kitId, displayName1, shippingCity, shippingCountryCode, shippingDistrict, 
                    shippingStateCode, shippingStreetLine1, shippingStreetLine2, shippingService, shippingTrackingNumber, 
                    shippingZipCode, embosserId = null, displayName2 = null, displayName3 = null, shippingPhone = null, 
                    tags = null, id = null, fee = null, status = null, updated = null, created = null
                }) {
        super(id);
        this.cardId = cardId;
        this.kitId = kitId;
        this.displayName1 = displayName1;
        this.shippingCity = shippingCity;
        this.shippingCountryCode = shippingCountryCode;
        this.shippingDistrict = shippingDistrict;
        this.shippingStateCode = shippingStateCode;
        this.shippingStreetLine1 = shippingStreetLine1;
        this.shippingStreetLine2 = shippingStreetLine2;
        this.shippingService = shippingService;
        this.shippingTrackingNumber = shippingTrackingNumber;
        this.shippingZipCode = shippingZipCode;
        this.embosserId = embosserId;
        this.displayName2 = displayName2;
        this.displayName3 = displayName3;
        this.shippingPhone = shippingPhone;
        this.tags = tags;
        this.fee = fee;
        this.status = status;
        this.updated = updated;
        this.created = created;
    }
}

exports.IssuingEmbossingRequest = IssuingEmbossingRequest;
let resource = {'class': exports.IssuingEmbossingRequest, 'name': 'IssuingEmbossingRequest'};

exports.create = async function (requests, { user } = {}) {
    /**
     *
     * Create IssuingEmbossingRequests
     *
     * @description Send a list of IssuingEmbossingRequest objects for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param requests [list of IssuingEmbossingRequest objects]: list of IssuingEmbossingRequest objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingEmbossingRequest objects with updated attributes
     *
     */
    return rest.post(resource, requests, user);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingEmbossingRequest
     *
     * @description Receive a single IssuingEmbossingRequest object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingEmbossingRequest object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, cardIds, ids, tags, user } = {}) {
    /**
     *
     * Retrieve IssuingEmbossingRequests
     *
     * @description Receive a generator of IssuingEmbossingRequest objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "processing", "success", "failed"]
     * @param cardIds [list of string, default null]: list of cardIds to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns generator of IssuingEmbossingRequest objects with updated attributes
     *
     */
    let query = {
        limit: limit, 
        after: after, 
        before: before, 
        status: status, 
        cardIds: cardIds, 
        ids: ids, 
        tags: tags
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, cardIds, ids, tags, user } = {}) {
    /**
     *
     * Retrieve paged IssuingEmbossingRequests
     *
     * @description Receive a list of up to 100 IssuingEmbossingRequest objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: ["created", "processing", "success", "failed"]
     * @param cardIds [list of string, default null]: list of cardIds to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of IssuingEmbossingRequest objects with updated attributes and cursor to retrieve the next page of IssuingEmbossingRequest objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit, 
        after: after, 
        before: before, 
        status: status, 
        cardIds: cardIds, 
        ids: ids, 
        tags: tags
    };
    return rest.getPage(resource, query, user);
};
