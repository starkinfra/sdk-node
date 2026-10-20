const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user.js').exampleProject;


describe('TestPixKeyHolmesLogQuery', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const logs = await starkinfra.pixKeyHolmes.log.query({limit: 10});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            assert(typeof log.type == 'string');
            assert(typeof log.holmes.id == 'string');
            i += 1;
        }
        assert(i > 0);
    });
});


describe('TestPixKeyHolmesLogPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixKeyHolmes.log.page({limit: 2, cursor: cursor});
            for (let log of page) {
                assert(!ids.includes(log.id));
                ids.push(log.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length === 4);
    });
});


describe('TestPixKeyHolmesLogGet', function () {
    this.timeout(10000);
    it('test_success', async () => {
        const logs = await starkinfra.pixKeyHolmes.log.query({limit: 1});
        for await (let log of logs) {
            const logId = log.id;
            const fetched = await starkinfra.pixKeyHolmes.log.get(logId);
            assert(fetched.id === logId);
            assert(typeof fetched.holmes.id == 'string');
        }
    });
});
