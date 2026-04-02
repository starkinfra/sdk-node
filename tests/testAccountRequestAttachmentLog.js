const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestAccountRequestAttachmentLogGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.accountRequestAttachment.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i > 1);
    });
});


describe('TestAccountRequestAttachmentLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.accountRequestAttachment.log.query({limit: 10});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.accountRequestAttachment.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestAccountRequestAttachmentLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.accountRequestAttachment.log.page({ limit: 5, cursor: cursor });
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

describe('TestAccountRequestAttachmentLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.accountRequestAttachment.log.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'created',
            attachmentIds: ['1', '2'],
        });
        assert(logs.length === undefined);
    });
});

describe('TestAccountRequestAttachmentLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let logs = null;
        [logs, cursor] = await starkinfra.accountRequestAttachment.log.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'created',
            attachmentIds: ['1', '2'],
        });
        assert(logs.length === 0);
    });
});
