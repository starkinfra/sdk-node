const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIndividualAccountAttachmentLogGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.individualAccountAttachment.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            i += 1;
        }
        assert(i > 1);
    });
});


describe('TestIndividualAccountAttachmentLogInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.individualAccountAttachment.log.query({limit: 10});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.individualAccountAttachment.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestIndividualAccountAttachmentLogGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.individualAccountAttachment.log.page({ limit: 5, cursor: cursor });
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

describe('TestIndividualAccountAttachmentLogQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.individualAccountAttachment.log.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'created',
            attachmentIds: ['1', '2'],
        });
        assert(logs.length === undefined);
    });
});

describe('TestIndividualAccountAttachmentLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let logs = null;
        [logs, cursor] = await starkinfra.individualAccountAttachment.log.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            types: 'created',
            attachmentIds: ['1', '2'],
        });
        assert(logs.length === 0);
    });
});
