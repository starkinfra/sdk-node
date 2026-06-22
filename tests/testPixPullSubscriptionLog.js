const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixPullSubscriptionLogGet', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.pixPullSubscription.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i <= 5);
    });
});


describe('TestPixPullSubscriptionLogInfoGet', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.pixPullSubscription.log.query({limit: 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.pixPullSubscription.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});


describe('TestPixPullSubscriptionLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixPullSubscription.log.page({limit: 5, cursor: cursor});
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length <= 10);
    });
});


describe('TestPixPullSubscriptionLogQueryParams', function () {
    this.timeout(10000);
    it('test_success', async () => {
        const logs = await starkinfra.pixPullSubscription.log.query({
            limit: 2,
            after: '2026-01-01',
            before: '2026-04-30',
            types: 'failed',
            subscriptionIds: ['1', '2'],
        });
        assert(logs.length === undefined);
    });
});
