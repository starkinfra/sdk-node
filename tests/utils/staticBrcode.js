const starkinfra = require('../../index.js');

exports.generateExampleStaticBrcodeJson = function () {
    return new starkinfra.StaticBrcode({
        'name': "Jamie Lannister",
        'keyId': '+55{areaCode}{phoneNumber}'
            .replace('{areaCode}', Math.floor(Math.random() * (99 - 10 + 1) + 10))
            .replace('{phoneNumber}', Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000)),
        'amount': Math.floor(Math.random() * (9999 - 1000 + 1) + 1000),
        'reconciliationId': String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)),
        'city': 'São Paulo'
    })
};
