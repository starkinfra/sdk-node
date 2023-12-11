const starkinfra = require('../../index.js');
const random = require('./random');

exports.generateExampleIssuingTokenRequestJson = function (cardId) {
    return new starkinfra.IssuingTokenRequest({
        'cardId': cardId,
        'walletId': 'google',
        'methodCode': 'app'
    })
};
