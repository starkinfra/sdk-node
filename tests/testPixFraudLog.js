const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixFraudLogGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.pixFraud.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i === 5);
    });
});


describe('TestPixFraudLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.pixFraud.log.query({limit: 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.pixFraud.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});


describe('TestPixFraudLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixFraud.log.page({limit: 5, cursor: cursor});
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


describe('TestPixFraudLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const logs = await starkinfra.pixFraud.log.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: ['created', 'registered'],
            fraudIds: ['1', '2'],
            ids: ['1', '2'],
        });
        assert(logs.length === undefined);
    });
});


describe('TestPixFraudLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let logs = null;
        [logs, cursor] = await starkinfra.pixFraud.log.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: ['created', 'registered'],
            fraudIds: ['1', '2'],
            ids: ['1', '2'],
        });
        assert(logs.length === 0);
    });
});


describe('TestPixFraudLogAttributes', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.pixFraud.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            assert(typeof log.fraud.id == 'string');
            assert(typeof log.type == 'string');
            assert(log.type.length > 0);
            assert(log.created);
            i += 1;
        }
        assert(i === 5);
    });
});
