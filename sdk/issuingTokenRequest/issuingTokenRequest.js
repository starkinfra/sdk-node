const rest = require('../utils/rest.js');
const {parseObjects} = require('../utils/parse');
const SubResource = require('../utils/subResource').SubResource;


class IssuingTokenRequest extends SubResource {
    /**
     *
     * IssuingTokenRequest object
     *
     * @description The IssuingTokenRequest object displays the necessary information to proceed with the card tokenization.
     *
     * Parameters (required):
     * @param cardId [string]: card id to be tokenized. ex: "5734340247945216"
     * @param walletId [string]: desired wallet to be integrated. ex: "google"
     * @param methodCode [string]: method code. ex: "app" or "manual"
     * 
     * Attributes (return-only):
     * @param content [string]: token request content. ex: "eyJwdWJsaWNLZXlGaW5nZXJwcmludCI6ICJlNTNiZThjZTRhYWQxNWU2OWNmMjExOTA5Mjk4YzJkOTE0O..."
     * @param signature [string]: token request signature. ex: "eyJwdWJsaWNLZXlGaW5nZXJwcmludCI6ICJlNTNiZThjZTRhYWQxNWU2OWNmMjExOTA5Mjk4YzJkOTE0O..."
     * @param metadata [dictionary object]: dictionary object used to store additional information about the IssuingTokenRequest object.
     *
     */
    constructor({ 
                    cardId=null, walletId=null, methodCode=null,
                    content=null, signature=null, metadata=null
                }) {
        super();
        
        this.cardId = cardId;
        this.walletId = walletId;
        this.methodCode = methodCode;
        this.content = content;
        this.signature = signature;
        this.metadata = metadata;
    }
}

exports.IssuingTokenRequest = IssuingTokenRequest;
let resource = {'class': exports.IssuingTokenRequest, 'name': 'IssuingTokenRequest'};

exports.create = async function (requests, {user} = {}) {
    /**
     *
     *  Create an IssuingTokenRequest object
     *
     * @description Send an IssuingTokenRequest object to Stark Infra API to create the payload to proceed with the card tokenization
     *
     * Parameters (required):
     * @param request [IssuingTokenRequest object]: IssuingTokenRequest object to the API to generate the payload
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns IssuingTokenRequest object with updated attributes
     *
     */
    return rest.postSingle(resource, requests, user);
};