const assert = require('assert');
const starkinfra = require('../index.js');
const {templateId} = require('./utils/user');
const {bacenId} = require('../index');

starkinfra.user = require('./utils/user').exampleProject;

describe('TestCreditNotePost', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let notes = [];
        notes.push(new starkinfra.CreditNote(exampleCreditNote));
        notes = await starkinfra.creditNote.create(notes);
        for (let note of notes) {
            assert(typeof note.id == 'string');
        }
    });
});

describe('TestCreditNoteGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const notes = await starkinfra.creditNote.query({limit: 2});
        for await (let note of notes) {
            assert(typeof note.id == 'string');
            i += 1;
        }
        assert(i === 2);
    });
});

describe('TestCreditNoteInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let notes = await starkinfra.creditNote.query({limit: 3});
        for await (let note of notes) {
            assert(typeof note.id == 'string');
            note = await starkinfra.creditNote.get(note.id);
            assert(typeof note.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let notes = await starkinfra.creditNote.query({limit: 10});
        let notesIdsExpected = [];
        for await (let note of notes) {
            notesIdsExpected.push(note.id);
        }

        let notesResult = await starkinfra.creditNote.query({ids: notesIdsExpected});
        let notesIdsResult = [];
        for await (let note of notesResult){
            notesIdsResult.push(note.id);
        }

        notesIdsExpected.sort();
        notesIdsResult.sort();
        assert(notesIdsExpected.length === notesIdsResult.length);
        for (let i=0; i<notesIdsExpected.length; i++){
            assert(notesIdsExpected[i] === notesIdsResult[i]);
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
        const notes = await starkinfra.creditNote.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'success',
            tags: ['test'],
            ids: ['1','2']
        });
        assert(notes.length===undefined)
    });
});

describe('TestCreditNoteQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let notes = null;
        [notes, cursor] = await starkinfra.creditNote.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'success',
            tags: ['test'],
            ids: ['1','2']
        });
        assert(notes.length===0)
    });
});

describe('TestCreditNotePostAndCancel', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let notes = [];
        notes.push(new starkinfra.CreditNote(exampleCreditNote));
        notes = await starkinfra.creditNote.create(notes);
        for (let note of notes) {
            canceledNote = await starkinfra.creditNote.cancel(note.id);
            assert(canceledNote.status === 'canceled')
        }
    });
});

describe('TestCreditNotePdfGet', function(){
    this.timeout(30000);
    it('test_get_pdf', async () => {
        let notes = await starkinfra.creditNote.query({limit: 1});
        for await (let note of notes) {
            assert(typeof note.id == 'string');
            let pdf = await starkinfra.creditNote.pdf(note.id);
            const stringifiedPdf = pdf.slice(0, 4).toString('utf8');
            assert.strictEqual(stringifiedPdf, '%PDF');
        }
    });
});

describe('TestCreditNoteTransferPdfGet', function(){
    this.timeout(30000);
    it('test_get_pdf', async () => {
        let notes = await starkinfra.creditNote.query({limit: 1, status: 'success'});
        for await (let note of notes) {
            assert(typeof note.id == 'string');
            let pdf = await starkinfra.creditNote.payment(note.id);
            const stringifiedPdf = pdf.slice(0, 4).toString('utf8');
            assert.strictEqual(stringifiedPdf, '%PDF');
        }
    });
});

let exampleCreditNote = {
    externalId: "my_unique_id_" + new Date().getTime(),
    invoices: [{
        amount: 23422413,
        due: "2024-06-16"
    }],
    name: "Jamie Lannister",
    rebateAmount: 0,
    scheduled: "2023-06-07",
    signers: [{
        contact: "https://b591-179-191-69-138.sa.ngrok.io",
        method: "server",
        name: "Jamie Lannister"
    }],
    taxId: "012.345.678-90",
    templateId: "5707012469948416",
    paymentType: "transfer",
    payment: {
        accountNumber: "5005482",
        bankCode: "60701190",
        branchCode: "7248",
        name: "Jamie Lannister",
        taxId: "594.739.480-42"
    },
    city: "São Paulo",
    stateCode: "SP",
    district: "Jardim Paulista",
    streetLine1: "Rua ABC",
    streetLine2: "Ap 123",
    zipCode: "01234-567"
}
