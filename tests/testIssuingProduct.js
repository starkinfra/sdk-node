const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingProductQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const products = await starkinfra.issuingProduct.query({});
        for await (let product of products) {
            assert(typeof product.id == 'string');
        }
    });
});


describe('TestIssuingProductPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingProduct.page({ limit: 5, cursor: cursor });
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

