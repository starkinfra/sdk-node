const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingDesignQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let designs = await starkinfra.issuingDesign.query({'limit': 10});
        for await (let design of designs) {
            assert(typeof design.id == 'string');
        }
    });
});

describe('TestIssuingDesignPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingDesign.page({ limit: 5, cursor: cursor });
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

describe('TestIssuingDesignGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let designs = await starkinfra.issuingDesign.query({'limit': 1});
        for await (let design of designs) {
            assert(typeof design.id == 'string');
            design = await starkinfra.issuingDesign.get(design.id);
            assert(typeof design.id == 'string');
        }
    });
});

describe('TestIssuingDesignPdfGet', function(){
    this.timeout(30000);
    it('test_success', async () => {
        let designs = await starkinfra.issuingDesign.query({limit: 1});
        for await (let design of designs) {
            assert(typeof design.id == 'string');
            let pdf = await starkinfra.issuingDesign.pdf(design.id);
            assert(Buffer.isBuffer(pdf));
        }
    });
});
