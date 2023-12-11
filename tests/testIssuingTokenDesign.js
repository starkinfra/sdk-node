const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;

 
describe('TestIssuingTokenDesignQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let designs = await starkinfra.issuingTokenDesign.query({'limit': 5});
        for await (let design of designs) {
            assert(typeof design.id == 'string');
        }
    });
}); 

describe('TestIssuingTokenPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingTokenDesign.page({'limit': 2, 'cursor': cursor});
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

describe('TestIssuingTokenDesignGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let designs = await starkinfra.issuingTokenDesign.query({'limit': 1});
        for await (let design of designs) {
            assert(typeof design.id == 'string');
            token = await starkinfra.issuingTokenDesign.get(design.id);
            assert(typeof token.id == 'string');
        }
    });
});

describe('TestIssuingDesignPdfGet', function(){
    this.timeout(30000);
    it('test_success', async () => {
        let designs = await starkinfra.issuingDesign.query({'limit': 1});
        for await (let design of designs) {
            assert(typeof design.id == 'string');
            let pdf = await starkinfra.issuingDesign.pdf(design.id);
            assert(Buffer.isBuffer(pdf));
        }
    });
});
