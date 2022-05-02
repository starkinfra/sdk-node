const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleHolderJson} = require("./utils/issuingHolder");

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingHolderQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holders = await starkinfra.issuingHolder.query({'expand': ['rules'], 'limit': 10});
        for await (let holder of holders) {
            assert(typeof holder.id == 'string');
        }
    });
});

describe('TestIssuingHolderPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingHolder.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestIssuingHolderGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holders = await starkinfra.issuingHolder.query({'limit': 1});
        for await (let holder of holders) {
            assert(typeof holder.id == 'string');
            holder = await starkinfra.issuingHolder.get(holder.id);
            assert(typeof holder.id == 'string');
        }
    });
});

describe('TestIssuingHolderPostAndDelete', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holders = await starkinfra.issuingHolder.create(generateExampleHolderJson(2));
        for await (let holder of holders) {
            let holderId = holder.id;
            holder = await starkinfra.issuingHolder.update(holderId, {'name': 'Updated Name'})
            assert(holder.name === 'Updated Name');
            holder = await starkinfra.issuingHolder.delete(holderId);
            assert(holder.status === "canceled");
        }
    });
});
