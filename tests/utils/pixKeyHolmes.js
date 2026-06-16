const starkinfra = require('../../index.js');


// Builder fixture for PixKeyHolmes create input.
// Structural model: tests/utils/creditHolmes.js (a "...Holmes" resource).
// [M5] only the input fields key_id (keyId) and tags are accepted by create;
// id/result/status/created/updated are output-only and MUST NOT be sent.
// key_id must be a valid Pix key — email/phone/taxId per the contract examples
// (contracts/pix-key-holmes.md fields table). No client-side validation is done
// here; key_id format is validated API-side (contract "Error cases").
exports.generateExamplePixKeyHolmes = function () {
    return new starkinfra.PixKeyHolmes({
        keyId: 'valid@sandbox.com',
        tags: ['pix-key-holmes-test'],
    });
};


// [M1] create accepts a LIST of PixKeyHolmes. Mirrors the
// generateExampleCreditHolmesJson(n) shape: returns a list of N instances.
exports.generateExamplePixKeyHolmesJson = function (n = 1) {
    let holmes = [];
    for (let i = 0; i < n; i++) {
        holmes.push(exports.generateExamplePixKeyHolmes());
    }
    return holmes;
};
