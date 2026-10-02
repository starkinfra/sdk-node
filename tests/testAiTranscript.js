const assert = require('assert');
const starkinfra = require('../index.js');
const { httpBoundary, collect } = require('./utils/aiFixtures');

starkinfra.user = require('./utils/user').exampleProject;


const transcript = {
    id: '5147403464212480',
    text: 'This is a short recording used to test the transcription service.',
    status: 'success',
    errors: [],
    created: '2026-10-01T14:28:04.482326+00:00',
    updated: '2026-10-01T14:28:05.752389+00:00'
};

describe('TestAiTranscriptQuery', function() {
    this.timeout(20000);

    it('test_query_lists_transcripts', async () => {
        for (let entity of await collect(await starkinfra.aiTranscript.query())) {
            assert(typeof entity.id === 'string');
            assert(typeof entity.created === 'string');
        }
    });
});

describe('TestAiTranscriptAtTheHttpBoundary', function() {
    const boundary = httpBoundary();

    afterEach(() => boundary.restore());

    it('test_create_sends_only_the_audio', async () => {
        boundary.answerWith({ transcript: transcript });
        const input = new starkinfra.AiTranscript(Object.assign({ audio: 'SUQzBAAAAAAA' }, transcript));
        const created = await starkinfra.aiTranscript.create(input);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'POST');
        assert(boundary.requests[0].url.endsWith('/v2/ai-transcript'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(), { audio: 'SUQzBAAAAAAA' });
        assert.strictEqual(created.text, transcript.text);
        assert.strictEqual(created.status, 'success');
    });

    it('test_query_reads_the_transcripts_key', async () => {
        boundary.answerWith({ transcripts: [transcript] });
        const found = await collect(await starkinfra.aiTranscript.query());
        assert(boundary.requests[0].url.endsWith('/v2/ai-transcript'), boundary.requests[0].url);
        assert.deepStrictEqual(found.map(entity => entity.id), ['5147403464212480']);
    });
});
