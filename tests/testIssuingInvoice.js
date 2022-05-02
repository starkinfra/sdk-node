const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleInvoiceJson} = require("./utils/issuingInvoice");

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingInvoiceQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let invoices = await starkinfra.issuingInvoice.query({'limit': 10});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
        }
    });
});

describe('TestIssuingInvoiceGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let invoices = await starkinfra.issuingInvoice.query({'limit': 1});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
            invoice = await starkinfra.issuingInvoice.get(invoice.id);
            assert(typeof invoice.id == 'string');
        }
    });
});

describe('TestIssuingInvoicePostAndDelete', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let invoice = await starkinfra.issuingInvoice.create(generateExampleInvoiceJson());
        assert(typeof invoice.id == 'string');
    });
});
