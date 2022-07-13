const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class StaticBrcode extends Resource {
    /**
     * 
     * StaticBrcode object
     * 
     * @description A StaticBrcode stores account information in the form of a PixKey and can be used to create 
     * Pix transactions easily.
     * When you initialize a StaticBrcode, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * 
     * Parameters (required):
     * @param name [string]: receiver's name. ex: 'Tony Stark'
     * @param keyId [string]: receiver's PixKey id. ex: '+5541999999999'
     * @param city [string, default São Paulo]: receiver's city name. ex: 'Rio de Janeiro'
     * 
     * Parameters (optional):
     * @param amount [integer, default 0]: positive integer that represents the amount in cents of the resulting Pix transaction. ex: 1234 (= R$ 12.34)
     * @param reconciliationId [string, default null]: id to be used for conciliation of the resulting Pix transaction. ex: '123'
     * 
     * Attributes (return-only):
     * @param id [string]: id returned on creation, this is the BR code. ex: '00020126360014br.gov.bcb.pix0114+552840092118152040000530398654040.095802BR5915Jamie Lannister6009Sao Paulo620705038566304FC6C'
     * @param uuid [string]: unique uuid returned when a StaticBrcode is created. ex: '97756273400d42ce9086404fe10ea0d6'
     * @param url [string]: url link to the BR code image. ex: 'https://brcode-h.development.starkinfra.com/static-qrcode/97756273400d42ce9086404fe10ea0d6.png'
     * @param updated [string]: latest update datetime for the StaticBrcode. ex: '2020-03-10 10:30:00.000'
     * @param created [string]: creation datetime for the StaticBrcode. ex: '2020-03-10 10:30:00.000'
     * 
     */
    constructor({name, keyId, city, amount=null, reconciliationId=null, id=null, uuid=null, url=null, updated=null, created=null}) {
        super(id);
        this.name = name;
        this.keyId = keyId;
        this.city = city;
        this.amount = amount;
        this.reconciliationId = reconciliationId;
        this.uuid = uuid;
        this.url = url;
        this.updated = check.datetime(updated);
        this.created = check.datetime(created);
    }
}

exports.StaticBrcode = StaticBrcode;
let resource = {'class': exports.StaticBrcode, 'name': 'StaticBrcode'};

exports.create = async function (brcodes, {user} = {}) {
    /**
     *
     * Create StaticBrcodes
     *
     * @description Send a list of StaticBrcode objects for creation at the Stark Infra API
     *
     * Parameters (required):
     * @param brcodes [list of StaticBrcode objects]: list of StaticBrcode objects to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of StaticBrcode objects with updated attributes
     *
     */
    return rest.post(resource, brcodes, user);
};

exports.get = async function (uuid, {user} = {}) {
    /**
     *
     * Retrieve a specific StaticBrcode
     *
     * @description Receive a single StaticBrcode object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param uuid [string]: object's unique uuid. ex: '97756273400d42ce9086404fe10ea0d6'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns StaticBrcode object with updated attributes
     *
     */
    return rest.getId(resource, uuid, user);
};

exports.query = async function ({ limit, after, before, uuids, user } = {}) {
    /**
     *
     * Retrieve StaticBrcodes
     *
     * @description Receive a generator of StaticBrcode objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param uuids [list of strings, default null]: list of uuids to filter retrieved objects. ex: ['97756273400d42ce9086404fe10ea0d6', 'e3da0b6d56fa4045b9b295b2be82436e']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call     
     *
     * Return:
     * @returns generator of StaticBrcode objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        uuids: uuids,
        user: user,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, uuids, user } = {}) {
    /**
     *
     * Retrieve paged StaticBrcodes
     *
     * @description Receive a list of up to 100 StaticBrcode objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param uuids [list of strings, default null]: list of uuids to filter retrieved objects. ex: ['97756273400d42ce9086404fe10ea0d6', 'e3da0b6d56fa4045b9b295b2be82436e']
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of StaticBrcode objects with updated attributes and cursor to retrieve the next page of StaticBrcode objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        uuids: uuids,
        user: user,
    };
    return rest.getPage(resource, query, user);
};

exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create single verified IssuingPurchase authorization request from a content string
     *
     * @description Use this method to parse and verify the authenticity of the authorization request received at the informed endpoint.
     * Authorization requests are posted to your registered endpoint whenever IssuingPurchases are received.
     * They present IssuingPurchase data that must be analyzed and answered with approval or declination.
     * If the provided digital signature does not check out with the StarkInfra public key, a stark.exception.InvalidSignatureException will be raised.
     * If the authorization request is not answered within 2 seconds or is not answered with an HTTP status code 200 the IssuingPurchase will go through the pre-configured stand-in validation.
     * 
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @return Parsed IssuingPurchase object
     *
     */
    return parse.parseAndVerify(resource, content, signature, user);
};

exports.response = async function (status, {amount, reason, tags} = {}) {
    /**
     *
     * Helps you respond IssuingPurchase requests
     *
     * Parameters (required):
     * @param status [string]: sub-issuer response to the authorization. Options: 'approved' or 'denied'
     *
     * Parameters (conditionally required):
     * @param reason [string]: denial reason. Options: 'other', 'blocked', 'lostCard', 'stolenCard', 'invalidPin', 'invalidCard', 'cardExpired', 'issuerError', 'concurrency', 'standInDenial', 'subIssuerError', 'invalidPurpose', 'invalidZipCode', 'invalidWalletId', 'inconsistentCard', 'settlementFailed', 'cardRuleMismatch', 'invalidExpiration', 'prepaidInstallment', 'holderRuleMismatch', 'insufficientBalance', 'tooManyTransactions', 'invalidSecurityCode', 'invalidPaymentMethod', 'confirmationDeadline', 'withdrawalAmountLimit', 'insufficientCardLimit', 'insufficientHolderLimit'
     * 
     * Parameters (optional):
     * @param amount [integer, default null]: amount in cents that was authorized. ex: 1234 (= R$ 12.34)
     * @param tags [list of strings, default null]: tags to filter retrieved object. ex: ['tony', 'stark']
     *
     * Return:
     * @return Dumped JSON string that must be returned to us on the IssuingPurchase request
     *
     */
    return JSON.stringify({'authorization': {
        'status': status,
        'amount': amount ? amount : 0,
        'reason': reason ? reason : '',
        'tags': tags ? tags : [],
    }});
};
