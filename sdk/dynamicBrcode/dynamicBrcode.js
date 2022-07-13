const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const parse = require('../utils/parse.js');
const Resource = require('../utils/resource.js').Resource


class DynamicBrcode extends Resource {
    /**
     * 
     * DynamicBrcode object
     * 
     * @description BR codes store information represented by Pix QR Codes, which are used to
     * send or receive Pix transactions in a convenient way.
     * DynamicBrcodes represent charges with information that can change at any time,
     * since all data needed for the payment is requested dynamically to an URL stored
     * in the BR Code. Stark Infra will receive the GET request and forward it to your
     * registered endpoint with a GET request containing the UUID of the BR code for
     * identification.
     * When you initialize a DynamicBrcode, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the created object.
     * 
     * Parameters (required):
     * @param name [string]: receiver's name. ex: 'Tony Stark'
     * @param city [string]: receiver's city name. ex: 'Rio de Janeiro'
     * @param externalId [string]: string that must be unique among all your DynamicBrcodes. Duplicated external ids will cause failures. ex: 'my-internal-id-123456'
     * 
     * Parameters (optional):
     * @param type [string, default 'instant']: type of the DynamicBrcode. Options: 'instant', 'due'
     * 
     * Attributes (return-only):
     * @param id [string]: id returned on creation, this is the BR code. ex: '00020126360014br.gov.bcb.pix0114+552840092118152040000530398654040.095802BR5915Jamie Lannister6009Sao Paulo620705038566304FC6C'
     * @param uuid [string]: unique uuid returned when a DynamicBrcode is created. ex: '97756273400d42ce9086404fe10ea0d6'
     * @param url [string]: url link to the BR code image. ex: 'https://brcode-h.development.starkinfra.com/static-qrcode/97756273400d42ce9086404fe10ea0d6.png'
     * @param updated [string]: latest update datetime for the DynamicBrcode. ex: '2020-03-10 10:30:00.000'
     * @param created [string]: creation datetime for the DynamicBrcode. ex: '2020-03-10 10:30:00.000'
     * 
     */
    constructor({name, city, externalId, type=null, id=null, uuid=null, url=null, updated=null, created=null}) {
        super(id);
        this.name = name
        this.city = city
        this.externalId = externalId
        this.type = type
        this.uuid = uuid
        this.url = url
        this.updated = check.datetime(updated);
        this.created = check.datetime(created);
    }
}

exports.DynamicBrcode = DynamicBrcode;
let resource = {'class': exports.DynamicBrcode, 'name': 'DynamicBrcode'};

exports.create = async function (brcodes, {user} = {}) {
    /**
     *
     * Create DynamicBrcodes
     *
     * @description Send a list of DynamicBrcode objects for creation at the Stark Infra API
     *
     * Parameters (required):
     * @param brcodes [list of DynamicBrcode objects]: list of DynamicBrcode objects to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of DynamicBrcode objects with updated attributes
     *
     */
    return rest.post(resource, brcodes, user);
};

exports.get = async function (uuid, {user} = {}) {
    /**
     *
     * Retrieve a specific DynamicBrcode
     *
     * @description Receive a single DynamicBrcode object previously created in the Stark Infra API by passing its id
     *
     * Parameters (required):
     * @param uuid [string]: object's unique uuid. ex: '97756273400d42ce9086404fe10ea0d6'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns DynamicBrcode object with updated attributes
     *
     */
    return rest.getId(resource, uuid, user);
};

