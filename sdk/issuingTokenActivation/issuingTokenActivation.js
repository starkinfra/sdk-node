const parse = require('../utils/parse.js');
const SubResource = require('../utils/subResource.js').SubResource


class IssuingTokenActivation extends SubResource {
    /**
     *
     * IssuingTokenActivation object
     *
     * @description The IssuingTokenActivation object displays the necessary information to proceed with the card tokenization.
     * You will receive this object at your registered URL to notify you which method your user want to receive the activation code.
     * The POST request must be answered with no content, within 2 seconds, and with an HTTP status code 200.
     * After that, you may generate the activation code and send it to the cardholder.
     *
     * Attributes (return-only):
     * @param cardId [string]: card ID which the token is bounded to. ex: '5656565656565656'
     * @param tokenId [string]: token unique id. ex: '5656565656565656' 
     * @param tags [list of strings]: tags to filter retrieved object. ex: ['tony', 'stark']
     * @param activationMethod [dictionary object]: dictionary object with 'type':string and 'value':string pairs
     *
     */
    constructor({ 
                    cardId=null, tokenId=null, tags=null, activationMethod=null
                }) {
        super();
        
        this.cardId = cardId
        this.tokenId = tokenId
        this.tags = tags
        this.activationMethod = activationMethod
    }
}

exports.IssuingTokenActivation = IssuingTokenActivation;
exports.subResource = {'class': exports.IssuingTokenActivation, 'name': 'IssuingTokenActivation'};

exports.parse = async function (content, signature, {user} = {}) {
    /**
     *
     * Create a single verified IssuingTokenActivation request from a content string
     *
     * @description Use this method to parse and verify the authenticity of the request received at the informed endpoint.
     * Activation requests are posted to your registered endpoint whenever IssuingTokenActivations are received.
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
     * @return Parsed IssuingTokenActivation object
     *
     */
    return parse.parseAndVerify(exports.subResource, content, signature, user);
};
