const starkinfra = require('../../index.js');
const random = require('./random');

exports.generateExampleIssuingWithdrawalJson = function () {
    return {
        'amount': 100,
        'externalId': String(Math.floor(Math.random() * (99999 - 10 + 1) + 10)),
        'description': 'sending money back'
    }
};
