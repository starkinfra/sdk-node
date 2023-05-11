const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleIssuingRestockJson} = require('./utils/issuingRestock');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingIssuingRestockQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let restocks = await starkinfra.issuingRestock.query({'limit': 10});
        for await (let restock of restocks) {
            assert(typeof restock.id == 'string');
        }
    });
});

describe('TestIssuingIssuingRestockPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingRestock.page({ limit: 5, cursor: cursor });
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

describe('TestIssuingIssuingRestockGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let restocks = await starkinfra.issuingRestock.query({'limit': 1});
        for await (let restock of restocks) {
            assert(typeof restock.id == 'string');
            restock = await starkinfra.issuingRestock.get(restock.id);
            assert(typeof restock.id == 'string');
        }
    });
});

describe('TestIssuingIssuingRestockPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let restock = (await starkinfra.issuingRestock.create(await generateExampleIssuingRestockJson(1)))[0];
        assert(typeof restock.id == 'string');
    });
});
