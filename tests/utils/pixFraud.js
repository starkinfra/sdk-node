const starkinfra = require('../../index.js');
const uniqueId = require('./uniqueId.js').create;


exports.generateExamplePixFraud = function () {
    return new starkinfra.PixFraud({
        externalId: 'node-' + uniqueId(),
        type: 'scam',
        taxId: '012.345.678-90',
    });
};


exports.generateExamplePixFraudsJson = function (n = 1) {
    let frauds = [];
    for (let i = 0; i < n; i++) {
        frauds.push(exports.generateExamplePixFraud());
    }
    return frauds;
};