exports.query = async function ({ limit, after, before, uuids, externalId, user } = {}) {
    /**
     *
     * Retrieve DynamicBrcodes
     *
     * @description Receive a generator of DynamicBrcode objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param uuids [list of strings, default null]: list of uuids to filter retrieved objects. ex: ['97756273400d42ce9086404fe10ea0d6', 'e3da0b6d56fa4045b9b295b2be82436e']
     * @param externalIds [list of strings, default null]: list of externalIds to filter retrieved objects. ex: ["my_external_id1", "my_external_id2"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call     
     *
     * Return:
     * @returns generator of DynamicBrcode objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        uuids: uuids,
        externalId: externalId,
        user: user,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, uuids, externalId, user } = {}) {
    /**
     *
     * Retrieve paged DynamicBrcodes
     *
     * @description Receive a list of up to 100 DynamicBrcode objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. It must be an integer between 1 and 100. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param uuids [list of strings, default null]: list of uuids to filter retrieved objects. ex: ['97756273400d42ce9086404fe10ea0d6', 'e3da0b6d56fa4045b9b295b2be82436e']
     * @param externalIds [list of strings, default null]: list of externalIds to filter retrieved objects. ex: ["my_external_id1", "my_external_id2"]
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was used before function call
     *
     * Return:
     * @returns list of DynamicBrcode objects with updated attributes and cursor to retrieve the next page of DynamicBrcode objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        uuids: uuids,
        externalId: externalId,
        user: user,
    };
    return rest.getPage(resource, query, user);
};

exports.responseDue = async function ({ 
        version, created, due, keyId, status, reconciliationId, amount, senderName, receiverName,
        receiverStreetLine, receiverCity, receiverStateCode, receiverZipCode, expiration, 
        senderTaxId, receiverTaxId, fineAmount, interestAmount, discountAmount, 
        description 
    } = {}) {
    /**
     *
     * Helps you respond to a due DynamicBrcode Read
     * 
     * @description When a Due DynamicBrcode is read by your user, a GET request containing the Brcode's 
     * UUID will be made to your registered URL to retrieve additional information needed 
     * to complete the transaction.
     * The get request must be answered in the following format, within 5 seconds, and with 
     * an HTTP status code 200.
     *
     * Parameters (required):
     * @param version [integer]: integer that represents how many times the BR code was updated.
     * @param created [string]: creation datetime in ISO format of the DynamicBrcode. ex: '2020-03-10 10:30:00.000')
     * @param due [string]: requested payment due datetime in ISO format. ex: '2020-03-10 10:30:00.000')
     * @param keyId [string]: receiver's PixKey id. Can be a taxId (CPF/CNPJ), a phone number, an email or an alphanumeric sequence (EVP). ex: '+5511989898989'
     * @param status [string]: BR code status. Options: 'created', 'overdue', 'paid', 'canceled' or 'expired'
     * @param reconciliationId [string]: id to be used for conciliation of the resulting Pix transaction. ex: 'cd65c78aeb6543eaaa0170f68bd741ee'
     * @param amount [integer]: positive integer that represents the amount in cents of the resulting Pix transaction. ex: 1234 (= R$ 12.34)
     * @param senderName [string]: sender's full name. ex: 'Anthony Edward Stark'
     * @param receiverName [string]: receiver's full name. ex: 'Jamie Lannister'
     * @param receiverStreetLine [string]: receiver's main address. ex: 'Av. Paulista, 200'
     * @param receiverCity [string]: receiver's address city name. ex: 'Sao Paulo'
     * @param receiverStateCode [string]: receiver's address state code. ex: 'SP'
     * @param receiverZipCode [string]: receiver's address zip code. ex: '01234-567'
     *
     * Parameters (optional):
     * @param expiration [integer, default 86400 (1 day)]: time in seconds counted from the creation datetime until the DynamicBrcode expires. After expiration, the BR code cannot be paid anymore.
     * @param senderTaxId [string, default null]: sender's CPF (11 digits formatted or unformatted) or CNPJ (14 digits formatted or unformatted). ex: '01.001.001/0001-01'
     * @param receiverTaxId [string, default null]: receiver's CPF (11 digits formatted or unformatted) or CNPJ (14 digits formatted or unformatted). ex: '012.345.678-90'
     * @param fineAmount [integer, default 0]: amount charged if the sender pays after the due datetime.
     * @param interestAmount [integer, default 0]: interest amount charged if the sender pays after the due datetime calculated from a percent interest.
     * @param discountAmount [integer, default 0]: discount amount applied if the sender pays at a specific datetime before the due datetime.
     * @param description [string, default null]: additional information to be shown to the sender at the moment of payment.
     *
     * Return:
     * @return Dumped JSON string that must be returned to us
     *
     */
    return JSON.stringify({
        'version': version,
        'created': created,
        'due': due,
        'keyId': keyId,
        'status': status,
        'reconciliationId': reconciliationId,
        'amount': amount,
        'senderName': senderName,
        'receiverName': receiverName,
        'receiverStreetLine': receiverStreetLine,
        'receiverCity': receiverCity,
        'receiverStateCode': receiverStateCode,
        'receiverZipCode': receiverZipCode,
        'expiration': expiration,
        'senderTaxId': senderTaxId,
        'receiverTaxId': receiverTaxId,
        'fineAmount': fineAmount,
        'interestAmount': interestAmount,
        'discountAmount': discountAmount,
        'description': description
    });
};

