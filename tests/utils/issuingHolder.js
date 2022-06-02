const starkinfra = require('../../index.js');
const {generateExampleRulesJson} = require('./rule');

exports.generateExampleHolderJson = function (n = 1) {
    let holders = [];
    for (let i = 0; i < n; i++) {
        let holder = new starkinfra.IssuingHolder({
            'name': 'Holder Test',
            'taxId': '012.345.678-90',
            'externalId': (Math.floor(Math.random() * (Math.floor(999999) - Math.ceil(1) + 1)) + Math.ceil(1)).toString(),
            'tags': ['Traveler Employee'],
            'rules': generateExampleRulesJson()
        })
        holders.push(holder);
    }
    return holders;
};
