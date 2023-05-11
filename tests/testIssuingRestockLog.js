const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingRestockLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingRestock.log.query({limit: 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.issuingRestock.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestIssuingRestockLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingRestock.log.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length === 10);
    });
});


describe('TestIssuingRestockLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const logs = await starkinfra.issuingRestock.log.query({
            limit: 2,
            after: '2021-04-01',
            before: '2025-04-30',
            types: 'created'
        });
        assert(logs.length === undefined)
    });
});

describe('TestIssuingRestockLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let logs = null;
        [logs, cursor] = await starkinfra.issuingRestock.log.page({
            limit: 2,
            after: '2021-04-01',
            before: '2025-04-30',
            types: 'created'
        });
        assert(logs.length > 0)
    });
});
