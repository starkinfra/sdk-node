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
