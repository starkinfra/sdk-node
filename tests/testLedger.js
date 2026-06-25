const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleLedgerJson} = require('./utils/ledger');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestLedgerPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ledgers = await starkinfra.ledger.create(generateExampleLedgerJson(3));
        for await (let ledger of ledgers) {
            let checkLedger = await starkinfra.ledger.get(ledger.id);
            assert(ledger.id === checkLedger.id);
        }
    });
});

describe('TestLedgerQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ledgers = await starkinfra.ledger.query({'limit': 10});
        for await (let ledger of ledgers) {
            assert(typeof ledger.id == 'string');
        }
    });
});

describe('TestLedgerPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.ledger.page({ 'limit': 2, 'cursor': cursor });
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

describe('TestLedgerGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ledgers = await starkinfra.ledger.query({'limit': 1});
        for await (let ledger of ledgers) {
            assert(typeof ledger.id == 'string');
            ledger = await starkinfra.ledger.get(ledger.id);
            assert(typeof ledger.id == 'string');
        }
    });
});

describe('TestLedgerUpdate', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ledgers = await starkinfra.ledger.query({'limit': 1});
        for await (let ledger of ledgers) {
            let updatedLedger = await starkinfra.ledger.update(ledger.id, {
                'rules': [
                    new starkinfra.ledger.Rule({ key: 'minimumBalance', value: 0 }),
                ],
            });
            assert(typeof updatedLedger.id == 'string');
        }
    });
});
