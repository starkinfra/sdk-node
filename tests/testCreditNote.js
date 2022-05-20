const assert = require('assert');
const starkinfra = require('../index.js');
const {templateId} = require('./utils/user');
const {bacenId} = require("../index");

starkinfra.user = require('./utils/user').exampleProject;

describe('TestCreditNotePost', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let notes = [];
        notes.push(new starkinfra.CreditNote(exampleCreditNote));
        notes = await starkinfra.creditNote.create(notes);
        for (let note of notes) {
            console.log(note)
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

let exampleCreditNote = {
    templateId: templateId,
    name: 'Jamie Lannister',
    taxId: '012.345.678-90',
    nominalAmount: 100000,
    scheduled: '2022-05-28',
    invoices: [
        new starkinfra.creditNote.Invoice({
            due: '2023-06-25',
            amount: 120000,
            fine: 10,
            interest: 2
        })
    ],
    tags: ['test', 'testing'],
    payment: {
        bankCode: '00000000',
        branchCode: '1234',
        accountNumber: '129340-1',
        name: 'Jamie Lannister',
        taxId: '012.345.678-90'
    },
    paymentType: 'transfer',
    signers: [
        {
            name: 'Jamie Lannister',
            contact: 'jamie.lannister.01330e4c-bf92-4a54-8349-a540b90aa24e@invaliddomain.com',
            method: 'link'
        }
    ],
    externalId: bacenId.create("12345678")
}
