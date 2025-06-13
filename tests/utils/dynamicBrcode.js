const starkinfra = require('../../index.js');


exports.generateExampleDynamicBrcodeJson = function (type = undefined) {
    typeArray = Array("instant", "due", "subscription", "subscriptionAndInstant", "dueAndOrSubscription");
    return new starkinfra.DynamicBrcode({
        'name': "Jamie Lannister",
        'city': 'São Paulo',
        'externalId': String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)),
        'type': type ? type : typeArray[Math.floor(Math.random() * typeArray.length)],
    })
};
