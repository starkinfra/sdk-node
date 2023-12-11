const api = require('../utils/api.js');
const rest = require('../utils/rest.js');
const parse = require('../utils/parse.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class IssuingToken extends Resource {
    /**
     *
     * IssuingToken object
     *
     * @description The IssuingToken object displays the information of the tokens created in your Workspace.
     *
     * Attributes (return-only):
     * @param cardId [string]: card ID which the token is bounded to. ex: '5656565656565656'
     * @param walletId [string]: wallet provider which the token is bounded to. ex: 'google'
     * @param walletName [string]: wallet name. ex: 'GOOGLE'
     * @param merchantId [string]: merchant unique id. ex: '5656565656565656'
     * 
     * Attributes (IssuingToken only):
     * @param id [string]: unique id returned when IssuingToken is created. ex: '5656565656565656'
     * @param externalId [string]: a unique string among all your IssuingTokens, used to avoid resource duplication. ex: 'DSHRMC00002626944b0e3b539d4d459281bdba90c2588791'
     * @param tags [list of string]: list of strings for reference when searching for IssuingToken. ex: ['employees', 'monthly']
     * @param status [string]: current IssuingToken status. ex: 'active', 'blocked', 'canceled', 'frozen' or 'pending'
     * @param created [string]: creation datetime for the IssuingToken. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingToken. ex: '2020-03-10 10:30:00.000'
     * 
     * Attributes (Authorization request only):
     * @param methodCode [string]: provisioning method. Options: 'app', 'token', 'manual', 'server' or 'browser'
     * @param deviceType [string]: device type used for tokenization. ex: 'Phone'
     * @param deviceName [string]: device name used for tokenization. ex: 'My phone' 
     * @param deviceSerialNumber [string]: device serial number used for tokenization. ex: '2F6D63'
     * @param deviceOsName [string]: device operational system name used for tokenization. ex: 'Android'
     * @param deviceOsVersion [string]: device operational system version used for tokenization. ex: '4.4.4'
     * @param deviceImei [string]: device imei used for tokenization. ex: '352099001761481'
     * @param walletInstanceId [string]: unique id referred to the wallet app in the current device. ex: '71583be4777eb89aaf0345eebeb82594f096615ed17862d0'
     *
     */
    constructor({ 
                    cardId=null, walletId=null, walletName=null, merchantId=null, id=null, externalId=null, 
                    tags=null, status=null, created=null, updated=null, methodCode=null, deviceType=null, 
                    deviceName=null, deviceSerialNumber=null, deviceOsName=null, deviceOsVersion=null, 
                    deviceImei=null, walletInstanceId=null
                }) {
        super(id);

        this.cardId = cardId;
        this.walletId = walletId;
        this.walletName = walletName;
        this.merchantId = merchantId;
        this.externalId = externalId;
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
        this.methodCode = methodCode;
        this.deviceType = deviceType;
        this.deviceName = deviceName;
        this.deviceSerialNumber = deviceSerialNumber;
        this.deviceOsName = deviceOsName;
        this.deviceOsVersion = deviceOsVersion;
        this.deviceImei = deviceImei;
        this.walletInstanceId = walletInstanceId;
    }
}

exports.IssuingToken = IssuingToken;
let resource = {'class': exports.IssuingToken, 'name': 'IssuingToken'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingToken
     *
     * @description Receive a single IssuingToken object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingToken object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, cardIds, tags, ids, user, externalIds } = {}) {
    /**
     *
     * Retrieve IssuingTokens
     *
     * @description Receive a generator of IssuingToken objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param cardIds [list of strings, default []]: card  IDs. ex: ['5656565656565656', '4545454545454545']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     * @param externalIds [list of strings, default []]:  external IDs. ex: ['my_external_id1', 'my_external_id2']
     *
     * Return:
     * @returns generator of IssuingToken objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        cardIds: cardIds,
        tags: tags,
        ids: ids,
        externalIds: externalIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, cardIds, tags, ids, user, externalIds } = {}) {
    /**
     *
     * Retrieve paged IssuingTokens
     *
     * @description Receive a list of up to 100 Purchase objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param cardIds [list of strings, default []]: card  IDs. ex: ['5656565656565656', '4545454545454545']
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     * @param externalIds [list of strings, default []]: external IDs. ex: ['my_external_id1', 'my_external_id2']
     *
     * Return:
     * @returns list of IssuingToken objects with updated attributes and cursor to retrieve the next page of IssuingToken objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        cardIds: cardIds,
        tags: tags,
        ids: ids,
        externalIds: externalIds,
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function (id, { status, user } = {}) {
    /**
     *
     * Update IssuingToken entity
     *
     * @description Update an IssuingToken by passing id.
     *
     * Parameters (required):
     * @param id [string]: IssuingToken id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param status [string]: You may block the IssuingToken by passing 'blocked' or activate by passing 'active' in the status. ex: 'active', 'blocked'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns target IssuingToken with updated attributes
     *
     */
    let payload = {
        status: status
    };
    return rest.patchId(resource, id, payload, user);
};


