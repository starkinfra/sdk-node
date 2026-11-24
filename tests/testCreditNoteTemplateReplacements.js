const assert = require('assert');
const axios = require('axios').default;
const PrivateKey = require('starkbank-ecdsa').PrivateKey;
const starkinfra = require('../index.js');
const {exampleCreditNote} = require('./utils/creditNote');
const {randomUUID} = require('crypto');
const {templateId, exampleProject} = require('./utils/user');

starkinfra.user = exampleProject;

const TemplateReplacements = starkinfra.creditNote.TemplateReplacements;

const templateReplacements = {
    guarantorName: 'Jon Snow',
    guarantorTaxId: '012.345.678-90',
    guarantorAddress: 'Av. Paulista, 200 - Bela Vista - Sao Paulo, SP'
};

const offlineUser = new starkinfra.Project({
    environment: 'sandbox',
    id: '5656565656565656',
    privateKey: new PrivateKey().toPem()
});

// Replaces the HTTP transport so the request is built and signed by the SDK/core but never leaves the process.
describe('TestCreditNoteTemplateReplacementsOffline', function () {
    let sentBodies;
    let originalAdapter;

    beforeEach(() => {
        sentBodies = [];
        originalAdapter = axios.defaults.adapter;
        axios.defaults.adapter = async (config) => {
            const body = JSON.parse(config.data);
            sentBodies.push(body);
            return {data: body, status: 200, statusText: 'OK', headers: {}, config: config};
        };
    });

    afterEach(() => {
        axios.defaults.adapter = originalAdapter;
    });

    it('test_request_keeps_keys_untouched', async () => {
        const notes = await starkinfra.creditNote.create(
            [{...exampleCreditNote, templateReplacements: {...templateReplacements}}],
            {user: offlineUser}
        );
        assert.deepStrictEqual(sentBodies[0].notes[0].templateReplacements, templateReplacements);
        assert.deepStrictEqual(notes[0].templateReplacements, templateReplacements);
    });

    it('test_request_keeps_keys_untouched_with_object', async () => {
        const note = new starkinfra.CreditNote({...exampleCreditNote, templateReplacements: {...templateReplacements}});
        await starkinfra.creditNote.create([note], {user: offlineUser});
        assert.deepStrictEqual(sentBodies[0].notes[0].templateReplacements, templateReplacements);
    });

    it('test_request_omits_field_when_absent', async () => {
        const notes = await starkinfra.creditNote.create([{...exampleCreditNote}], {user: offlineUser});
        assert(!('templateReplacements' in sentBodies[0].notes[0]));
        assert(!('templateReplacements' in notes[0]) || notes[0].templateReplacements === null);
    });

    it('test_object_and_raw_object_send_the_same_payload', async () => {
        const withNulls = {...templateReplacements, _internalName: 'kept', nullValue: null, undefinedValue: undefined};
        await starkinfra.creditNote.create(
            [{...exampleCreditNote, templateReplacements: {...withNulls}}],
            {user: offlineUser}
        );
        await starkinfra.creditNote.create(
            [{...exampleCreditNote, templateReplacements: new TemplateReplacements({...withNulls})}],
            {user: offlineUser}
        );
        assert.deepStrictEqual(sentBodies[1], sentBodies[0]);
        assert.deepStrictEqual(
            sentBodies[0].notes[0].templateReplacements,
            {...templateReplacements, _internalName: 'kept'}
        );
    });

    it('test_response_keys_are_not_lost', async () => {
        axios.defaults.adapter = async (config) => {
            const body = JSON.parse(config.data);
            body.notes[0].templateReplacements.keyAddedByApi = 'api';
            body.notes[0].templateReplacements.guarantorSecondAddress = 'Rua B';
            return {data: body, status: 200, statusText: 'OK', headers: {}, config: config};
        };
        const notes = await starkinfra.creditNote.create(
            [{...exampleCreditNote, templateReplacements: new TemplateReplacements({...templateReplacements})}],
            {user: offlineUser}
        );
        assert.deepStrictEqual(
            {...notes[0].templateReplacements},
            {...templateReplacements, keyAddedByApi: 'api', guarantorSecondAddress: 'Rua B'}
        );
    });
});

describe('TestCreditNoteTemplateReplacementsParsing', function () {
    const apiJson = {...templateReplacements, keyOnlyTheApiKnows: 'x', anotherCamelCaseKey: 'y'};

    it('test_response_json_becomes_object_with_every_key', () => {
        const note = new starkinfra.CreditNote({...exampleCreditNote, templateReplacements: {...apiJson}});
        assert(note.templateReplacements instanceof TemplateReplacements);
        assert.deepStrictEqual({...note.templateReplacements}, apiJson);
    });

    it('test_object_is_kept', () => {
        const replacements = new TemplateReplacements({...templateReplacements});
        const note = new starkinfra.CreditNote({...exampleCreditNote, templateReplacements: replacements});
        assert.strictEqual(note.templateReplacements, replacements);
    });

    it('test_absent_and_null_stay_null', () => {
        assert.strictEqual(new starkinfra.CreditNote({...exampleCreditNote}).templateReplacements, null);
        const note = new starkinfra.CreditNote({...exampleCreditNote, templateReplacements: null});
        assert.strictEqual(note.templateReplacements, null);
    });

    it('test_other_types_are_rejected', () => {
        for (const invalid of ['text', 7, true, ['a']]) {
            assert.throws(
                () => new starkinfra.CreditNote({...exampleCreditNote, templateReplacements: invalid}),
                /templateReplacements/
            );
        }
    });
});

// Sandbox: SANDBOX_TEMPLATE_ID must be a template enabled for the Project under test.
describe('TestCreditNotePostWithTemplateReplacements', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const templateReplacements = {
            nomeAvalista: 'Jon Snow',
            taxIdAvalista: '012.345.678-90',
            enderecoAvalista: 'Av. Paulista, 200 - Bela Vista - Sao Paulo, SP'
        };
        let notes = await starkinfra.creditNote.create([{
            ...exampleCreditNote,
            externalId: randomUUID(),
            tags: ['sdk-test'],
            templateId: templateId || exampleCreditNote.templateId,
            signers: [{name: 'Jamie Lannister', contact: 'jamie.lannister@invaliddomain.com', method: 'link'}],
            payment: {accountNumber: '129340-1', bankCode: '00000000', branchCode: '1234', name: 'Jamie Lannister', taxId: '012.345.678-90'},
            templateReplacements: new starkinfra.creditNote.TemplateReplacements(templateReplacements)
        }]);
        for (let note of notes) {
            assert(typeof note.id == 'string');
            assert.deepStrictEqual({...note.templateReplacements}, templateReplacements);
        }
    });
});
