const starkinfra = require('../../index.js');
const endToEndId = require('../../sdk/utils/endToEndId');

exports.generateExamplePixReversalJson = function () {
    const reasons = ['bankError', 'fraud', 'pixWithdrawError', 'refund3ByEndCustomer']
    return new starkinfra.PixReversal({
        'amount': Math.floor(Math.random() * (99 - 10 + 1) + 10),
        'externalId': String(Math.floor(Math.random() * (99999 - 10 + 1) + 10)),
        'endToEndId': endToEndId.create(process.env.SANDBOX_ISPB),
        'reason': reasons[Math.floor(Math.random()*reasons.length)],
        'tags': ['test', 'reversal']
    })
};