exports.cancel = async function (id, {user} = {}) {
    /**
     *
     * Cancel an IssuingToken entity
     *
     * @description Cancel an IssuingToken entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: IssuingToken unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns canceled IssuingToken object
     *
     */
    return rest.deleteId(resource, id, user);
};

exports.parse = async function (content, signature, {user} = {}) {
    /**
     *
     * Create a single verified IssuingToken request from a content string
     *
     * @description Use this method to parse and verify the authenticity of the request received at the informed endpoint.
     * Token requests are posted to your registered endpoint whenever IssuingTokens are received.
     * If the provided digital signature does not check out with the StarkInfra public key, a stark.exception.InvalidSignatureException will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @return Parsed IssuingToken object
     *
     */
    return parse.parseAndVerify(resource, content, signature, user);
};

exports.responseAuthorization = async function (status, { reason, activationMethods, designId, tags } = {}) {
    /**
     *
     * Helps you respond IssuingToken authorization requests
     *
     * @description When a new tokenization is triggered by your user, a POST request will be made to your registered URL to get your decision to complete the tokenization.
     * The POST request must be answered in the following format, within 2 seconds, and with an HTTP status code 200.
     *
     * Parameters (required):
     * @param status [string]: sub-issuer response to the authorization. Options: 'approved' or 'denied'
     * 
     * Parameters (conditionally required):
     * @param reason [string, default null]: denial reason. Options: 'other', 'bruteForce', 'subIssuerError', 'lostCard', 'invalidCard', 'invalidHolder', 'expiredCard', 'canceledCard', 'blockedCard', 'invalidExpiration', 'invalidSecurityCode', 'missingTokenAuthorizationUrl', 'maxCardTriesExceeded', 'maxWalletInstanceTriesExceeded'
     * @param activationMethods [dictionary object, default {}]: dictionary object with 'type':string and 'value':string pairs
     * @param designId [string, default null]: design unique id. ex: '5656565656565656'
     * 
     * Parameters (optional):
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * Return:
     * @return Dumped JSON string that must be returned to us on the IssuingToken request
     *
     */
    let response = {
        'authorization': {
            'status': status,
            'reason': reason,
            'activationMethods': activationMethods,
            'designId': designId,
            'tags': tags,
        }
    };
    api.removeNullKeys(response);
    return JSON.stringify(response);
};

exports.responseActivation = async function (status, { reason, tags } = {}) {
    /**
     *
     * Helps you respond IssuingToken activation requests
     *
     * @description When a new token activation is triggered by your user, a POST request will be made to your registered URL for you to confirm the activation code you informed to them. You may identify this request through the present activation_code in the payload.
     * The POST request must be answered in the following format, within 2 seconds, and with an HTTP status code 200.
     *
     * Parameters (required):
     * @param status [string]: sub-issuer response to the authorization. Options: 'approved' or 'denied'
     * 
     * Parameters (optional):
     * @param reason [string, default null]: denial reason. Options: 'other', 'bruteForce', 'subIssuerError', 'lostCard', 'invalidCard', 'invalidHolder', 'expiredCard', 'canceledCard', 'blockedCard', 'invalidExpiration', 'invalidSecurityCode', 'missingTokenAuthorizationUrl', 'maxCardTriesExceeded', 'maxWalletInstanceTriesExceeded'
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * 
     * Return:
     * @return Dumped JSON string that must be returned to us on the IssuingToken request
     *
     */
    let response = {
        'authorization': {
            'status': status,
            'reason': reason,
            'tags': tags,
        }
    };
    api.removeNullKeys(response);
    return JSON.stringify(response);
};
