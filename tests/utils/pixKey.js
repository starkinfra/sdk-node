const starkinfra = require('../../index.js');
const random = require('./random');

exports.generateExamplePixKeyJson = function () {
    return new starkinfra.PixKey({
        'accountCreated': random.pastDate(360),
        'accountNumber': '0000-1',
        'accountType': 'savings',
        'branchCode': '0000-1',
        'name': 'Jamie Lannister',
        'taxId': '012.345.678-90',
        'id': '+55{areaCode}{phoneNumber}'
            .replace('{areaCode}', Math.floor(Math.random() * (99 - 10 + 1) + 10))
            .replace('{phoneNumber}', Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000))
    })
};
