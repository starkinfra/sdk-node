const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingTransactionQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let transactions = await starkinfra.issuingTransaction.query({'limit': 10});
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
        }
    });
});

describe('TestIssuingTransactionGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let transactions = await starkinfra.issuingTransaction.query({'limit': 1});
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
            transaction = await starkinfra.issuingTransaction.get(transaction.id);
            assert(typeof transaction.id == 'string');
        }
    });
});

describe('TestIssuingTransactionPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingTransaction.page({ limit: 5, cursor: cursor });
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
