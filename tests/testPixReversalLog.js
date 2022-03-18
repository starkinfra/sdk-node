const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixReversalLogGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.pixReversal.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i === 5);
    });
});


describe('TestPixReversalLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.pixReversal.log.query({limit: 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.pixReversal.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestPixReversalLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixReversal.log.page({ limit: 5, cursor: cursor });
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


describe('TestPixReversalLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const reversals = await starkinfra.pixReversal.log.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'failed',
            reversalIds: ['1','2'],
        });
        assert(reversals.length===undefined)
    });
});

describe('TestPixReversalLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let reversals = null;
        [reversals, cursor] = await starkinfra.pixReversal.log.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'failed',
            reversalIds: ['1','2'],
        });
        assert(reversals.length===0)
    });
});
