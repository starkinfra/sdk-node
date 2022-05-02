const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingPurchaseQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let purchases = await starkinfra.issuingPurchase.query({'limit': 10});
        for await (let purchase of purchases) {
            assert(typeof purchase.id == 'string');
        }
    });
});

describe('TestIssuingPurchaseGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let purchases = await starkinfra.issuingPurchase.query({'limit': 1});
        for await (let purchase of purchases) {
            assert(typeof purchase.id == 'string');
            purchase = await starkinfra.issuingPurchase.get(purchase.id);
            assert(typeof purchase.id == 'string');
        }
    });
});
