const assert = require('assert');
const starkinfra = require('../index.js');
const { collect, speechAudio } = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestAiTranscriptCreate', function() {
    this.timeout(30000);
    let transcript;

    before(async function() {
        const audio = await speechAudio();
        if (!audio) {
            return this.skip();
        }
        transcript = await starkinfra.aiTranscript.create(new starkinfra.AiTranscript({ audio: audio }));
    });

    it('test_create_returns_the_text', () => {
        assert(typeof transcript.id === 'string');
        assert.strictEqual(transcript.status, 'success');
        assert.strictEqual(typeof transcript.text, 'string');
        assert(typeof transcript.created === 'string');
    });
});

describe('TestAiTranscriptQuery', function() {
    this.timeout(20000);

    it('test_query_with_limit_stops_at_the_limit', async () => {
        const found = await collect(await starkinfra.aiTranscript.query({ limit: 1 }));
        assert(found.length <= 1);
    });

    it('test_query_lists_transcripts', async () => {
        for (let entity of await collect(await starkinfra.aiTranscript.query())) {
            assert(typeof entity.id === 'string');
            assert(typeof entity.created === 'string');
        }
    });
});

describe('TestAiTranscriptPage', function() {
    this.timeout(30000);

    it('test_page_returns_the_items_and_a_cursor', async () => {
        const [items, cursor] = await starkinfra.aiTranscript.page({ limit: 1 });
        assert(items.length <= 1);
        assert(cursor === null || typeof cursor === 'string');
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiTranscript.page({ limit: 101 }), starkcoreError.InputErrors);
    });
});
