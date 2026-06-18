const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingBillingInvoiceGet', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const invoices = await starkinfra.issuingBillingInvoice.query({limit: 5});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
            i += 1;
        }
        assert(i === 5);
    });
});


describe('TestIssuingBillingInvoiceInfoGet', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let invoices = await starkinfra.issuingBillingInvoice.query({limit: 1});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
            invoice = await starkinfra.issuingBillingInvoice.get(invoice.id);
            assert(typeof invoice.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let invoices = await starkinfra.issuingBillingInvoice.query({limit: 10});
        let idsExpected = [];
        for await (let invoice of invoices) {
            idsExpected.push(invoice.id);
        }

        let invoicesResult = await starkinfra.issuingBillingInvoice.query({ids: idsExpected});
        let idsResult = [];
        for await (let invoice of invoicesResult) {
            idsResult.push(invoice.id);
        }

        idsExpected.sort();
        idsResult.sort();
        assert(idsExpected.length === idsResult.length);
        for (let i = 0; i < idsExpected.length; i++) {
            assert(idsExpected[i] === idsResult[i]);
        }
    });
});


describe('TestIssuingBillingInvoiceGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingBillingInvoice.page({limit: 5, cursor: cursor});
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


describe('TestIssuingBillingInvoiceFields', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const invoices = await starkinfra.issuingBillingInvoice.query({limit: 5});
        for await (let invoice of invoices) {
            assert(typeof invoice.id == 'string');
            assert('taxId' in invoice);
            assert('name' in invoice);
            assert('fine' in invoice);
            assert('interest' in invoice);
            assert('amount' in invoice);
            assert('nominalAmount' in invoice);
            assert('status' in invoice);
            assert('brcode' in invoice);
            assert('link' in invoice);
            assert('due' in invoice);
            assert('start' in invoice);
            assert('end' in invoice);
            assert('created' in invoice);
            assert('updated' in invoice);
            i += 1;
        }
        assert(i > 0);
    });

    it('test_success_datetime', async () => {
        let invoices = await starkinfra.issuingBillingInvoice.query({limit: 1});
        for await (let invoice of invoices) {
            invoice = await starkinfra.issuingBillingInvoice.get(invoice.id);
            if (invoice.created != null) {
                assert(invoice.created);
            }
            if (invoice.updated != null) {
                assert(invoice.updated);
            }
            if (invoice.due != null) {
                assert(invoice.due);
            }
            if (invoice.start != null) {
                assert(invoice.start);
            }
            if (invoice.end != null) {
                assert(invoice.end);
            }
        }
    });
});


describe('TestIssuingBillingInvoiceQueryParams', function () {
    this.timeout(10000);
    it('test_success', async () => {
        const invoices = await starkinfra.issuingBillingInvoice.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'paid',
            tags: ['travel', 'food'],
            ids: ['1', '2'],
        });
        assert(invoices.length === undefined);
    });
});


describe('TestIssuingBillingInvoicePageParams', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let invoices = null;
        [invoices, cursor] = await starkinfra.issuingBillingInvoice.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'paid',
            tags: ['travel', 'food'],
        });
        assert(invoices.length === 0);
    });
});
