const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingBillingInvoiceQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let invoices = await starkinfra.issuingBillingInvoice.query({'limit': 10});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
        }
    });
});

describe('TestIssuingBillingInvoiceGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let invoices = await starkinfra.issuingBillingInvoice.query({'limit': 1});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
            invoice = await starkinfra.issuingBillingInvoice.get(invoice.id);
            assert(typeof invoice.id == 'string');
        }
    });
});

describe('TestIssuingBillingInvoicePage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingBillingInvoice.page({ limit: 5, cursor: cursor });
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
