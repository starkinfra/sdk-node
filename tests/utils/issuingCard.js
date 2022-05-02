const starkinfra = require('../../index.js');

exports.generateExampleCardJson = function (holder, n = 1) {
    let cards = [];
    for (let i = 0; i < n; i++) {
        let card = new starkinfra.IssuingCard({
            'holderName': holder.name,
            'holderTaxId': holder.taxId,
            'holderExternalId': holder.externalId,
        })
        cards.push(card);
    }
    return cards;
};
