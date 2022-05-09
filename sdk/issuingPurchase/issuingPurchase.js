const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class IssuingPurchase extends Resource {
    /**
     *
     * IssuingPurchase object
     *
     * @description Displays the IssuingPurchase objects created in your Workspace.
     *
     * Parameters (required):
     * Attributes (return-only):
     * @param id [string]: unique id returned when IssuingPurchase is created. ex: "5656565656565656"
     * @param holderName [string]: cardholder's name. ex: "Tony Stark"
     * @param cardId [string]: unique id returned when IssuingCard is created. ex: "5656565656565656"
     * @param cardEnding [string]: last 4 digits of the card number. ex: "1234"
     * @param amount [integer]: IssuingPurchase value in cents. Minimum = 0. ex: 1234 (= R$ 12.34)
     * @param tax [integer]: IOF amount taxed for international purchases. ex: 1234 (= R$ 12.34)
     * @param issuerAmount [integer]: issuer amount. ex: 1234 (= R$ 12.34)
     * @param issuerCurrencyCode [string]: issuer currency code. ex: "USD"
     * @param issuerCurrencySymbol [string]: issuer currency symbol. ex: "$"
     * @param merchantAmount [integer]: merchant amount. ex: 1234 (= R$ 12.34)
     * @param merchantCurrencyCode [string]: merchant currency code. ex: "USD"
     * @param merchantCurrencySymbol [string]: merchant currency symbol. ex: "$"
     * @param merchantCategoryCode [string]: merchant category code. ex: "eatingPlacesRestaurants"
     * @param merchantCountryCode [string]: merchant country code. ex: "USA"
     * @param acquirerId [string]: acquirer ID. ex: "5656565656565656"
     * @param merchantId [string]: merchant ID. ex: "5656565656565656"
     * @param merchantName [string]: merchant name. ex: "Google Cloud Platform"
     * @param walletId [string]: virtual wallet ID. ex: "5656565656565656"
     * @param methodCode [string]: method code. ex: "chip", "token", "server", "manual", "magstripe" or "contactless"
     * @param score [float]: internal score calculated for the authenticity of the purchase. ex: 7.6
     * @param issuingTransactionIds [string]: ledger transaction ids linked to this Purchase
     * @param endToEndId [string]: central bank's unique transaction ID. ex: "E79457883202101262140HHX553UPqeq"
     * @param status [string]: current IssuingCard status. ex: "approved", "canceled", "denied", "confirmed" or "voided"
     * @param tags [string]: list of strings for tagging. ex: ["travel", "food"]
     * @param created [string]: creation datetime for the IssuingPurchase. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     * @param updated [string]: latest update datetime for the IssuingPurchase. ex: datetime.datetime(2020, 3, 10, 10, 30, 0, 0)
     *
     */
    constructor({ id, holderName, cardId, cardEnding, amount, tax, issuerAmount, issuerCurrencyCode, 
                    issuerCurrencySymbol, merchantAmount, merchantCurrencyCode, merchantCurrencySymbol, 
                    merchantCategoryCode, merchantCountryCode, acquirerId, merchantId, merchantName, walletId, 
                    methodCode, score, issuingTransactionIds, endToEndId, status, tags, created, updated 
                }) {
        super(id);
        this.holderName = holderName;
        this.cardId = cardId;
        this.cardEnding = cardEnding;
        this.amount = amount;
        this.tax = tax;
        this.issuerAmount = issuerAmount;
        this.issuerCurrencyCode = issuerCurrencyCode;
        this.issuerCurrencySymbol = issuerCurrencySymbol;
        this.merchantAmount = merchantAmount;
        this.merchantCurrencyCode = merchantCurrencyCode;
        this.merchantCurrencySymbol = merchantCurrencySymbol;
        this.merchantCategoryCode = merchantCategoryCode;
        this.merchantCountryCode = merchantCountryCode;
        this.acquirerId = acquirerId;
        this.merchantId = merchantId;
        this.merchantName = merchantName;
        this.walletId = walletId;
        this.methodCode = methodCode;
        this.score = score;
        this.issuingTransactionIds = issuingTransactionIds;
        this.endToEndId = endToEndId;
        this.status = status;
        this.tags = tags;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
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
     * @param endToEndIds [list of strings, default []]: central bank's unique transaction ID. ex: "E79457883202101262140HHX553UPqeq"
     * @param holderIds [list of strings, default []]: cardholder IDs. ex: ["5656565656565656", "4545454545454545"]
     * @param cardIds [list of strings, default []]: card  IDs. ex: ["5656565656565656", "4545454545454545"]
     * @param status [string, default null]: filter for status of retrieved objects. ex: "approved", "canceled", "denied", "confirmed" or "voided"
     * @param after [DateTime or string, default null] date filter for objects created only after specified date. ex: "2020-04-03"
     * @param before [DateTime or string, default null] date filter for objects created only before specified date. ex: "2020-04-03"
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ["tony", "stark"]
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
     * @param endToEndIds [list of strings, default []]: central bank's unique transaction ID. ex: "E79457883202101262140HHX553UPqeq"
     * @param holderIds [list of strings, default []]: cardholder IDs. ex: ["5656565656565656", "4545454545454545"]
     * @param cardIds [list of strings, default []]: card  IDs. ex: ["5656565656565656", "4545454545454545"]
     * @param status [string, default null]: filter for status of retrieved objects. ex: "approved", "canceled", "denied", "confirmed" or "voided"
     * @param after [DateTime or string, default null] date filter for objects created only after specified date. ex: "2020-04-03"
     * @param before [DateTime or string, default null] date filter for objects created only before specified date. ex: "2020-04-03"
     * @param ids [list of strings, default [], default null]: purchase IDs
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param tags [list of strings, default null]: tags to filter retrieved objects. ex: ["tony", "stark"]
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
