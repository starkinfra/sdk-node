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
