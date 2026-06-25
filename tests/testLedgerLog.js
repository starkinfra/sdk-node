const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestLedgerLogQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.ledger.log.query({'limit': 10});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestLedgerLogPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.ledger.log.page({ 'limit': 2, 'cursor': cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
    });
});

describe('TestLedgerLogGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.ledger.log.query({'limit': 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.ledger.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});
