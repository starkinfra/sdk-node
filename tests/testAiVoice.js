const assert = require('assert');
const starkinfra = require('../index.js');
const { httpBoundary, collect } = require('./utils/aiFixtures');

starkinfra.user = require('./utils/user').exampleProject;


const voice = {
    id: '5631671361601536',
    name: 'Helena',
    description: 'Calm voice',
    language: 'portuguese',
    gender: 'female',
    status: 'processing',
    errors: [],
    created: '2026-10-01T14:28:24.566332+00:00',
    updated: '2026-10-01T14:28:24.566342+00:00'
};

describe('TestAiVoiceQuery', function() {
    this.timeout(20000);

    it('test_query_lists_voices_without_the_audio', async () => {
        for (let entity of await collect(await starkinfra.aiVoice.query())) {
            assert(typeof entity.id === 'string');
            assert(typeof entity.created === 'string');
            assert(entity.audio === null);
        }
    });
});

describe('TestAiVoiceAtTheHttpBoundary', function() {
    const boundary = httpBoundary();

    afterEach(() => boundary.restore());

    it('test_create_sends_only_the_creatable_fields', async () => {
        boundary.answerWith({ voice: voice });
        const input = new starkinfra.AiVoice(Object.assign({ audio: 'SUQzBAAAAAAA' }, voice));
        const created = await starkinfra.aiVoice.create(input);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'POST');
        assert(boundary.requests[0].url.endsWith('/v2/ai-voice'), boundary.requests[0].url);
        assert.deepStrictEqual(Object.keys(boundary.bodyOf()).sort(), ['audio', 'description', 'gender', 'language', 'name']);
        assert.strictEqual(created.id, '5631671361601536');
        assert.strictEqual(created.status, 'processing');
        assert.strictEqual(created.audio, null);
    });

    it('test_query_reads_the_voices_key_and_sends_no_query_string', async () => {
        boundary.answerWith({ voices: [voice] });
        const found = await collect(await starkinfra.aiVoice.query());
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'GET');
        assert(boundary.requests[0].url.endsWith('/v2/ai-voice'), boundary.requests[0].url);
        assert.deepStrictEqual(found.map(entity => entity.id), ['5631671361601536']);
    });

    it('test_delete_sends_ids_in_the_query_string_and_no_body', async () => {
        boundary.answerWith({ voices: [voice] });
        const deleted = await starkinfra.aiVoice.delete(['5631671361601536', '5631671361601537']);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'DELETE');
        assert(boundary.requests[0].url.endsWith('/v2/ai-voice?ids=5631671361601536%2C5631671361601537'), boundary.requests[0].url);
        assert.strictEqual(boundary.requests[0].data, undefined);
        assert.deepStrictEqual(deleted.map(entity => entity.id), ['5631671361601536']);
    });
});
