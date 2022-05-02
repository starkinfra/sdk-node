const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingHolderLogQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingHolder.log.query({'limit': 10});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestIssuingHolderLogGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingHolder.log.query({'limit': 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.issuingHolder.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});
