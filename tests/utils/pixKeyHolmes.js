const starkinfra = require('../../index.js');


exports.generateExamplePixKeyHolmes = function () {
    return new starkinfra.PixKeyHolmes({
        keyId: 'valid@sandbox.com',
        tags: ['pix-key-holmes-test'],
    });
};


exports.generateExamplePixKeyHolmesJson = function (n = 1) {
    let holmes = [];
    for (let i = 0; i < n; i++) {
        holmes.push(exports.generateExamplePixKeyHolmes());
    }
    return holmes;
};
