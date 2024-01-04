const rest = require('../utils/rest.js');
const api = require('core-node').api;
const parse = require('../utils/parse.js');
const check = require('core-node').check;
const Resource = require('core-node').Resource;


class IssuingPurchase extends Resource {
    /**
     *
     * IssuingPurchase object
     *
     * @description Displays the IssuingPurchase objects created in your Workspace.
     *
     * Attributes (return-only):
     * @param holderName [string]: cardholder's name. ex: 'Tony Stark'
     * @param productId [string]: unique card product number (BIN) registered within the card network. ex: '53810200'
     * @param cardId [string]: unique id returned when IssuingCard is created. ex: '5656565656565656'
     * @param cardEnding [string]: last 4 digits of the card number. ex: '1234'
     * @param purpose [string]: purchase purpose. ex: 'purchase'
     * @param amount [integer]: IssuingPurchase value in cents. Minimum = 0. ex: 1234 (= R$ 12.34)
     * @param tax [integer]: IOF amount taxed for international purchases. ex: 1234 (= R$ 12.34)
     * @param issuerAmount [integer]: issuer amount. ex: 1234 (= R$ 12.34)
     * @param issuerCurrencyCode [string]: issuer currency code. ex: 'USD'
     * @param issuerCurrencySymbol [string]: issuer currency symbol. ex: '$'
     * @param merchantAmount [integer]: merchant amount. ex: 1234 (= R$ 12.34)
     * @param merchantCurrencyCode [string]: merchant currency code. ex: 'USD'
     * @param merchantCurrencySymbol [string]: merchant currency symbol. ex: '$'
     * @param merchantCategoryCode [string]: merchant category code. ex: 'eatingPlacesRestaurants'
     * @param merchantCategoryType [string]: merchant category type. ex: 'food'
     * @param merchantCountryCode [string]: merchant country code. ex: 'USA'
     * @param acquirerId [string]: acquirer ID. ex: '5656565656565656'
     * @param merchantId [string]: merchant ID. ex: '5656565656565656'
     * @param merchantName [string]: merchant name. ex: 'Google Cloud Platform'
     * @param merchantFee [integer]: fee charged by the merchant to cover specific costs, such as ATM withdrawal logistics, etc. ex: 200 (= R$ 2.00)
     * @param walletId [string]: virtual wallet ID. ex: '5656565656565656'
     * @param methodCode [string]: method code. Options: 'chip', 'token', 'server', 'manual', 'magstripe' or 'contactless'
     * @param score [float]: internal score calculated for the authenticity of the purchase. ex: 7.6
     * @param endToEndId [string]: Unique id used to identify the transaction through all of its life cycle, even before the purchase is denied or accepted and gets its usual id. ex: '679cd385-642b-49d0-96b7-89491e1249a5'
     * @param tags [list of string]: list of strings for tagging. ex: ['travel', 'food']
     * 
     * Attributes (IssuingPurchase only):
     * @param id [string]: unique id returned when IssuingPurchase is created. ex: '5656565656565656'
     * @param issuingTransactionIds [string]: ledger transaction ids linked to this Purchase
     * @param status [string]: current IssuingCard status. Options: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param description [string]: IssuingPurchase description. ex: 'Office Supplies'
     * @param metadata [dictionary object]: dictionary object used to store additional information about the IssuingPurchase object. ex: { authorizationId: 'OjZAqj' }.
     * @param zipCode [string]: zip code of the merchant location. ex: '02101234'
     * @param created [string]: creation datetime for the IssuingPurchase. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the IssuingPurchase. ex: '2020-03-10 10:30:00.000'
     * 
     * Attributes (Authorization request only):
     * @param isPartialAllowed [bool]: true if the the merchant allows partial purchases. ex: false
     * @param cardTags [list of strings]: tags of the IssuingCard responsible for this purchase. ex: ['travel', 'food']
     * @param holderId [string]: card holder ID. ex '5656565656565656' 
     * @param holderTags [list of strings]: tags of the IssuingHolder responsible for this purchase. ex: ['technology', 'john snow']
     *
     */
    constructor({ 
                    holderName=null, productId=null, cardId=null, cardEnding=null, purpose=null, 
                    amount=null, tax=null, issuerAmount=null, issuerCurrencyCode=null, 
                    issuerCurrencySymbol=null, merchantAmount=null, merchantCurrencyCode=null, 
                    merchantCurrencySymbol=null, merchantCategoryCode=null, merchantCategoryType=null, 
                    merchantCountryCode=null, acquirerId=null, merchantId=null, merchantName=null, 
                    merchantFee=null, walletId=null, methodCode=null, score=null, endToEndId=null, 
                    tags=null, id=null, issuingTransactionIds=null, status=null, description=null, 
                    metadata=null, zipCode=null, created=null, updated=null, isPartialAllowed=null, 
                    cardTags=null, holderId=null, holderTags=null 
                }) {
        super(id);

        this.holderName = holderName;
        this.productId = productId;
        this.cardId = cardId;
        this.cardEnding = cardEnding;
        this.purpose = purpose;
        this.amount = amount;
        this.tax = tax;
        this.issuerAmount = issuerAmount;
        this.issuerCurrencyCode = issuerCurrencyCode;
        this.issuerCurrencySymbol = issuerCurrencySymbol;
        this.merchantAmount = merchantAmount;
        this.merchantCurrencyCode = merchantCurrencyCode;
        this.merchantCurrencySymbol = merchantCurrencySymbol;
        this.merchantCategoryCode = merchantCategoryCode;
        this.merchantCategoryType = merchantCategoryType;
        this.merchantCountryCode = merchantCountryCode;
        this.acquirerId = acquirerId;
        this.merchantId = merchantId;
        this.merchantName = merchantName;
        this.merchantFee = merchantFee;
        this.walletId = walletId;
        this.methodCode = methodCode;
        this.score = score;
        this.endToEndId = endToEndId;
        this.tags = tags;
        this.issuingTransactionIds = issuingTransactionIds;
        this.status = status;
        this.description = description;
        this.metadata = metadata;
        this.zipCode = zipCode;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
        this.isPartialAllowed = isPartialAllowed;
        this.cardTags = cardTags;
        this.holderId = holderId;
        this.holderTags = holderTags;
    }
}

