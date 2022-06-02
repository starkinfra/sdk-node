const parse = require('../utils/parse');
const SubResource = require('../utils/subResource').SubResource;


class IssuingAuthorization extends SubResource {
    /**
     *
     * Webhook IssuingAuthorization object
     *
     * @description An IssuingAuthorization presents purchase data to be analysed and answered with an approval or a declination.
     *
     * Attributes (return-only):
     * @param endToEndId [string]: unique purchase identifier in the Stark system. ex: 'E79457883202101262140HHX553UPqeq'
     * @param amount [integer]: IssuingPurchase value in cents. Minimum = 0. ex: 1234 (= R$ 12.34)
     * @param tax [integer]: IOF amount taxed for international purchases. ex: 1234 (= R$ 12.34)
     * @param cardId [string]: unique id returned when IssuingCard is created. ex: '5656565656565656'
     * @param issuerAmount [integer]: issuer amount. ex: 1234 (= R$ 12.34)
     * @param issuerCurrencyCode [string]: issuer currency code. ex: 'USD'
     * @param merchantAmount [integer]: merchant amount. ex: 1234 (= R$ 12.34)
     * @param merchantCurrencyCode [string]: merchant currency code. ex: 'USD'
     * @param merchantCategoryCode [string]: merchant category code. ex: 'eatingPlacesRestaurants'
     * @param merchantCountryCode [string]: merchant country code. ex: 'USA'
     * @param acquirerId [string]: acquirer ID. ex: '5656565656565656'
     * @param merchantId [string]: merchant ID. ex: '5656565656565656'
     * @param merchantName [string]: merchant name. ex: 'Google Cloud Platform'
     * @param merchantFee [integer]: merchant fee charged. ex: 200 (= R$ 2.00)
     * @param walletId [string]: virtual wallet ID. ex: '5656565656565656'
     * @param methodCode [string]: method code. ex: 'chip', 'token', 'server', 'manual', 'magstripe' or 'contactless'
     * @param score [float]: internal score calculated for the authenticity of the purchase. ex: 7.6
     * @param isPartialAllowed [bool]: true if the the merchant allows partial purchases. ex: False
     * @param purpose [string]: purchase purpose. ex: 'purchase'
     * @param cardTags [list of strings]: list of tags of the IssuingCard. ex: ['travel', 'food']
     * @param holderTags [list of strings]: list of tags of the IssuingHolder. ex: ['travel', 'food']
     *
     */
    constructor(endToEndId, amount, tax, cardId, issuerAmount, issuerCurrencyCode, merchantAmount, merchantCurrencyCode, 
                merchantCategoryCode, merchantCountryCode, acquirerId, merchantId, merchantName, merchantFee, walletId, 
                methodCode, score, isPartialAllowed, purpose, cardTags, holderTags) {
        super();
        this.endToEndId = endToEndId;
        this.amount = amount;
        this.tax = tax;
        this.cardId = cardId;
        this.issuerAmount = issuerAmount;
        this.issuerCurrencyCode = issuerCurrencyCode;
        this.merchantAmount = merchantAmount;
        this.merchantCurrencyCode = merchantCurrencyCode;
        this.merchantCategoryCode = merchantCategoryCode;
        this.merchantCountryCode = merchantCountryCode;
        this.acquirerId = acquirerId;
        this.merchantId = merchantId;
        this.merchantName = merchantName;
        this.merchantFee = merchantFee;
        this.walletId = walletId;
        this.methodCode = methodCode;
        this.score = score;
        this.isPartialAllowed = isPartialAllowed;
        this.purpose = purpose;
        this.cardTags = cardTags;
        this.holderTags = holderTags;
    }
}

exports.IssuingAuthorization = IssuingAuthorization;
let resource = {'class': exports.IssuingAuthorization, 'name': 'IssuingAuthorization'};

exports.parse = async function ({content, signature, user} = {}) {
    /**
     *
     * Create single IssuingAuthorization from a content string
     *
     * @description Create a single IssuingAuthorization object from a content string received from a handler listening at the request url.
     * If the provided digital signature does not check out with the Stark public key, a
     * starkinfra.exception.InvalidSignatureException will be raised.
     *
     * Parameters (required):
     * @param content [string]: response content from request received at user endpoint (not parsed)
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @return IssuingAuthorization object with updated attributes
     *
     */

    return parse.parseAndVerify(resource, content, signature, user);
};

exports.response = async function (status, {amount, reason, tags} = {}) {
    return JSON.stringify({'authorization': {
        'status': status,
        'amount': amount ? amount : 0,
        'reason': reason ? reason : '',
        'tags': tags ? tags : [],
    }});
};
