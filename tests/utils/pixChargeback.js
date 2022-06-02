const starkinfra = require('../../index.js');
const {bankCode} = require('./user');

exports.generateExamplePixChargebackJson = async function (n=1) {
    let pixRequests = await starkinfra.pixRequest.query({limit: n});
    let chargebacks = [];
    for await (const request of pixRequests) {
        chargebacks.push(new starkinfra.PixChargeback({
            'amount': request.amount,
            'referenceId': request.endToEndId,
            'reason': 'flaw'
        }));
    }
    return chargebacks;
};

exports.getPixChargebackToPatch = async function () {
    const pixChargebacks = [];
    let reversals = null;
    let cursor = null;
    while (pixChargebacks < 3) {
        [reversals, cursor] = await starkinfra.pixChargeback.page({
            status: 'delivered',
            limit: 5,
            cursor: cursor
        })
        for await (let reversal of reversals) {
            console.log(reversal)
            if (reversal.senderBankCode !== bankCode) {
                pixChargebacks.push(reversal);
            }
        }
        if (!cursor) {
            break;
        }
    }
    return pixChargebacks[Math.floor(Math.random()*pixChargebacks.length)];
};
