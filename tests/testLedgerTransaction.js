const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleLedgerTransactionJson, getLedgerWithTransactions} = require('./utils/ledgerTransaction');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestLedgerTransactionPost', function() {
    this.timeout(20000);
    it('test_success', async () => {
        let transactions = generateExampleLedgerTransactionJson(5);
        let ledgers = [];
        let query = await starkinfra.ledger.query({'limit': 3});
        for await (let ledger of query) {
            ledgers.push(ledger);
        }
        for (let i = 0; i < transactions.length; i++) {
            transactions[i].ledgerId = ledgers[i % ledgers.length].id;
        }
        transactions = await starkinfra.ledgerTransaction.create(transactions);
        for await (let transaction of transactions) {
            let checkTransaction = await starkinfra.ledgerTransaction.get(transaction.id);
            assert(transaction.id === checkTransaction.id);
        }
    });
});

describe('TestLedgerTransactionQuery', function() {
    this.timeout(20000);
    it('test_success', async () => {
        let ledger = await getLedgerWithTransactions();
        let transactions = await starkinfra.ledgerTransaction.query({ 'ledgerId': ledger.id, 'limit': 5 });
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
        }
    });
});

describe('TestLedgerTransactionPage', function() {
    this.timeout(20000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        let ledger = await getLedgerWithTransactions();
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.ledgerTransaction.page({ 'ledgerId': ledger.id, 'limit': 2, 'cursor': cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
    });
});

describe('TestLedgerTransactionGet', function() {
    this.timeout(20000);
    it('test_success', async () => {
        let ledger = await getLedgerWithTransactions();
        let transactions = await starkinfra.ledgerTransaction.query({ 'ledgerId': ledger.id, 'limit': 1 });
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
            transaction = await starkinfra.ledgerTransaction.get(transaction.id);
            assert(typeof transaction.id == 'string');
            assert(ledger.id === transaction.ledgerId);
        }
    });
});