exports.IssuingPurchase = IssuingPurchase;
let resource = {'class': exports.IssuingPurchase, 'name': 'IssuingPurchase'};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific IssuingPurchase
     *
     * @description Receive a single IssuingPurchase object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingPurchase object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ ids, cardIds, holderIds, endToEndIds, limit, tags, status, after, before, user } = {}) {
    /**
     *
     * Retrieve IssuingPurchases
     *
     * @description Receive a generator of IssuingPurchase objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param endToEndIds [list of strings, default []]: central bank's unique transaction ID. ex: 'E79457883202101262140HHX553UPqeq'
     * @param holderIds [list of strings, default []]: cardholder IDs. ex: ['5656565656565656', '4545454545454545']
     * @param cardIds [list of strings, default []]: card  IDs. ex: ['5656565656565656', '4545454545454545']
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of IssuingPurchase objects with updated attributes
     *
     */
    let query = {
        ids: ids,
        cardIds: cardIds,
        holderIds: holderIds,
        endToEndIds: endToEndIds,
        limit: limit,
        tags: tags,
        status: status,
        after: after,
        before: before,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, ids, cardIds, holderIds, endToEndIds, limit, tags, status, after, before, user } = {}) {
    /**
     *
     * Retrieve paged IssuingPurchases
     *
     * @description Receive a list of up to 100 Purchase objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param endToEndIds [list of strings, default []]: central bank's unique transaction ID. ex: 'E79457883202101262140HHX553UPqeq'
     * @param holderIds [list of strings, default []]: cardholder IDs. ex: ['5656565656565656', '4545454545454545']
     * @param cardIds [list of strings, default []]: card  IDs. ex: ['5656565656565656', '4545454545454545']
     * @param status [string, default null]: filter for status of retrieved objects. ex: 'approved', 'canceled', 'denied', 'confirmed' or 'voided'
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-04-03'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-04-03'
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     * @param user [Organization/Project object, default null]: Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of IssuingPurchase objects with updated attributes and cursor to retrieve the next page of IssuingPurchase objects
     *
     */
    let query = {
        cursor: cursor,
        ids: ids,
        cardIds: cardIds,
        holderIds: holderIds,
        endToEndIds: endToEndIds,
        limit: limit,
        tags: tags,
        status: status,
        after: after,
        before: before,
    };
    return rest.getPage(resource, query, user);
};

exports.parse = async function (content, signature, {user} = {}) {
    /**
     *
     * Create a single verified IssuingPurchase authorization request from a content string
     *
     * @description Use this method to parse and verify the authenticity of the authorization request received at the informed endpoint.
     * Authorization requests are posted to your registered endpoint whenever IssuingPurchases are received.
     * They present IssuingPurchase data that must be analyzed and answered with approval or declination.
     * If the provided digital signature does not check out with the StarkInfra public key, a starkinfra.error.InvalidSignatureError will be raised.
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

exports.response = async function ({
                                        status, amount=null, reason=null, tags=null
                                    }) {
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
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ['tony', 'stark']
     *
     * Return:
     * @return Dumped JSON string that must be returned to us on the IssuingPurchase request
     *
     */
    let response = {
        'authorization': {
            'status': status,
            'amount': amount,
            'reason': reason,
            'tags': tags,
        }
    };
    api.removeNullKeys(response);
    return JSON.stringify(response);
};
