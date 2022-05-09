const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingInvoiceLogQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingInvoice.log.query({'limit': 10});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestIssuingInvoiceLogGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingInvoice.log.query({'limit': 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.issuingInvoice.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});
