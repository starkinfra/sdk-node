const starkinfra = require('../../index.js');

exports.generateExampleLedgerTransactionJson = function (n = 1) {
    let transactions = [];
    for (let i = 0; i < n; i++) {
        transactions.push(new starkinfra.LedgerTransaction({
            amount: Math.floor(Math.random() * (9999 - 1000) + 1000),
            ledgerId: '123',
            source: 'account/' + String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0'),
            externalId: String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0'),
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
    return transactions;
};

exports.getLedgerWithTransactions = async function (minTransactionCount = 10) {
    let ledgers = await starkinfra.ledger.query({ limit: 20 });
    for await (let ledger of ledgers) {
        let [transactions, cursor] = await starkinfra.ledgerTransaction.page({ ledgerId: ledger.id, limit: minTransactionCount - 1 });
        if (cursor) {
            return ledger;
        }
    }
    return null;
};
