const assert = require('assert');
const starkinfra = require('../index.js');
const uniqueId = require('./utils/uniqueId.js')

starkinfra.user = require('./utils/user').exampleProject;

describe('TestCreditNotePost', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let requests = [];
        requests.push(new starkinfra.CreditNote(exampleCreditNote));
        requests = await starkinfra.creditNote.create(requests);
        for (let request of requests) {
            assert(typeof request.id == 'string');
        }
    });
});

describe('TestCreditNoteGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const requests = await starkinfra.creditNote.query({limit: 2});
        for await (let request of requests) {
            assert(typeof request.id == 'string');
            i += 1;
        }
        assert(i === 2);
    });
});

describe('TestCreditNoteInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.creditNote.query({limit: 3});
        for await (let request of requests) {
            assert(typeof request.id == 'string');
            request = await starkinfra.creditNote.get(request.id);
            assert(typeof request.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let requests = await starkinfra.creditNote.query({limit: 10});
        let requestsIdsExpected = [];
        for await (let request of requests) {
            requestsIdsExpected.push(request.id);
        }

        let requestsResult = await starkinfra.creditNote.query({ids: requestsIdsExpected});
        let requestsIdsResult = [];
        for await (let request of requestsResult){
            requestsIdsResult.push(request.id);
        }

        requestsIdsExpected.sort();
        requestsIdsResult.sort();
        assert(requestsIdsExpected.length === requestsIdsResult.length);
        for (let i=0; i<requestsIdsExpected.length; i++){
            assert(requestsIdsExpected[i] === requestsIdsResult[i]);
        }
    });
});

describe('TestCreditNoteGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.creditNote.page({ limit: 5, cursor: cursor });
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

describe('TestCreditNoteQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const requests = await starkinfra.creditNote.query({
            fields: ['amount', 'id'],
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'success',
            tags: ['test'],
            ids: ['1','2']
        });
        assert(requests.length===undefined)
    });
});

describe('TestCreditNoteQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.creditNote.page({
            fields: ['amount', 'id'],
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'success',
            tags: ['test'],
            ids: ['1','2']
        });
        assert(requests.length===0)
    });
});

let exampleCreditNote = {
    templateId: "5745297539989504",
    name: "Jamie Lannister",
    taxId: "012.345.678-90",
    nominalAmount: 100000,
    scheduled: "2022-04-28",
    invoices: [
        {
            due: "2023-06-25",
            amount: 120000,
            fine: 10,
            interest: 2
        }
    ],
    tags: ["test", "testing"],
    transfer: {
        bankCode: "00000000",
        branchCode: "1234",
        accountNumber: "129340-1",
        name: "Jamie Lannister",
        taxId: "012.345.678-90"
    },
    signers: [
        {
            name: "Jamie Lannister",
            contact: "jamie.lannister@gmail.com",
            method: "link"
        }
    ],
}
