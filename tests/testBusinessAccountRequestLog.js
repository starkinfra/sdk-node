const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBusinessAccountRequestLogGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.businessAccountRequest.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i > 1);
    });
});

describe('TestBusinessAccountRequestLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.businessAccountRequest.log.query({limit: 1});
        for await (let log of logs) {
            let logGet = await starkinfra.businessAccountRequest.log.get(log.id);
            assert(typeof logGet.id == 'string');
            assert.strictEqual(log.id, logGet.id);
        }
    });
});

describe('TestBusinessAccountRequestLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.businessAccountRequest.log.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length > 1);
    });
});


describe('TestBusinessAccountRequestLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.businessAccountRequest.log.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'denied',
            accountRequestIds: ['1','2'],
        });
        assert(requests.length===undefined)
    });
});

describe('TestBusinessAccountRequestLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.businessAccountRequest.log.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'denied',
            accountRequestIds: ['1','2'],
        });
        assert(requests.length===0)
    });
});
