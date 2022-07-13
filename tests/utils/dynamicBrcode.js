const starkinfra = require('../../index.js');

const TYPE_ARRAY = Array("instant", "due")

exports.generateExampleDynamicBrcodeJson = function () {
    return new starkinfra.DynamicBrcode({
        'name': "Jamie Lannister",
        'city': 'São Paulo',
        'externalId': String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)),
        'type': TYPE_ARRAY[Math.floor(Math.random() * TYPE_ARRAY.length)],
    })
};
