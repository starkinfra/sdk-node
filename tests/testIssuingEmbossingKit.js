const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user.js').exampleProject;


describe('TestIssuingEmbossingKitQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let kits = await starkinfra.issuingEmbossingKit.query({'limit': 10});
        for await (let kit of kits) {
            assert(typeof kit.id == 'string');
        }
    });
});

describe('TestIssuingEmbossingKitPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingEmbossingKit.page({ limit: 5, cursor: cursor });
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

describe('TestIssuingEmbossingKitGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let kits = await starkinfra.issuingEmbossingKit.query({'limit': 1});
        for await (let kit of kits) {
            assert(typeof kit.id == 'string');
            kit = await starkinfra.issuingEmbossingKit.get(kit.id);
            assert(typeof kit.id == 'string');
        }
    });
});
