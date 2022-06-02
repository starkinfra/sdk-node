const starkbank = require('../../index.js');
const uniqueId = require('./uniqueId.js').create;


exports.generateExampleWebhook = function () {
    return new starkbank.Webhook({
        url: 'https://webhook.site/' + uniqueId(),
        subscriptions: [
            'credit-note', 'signer',
            'issuing-card', 'issuing-invoice', 'issuing-purchase',
            'pix-request.in', 'pix-request.out', 'pix-reversal.in', 'pix-reversal.out', 'pix-claim', 'pix-key', 'pix-chargeback', 'pix-infraction',
        ],
    });
};
