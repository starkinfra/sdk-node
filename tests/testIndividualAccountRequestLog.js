const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIndividualAccountRequestLogGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.individualAccountRequest.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i === 5);
    });
});


describe('TestIndividualAccountRequestLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.individualAccountRequest.log.query({limit: 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.individualAccountRequest.log.get(log.id);
            assert(typeof log.id == 'string');
            assert(typeof log.request === 'object' && log.request !== null);
        }
    });
});

describe('TestIndividualAccountRequestLogTypeEnum', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const allowed = ["approved", "created", "denied", "processing", "updated"];
        const logs = await starkinfra.individualAccountRequest.log.query({limit: 10});
        for await (let log of logs) {
            assert(allowed.includes(log.type));
        }
    });
});

describe('TestIndividualAccountRequestLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.individualAccountRequest.log.page({ limit: 5, cursor: cursor });
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


describe('TestIndividualAccountRequestLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.individualAccountRequest.log.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'created',
            accountRequestIds: ['1','2'],
        });
        assert(requests.length===undefined)
    });
});

describe('TestIndividualAccountRequestLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.individualAccountRequest.log.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'created',
            accountRequestIds: ['1','2'],
        });
        assert(requests.length===0)
    });
});
