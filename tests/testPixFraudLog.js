const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


// [M9] PixFraud.Log is a read-only sub-resource exposed under pixFraud.log
// with query/page/get only (no create/cancel). [M14] the parent's exports
// register the Log so pixFraud.log resolves. query returns a streaming
// async-iterable list of logs.
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


// [M9] log.get retrieves a single Log by id. [M14] pixFraud.log.get resolves.
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


// [M9][M12] log.page supports limit + cursor; two pages of 5 yield 10 distinct
// ids (or the cursor terminates). Cursor-based pagination, no numeric index.
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


// [M12] log.query accepts every documented filter (limit, after, before,
// types, fraudIds, ids) without rejecting any. query returns an async iterable.
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


// [M12] log.page accepts the same filters plus cursor. page returns a
// [entities, cursor] tuple, so the entities slice is a real array.
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


// [M10] Log.fraud deserializes the embedded parent into a full PixFraud object
// (fraud.id is a string on a populated log).
// [M11] Log.type is parsed as a free, NON-EMPTY string. Documented values are
// created|failed|registered|canceled, but the live API also emits transitional
// values such as "canceling" — so this MUST NOT assert a closed enum, matching
// the canonical *_log test convention (testPixRequestLog.js asserts nothing on
// type). We assert only that type is parsed and non-empty.
// [M13] Log.created is a parsed datetime field. starkcore's check.datetime
// returns a normalized STRING (not a native Date) — see
// node_modules/starkcore/starkcore/utils/check.js:72-80 — so we assert it is
// parsed and present (truthy), matching the canonical convention in
// testPixRequestLog.js. `log.created instanceof Date` would always be false.
describe('TestPixFraudLogAttributes', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.pixFraud.log.query({limit: 5});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            // [M10] embedded parent deserialized into a full PixFraud object
            assert(typeof log.fraud.id == 'string');
            // [M11] type parsed and non-empty (open set; do NOT assert a closed enum)
            assert(typeof log.type == 'string');
            assert(log.type.length > 0);
            // [M13] created parsed and present (normalized string)
            assert(log.created);
            i += 1;
        }
        assert(i === 5);
    });
});