exports.responseInstant = async function ({ 
        version, created, keyId, status, reconciliationId, amount, cashierType, cashierBankCode, cashAmount, expiration, senderName, 
        senderTaxId, amountType, description 
    } = {}) {
    /**
     *
     * Helps you respond to an instant DynamicBrcode Read
     * 
     * When an instant DynamicBrcode is read by your user, a GET request containing the BR code's UUID will be made
     * to your registered URL to retrieve additional information needed to complete the transaction.
     * The get request must be answered in the following format within 5 seconds and with an HTTP status code 200.
     *
     * Parameters (required):
     * @param version [integer]: integer that represents how many times the BR code was updated.
     * @param created [string]: creation datetime of the DynamicBrcode. ex: '2022-05-17'
     * @param keyId [string]: receiver's PixKey id. Can be a taxId (CPF/CNPJ), a phone number, an email or an alphanumeric sequence (EVP). ex: '+5511989898989'
     * @param status [string]: BR code status. Options: 'created', 'overdue', 'paid', 'canceled' or 'expired'
     * @param reconciliationId [string]: id to be used for conciliation of the resulting Pix transaction. ex: 'cd65c78aeb6543eaaa0170f68bd741ee'
     * @param amount [integer]: positive integer that represents the amount in cents of the resulting Pix transaction. ex: 1234 (= R$ 12.34)
     *
     * Parameters (conditionally required):
     * @param cashierType [string, default null]: cashier's type. Required if the cashAmount is different from 0. Options: 'merchant', 'participant' and 'other'
     * @param cashierBankCode [string, default null]: cashier's bank code. Required if the cashAmount is different from 0. ex: '20018183'
     * 
     * Parameters (optional):
     * @param cashAmount [integer, default 0]: amount to be withdrawn from the cashier in cents. ex: 1000 (= R$ 10.00)
     * @param expiration [integer, default 86400 (1 day)]: time in seconds counted from the creation datetime until the DynamicBrcode expires. After expiration, the BR code cannot be paid anymore. Default value: 86400 (1 day)
     * @param senderName [string, default null]: sender's full name. ex: 'Anthony Edward Stark'
     * @param senderTaxId [string, default null]: sender's CPF (11 digits formatted or unformatted) or CNPJ (14 digits formatted or unformatted). ex: '01.001.001/0001-01'
     * @param amountType [string, default 'fixed']: amount type of the Brcode. If the amount type is 'custom' the Brcode's amount can be changed by the sender at the moment of payment. Options: 'fixed' or 'custom'
     * @param description [string, default null]: additional information to be shown to the sender at the moment of payment.
     *
     * Return:
     * @return Dumped JSON string that must be returned to us
     *
     */
    return JSON.stringify({
        'version': version,
        'created': created,
        'keyId': keyId,
        'status': status,
        'reconciliationId': reconciliationId,
        'amount': amount,
        'cashierType': cashierType,
        'cashierBankCode': cashierBankCode,
        'cashAmount': cashAmount,
        'expiration': expiration,
        'senderName': senderName,
        'senderTaxId': senderTaxId,
        'amountType': amountType,
        'description': description,
    });
};

exports.verify = async function ({uuid, signature, user} = {}) {
    /**
     *
     * Verify a DynamicBrcode Read 
     *
     * @description When a DynamicBrcode is read by your user, a GET request will be made to your registered URL to
     * retrieve additional information needed to complete the transaction.
     * Use this method to verify the authenticity of a GET request received at your registered endpoint.
     * If the provided digital signature does not check out with the StarkInfra public key,
     * a stark.exception.InvalidSignatureException will be raised.
     * 
     * Parameters (required):
     * @param uuid [string]: unique uuid returned when a DynamicBrcode is created. ex: '4e2eab725ddd495f9c98ffd97440702d'
     * @param signature [string]: base-64 digital signature received at response header 'Digital-Signature'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @return Verified Brcode's uuid.
     *
     */
    return parse.verify(uuid, signature, user);
};
