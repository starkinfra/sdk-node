const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingIssuingStockQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let stocks = await starkinfra.issuingStock.query({'limit': 10});
        for await (let stock of stocks) {
            assert(typeof stock.id == 'string');
        }
    });
});

describe('TestIssuingIssuingStockPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingStock.page({ limit: 5, cursor: cursor });
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

describe('TestIssuingIssuingStockGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let stocks = await starkinfra.issuingStock.query({'limit': 1});
        for await (let stock of stocks) {
            assert(typeof stock.id == 'string');
            stock = await starkinfra.issuingStock.get(stock.id);
            assert(typeof stock.id == 'string');
        }
    });
});
