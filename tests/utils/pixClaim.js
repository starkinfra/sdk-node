const starkinfra = require('../../index.js');

exports.generateExamplePixClaimJson = function () {
    return new starkinfra.PixClaim({
        'accountCreated': new Date().toISOString().replace('Z', '+00:00'),
        'accountNumber': '0000-1',
        'accountType': 'savings',
        'branchCode': '0000-1',
        'name': 'Jamie Lannister',
        'taxId': '012.345.678-90',
        'keyId': '+55{areaCode}{phoneNumber}'
            .replace('{areaCode}', Math.floor(Math.random() * (99 - 10 + 1) + 10))
            .replace('{phoneNumber}', Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000))
    })
};


exports.getPixClaimToPatch = async function () {
    const pixClaims = [];
    let claims = null;
    let cursor = null;
    while (pixClaims < 1) {
        [claims, cursor] = await starkinfra.pixClaim.page({
            status: 'delivered',
            limit: 5,
            cursor: cursor
        })
        for await (let claim of claims) {
            if (claim.agent === 'claimer') {
                pixClaims.push(claim);
            }
        }
        if (!cursor) {
            break;
        }
    }
    return pixClaims[Math.floor(Math.random()*pixClaims.length)];
};
