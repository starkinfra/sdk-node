const assert = require('assert');
const starkinfra = require('../index.js');
const { collect, speechAudio, httpBoundary } = require('./utils/aiFixtures');

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


describe('TestAiTranscriptPageAtTheHttpBoundary', function() {
    const boundary = httpBoundary();
    const item = { id: '5646488461901824', status: 'success', text: 'Hello.' };

    afterEach(() => boundary.restore());

    it('test_page_returns_the_items_and_the_cursor', async () => {
        boundary.answerWith({ cursor: 'next-page', transcripts: [item] });
        const [items, cursor] = await starkinfra.aiTranscript.page({ limit: 1, cursor: 'current-page' });
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0].id, item.id);
        assert.strictEqual(cursor, 'next-page');
        assert.strictEqual(boundary.requests.length, 1);
        assert.strictEqual(new URL(boundary.requests[0].url).searchParams.get('limit'), '1');
        assert.strictEqual(new URL(boundary.requests[0].url).searchParams.get('cursor'), 'current-page');
    });

    it('test_page_returns_a_null_cursor_on_the_last_page', async () => {
        boundary.answerWith({ cursor: null, transcripts: [item] });
        const [items, cursor] = await starkinfra.aiTranscript.page();
        assert.strictEqual(items.length, 1);
        assert.strictEqual(cursor, null);
        assert.strictEqual(new URL(boundary.requests[0].url).searchParams.get('cursor'), null);
    });
});
