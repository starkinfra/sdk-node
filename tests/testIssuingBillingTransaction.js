const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingBillingTransactionQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let transactions = await starkinfra.issuingBillingTransaction.query({'limit': 10});
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
        }
    });
});

describe('TestIssuingBillingTransactionPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingBillingTransaction.page({ limit: 5, cursor: cursor });
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
