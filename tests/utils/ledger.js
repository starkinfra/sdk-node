const starkinfra = require('../../index.js');

exports.generateExampleLedgerJson = function (n = 1) {
    let ledgers = [];
    for (let i = 0; i < n; i++) {
        ledgers.push(new starkinfra.Ledger({
            externalId: String(Math.floor(Math.random() * 999999) + 1),
            tags: [
                'savings account',
                'spending counter',
            ],
            metadata: {
                accountId: '123',
            },
            rules: [
                new starkinfra.ledger.Rule({
                    key: 'minimumBalance',
                    value: 0,
                }),
            ],
        }));
    }
    return ledgers;
};
