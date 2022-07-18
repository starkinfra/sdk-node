const starkinfra = require('../../index.js');


exports.generateExampleDynamicBrcodeJson = function () {
    typeArray = Array("instant", "due")
    return new starkinfra.DynamicBrcode({
        'name': "Jamie Lannister",
        'city': 'São Paulo',
        'externalId': String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)),
        'type': typeArray[Math.floor(Math.random() * typeArray.length)],
    })
};
