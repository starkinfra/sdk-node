const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingBillingTransactionGet', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const transactions = await starkinfra.issuingBillingTransaction.query({limit: 5});
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
            i += 1;
        }
        assert(i === 5);
    });

    it('test_success_datetime', async () => {
        const transactions = await starkinfra.issuingBillingTransaction.query({limit: 5});
        for await (let transaction of transactions) {
            assert(typeof transaction.id == 'string');
            if (transaction.created != null) {
                assert(transaction.created);
            }
        }
    });
});


describe('TestIssuingBillingTransactionGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingBillingTransaction.page({limit: 5, cursor: cursor});
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


describe('TestIssuingBillingTransactionQueryParams', function () {
    this.timeout(10000);
    it('test_success', async () => {
        const transactions = await starkinfra.issuingBillingTransaction.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            tags: ['travel', 'food'],
        });
        assert(transactions.length === undefined);
    });

    it('test_success_invoice_id', async () => {
        let invoiceId = null;
        const invoices = await starkinfra.issuingBillingInvoice.query({limit: 1});
        for await (let invoice of invoices) {
            invoiceId = invoice.id;
        }
        if (invoiceId != null) {
            let i = 0;
            const transactions = await starkinfra.issuingBillingTransaction.query({limit: 5, invoiceId: invoiceId});
            for await (let transaction of transactions) {
                assert(typeof transaction.id == 'string');
                i += 1;
            }
            assert(i >= 0);
        }
    });
});


describe('TestIssuingBillingTransactionPageParams', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let transactions = null;
        [transactions, cursor] = await starkinfra.issuingBillingTransaction.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            tags: ['travel', 'food'],
        });
        assert(transactions.length === 0);
    });
});
