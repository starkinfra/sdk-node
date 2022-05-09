const starkinfra = require('../../index.js');
const {bankCode} = require("./user");

exports.generateExampleReversalRequestJson = async function () {
    let pixRequests = await starkinfra.pixRequest.query({limit: 20});
    let requests = [];
    for await (const request of pixRequests) {
        requests.push(request);
    }
    let pixrequest = requests[Math.floor(Math.random() * requests.length)];
    return new starkinfra.ReversalRequest({
        'amount': pixrequest.amount,
        'referenceId': pixrequest.endToEndId,
        'reason': 'flaw'
    })
};

exports.getReversalRequestToPatch = async function () {
    const reversalRequests = [];
    let reversals = null;
    let cursor = null;
    while (reversalRequests < 3) {
        [reversals, cursor] = await starkinfra.reversalRequest.page({
            status: 'delivered',
            limit: 5,
            cursor: cursor
        })
        for await (let reversal of reversals) {
            console.log(reversal)
            if (reversal.senderBankCode !== bankCode) {
                reversalRequests.push(reversal);
            }
        }
        if (!cursor) {
            break;
        }
    }
    return reversalRequests[Math.floor(Math.random()*reversalRequests.length)];
};
