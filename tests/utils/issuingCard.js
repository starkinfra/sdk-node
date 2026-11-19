const starkinfra = require('../../index.js');

exports.generateExampleCardJson = function (holder, n = 1, type = null, productId = null) {
    let cards = [];
    for (let i = 0; i < n; i++) {
        let card = {
            'holderName': holder.name,
            'holderTaxId': holder.taxId,
            'holderExternalId': holder.externalId,
        }
        if (type) { card.type = type; }
        if (productId) { card.productId = productId; }

        cards.push(new starkinfra.IssuingCard(card));
    }
    return cards;
};

// The sandbox product ids differ per Project, so the first available product is used by default.
exports.generateExampleCardsWithoutHolder = async function (n = 1, type = 'physical', productId = null) {
    if (!productId) {
        for await (let product of await starkinfra.issuingProduct.query({ limit: 1 })) {
            productId = product.id;
        }
    }
    let cards = [];
    for (let i = 0; i < n; i++) {
        cards.push(new starkinfra.IssuingCard({ productId: productId, type: type, tags: ['sdk-test'] }));
    }
    return cards;
};

// A holder can only be linked to a product of its own type: business holders have a CNPJ (14 digits) and individual
// holders a CPF (11 digits). Existing holders are used so no personal data is created by the test.
exports.findExistingHolderForProduct = async function (product) {
    let digits = { business: 14, individual: 11 }[product.holderType];
    for await (let holder of await starkinfra.issuingHolder.query({ status: 'active', limit: 100 })) {
        if (holder.taxId.replace(/\D/g, '').length === digits) {
            return holder;
        }
    }
    return null;
};
