const assert = require('assert');
const starkinfra = require('../index.js');
const { collect, speechAudio, httpBoundary } = require('./utils/aiFixtures');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestAiVoice', function() {
    this.timeout(30000);
    let voice;

    before(async function() {
        const audio = await speechAudio();
        if (!audio) {
            return this.skip();
        }
        voice = await starkinfra.aiVoice.create(new starkinfra.AiVoice({ audio: audio, name: 'sdk-node test' }));
    });

    after(async () => {
        if (voice) {
            await starkinfra.aiVoice.delete([voice.id]);
        }
    });

    it('test_create_returns_a_processing_voice', () => {
        assert(typeof voice.id === 'string');
        assert.strictEqual(voice.status, 'processing');
        assert.strictEqual(voice.name, 'sdk-node test');
        assert(typeof voice.created === 'string');
        assert.strictEqual(voice.audio, null);
    });

    it('test_query_lists_the_created_voice_without_the_audio', async () => {
        const found = await collect(await starkinfra.aiVoice.query());
        const listed = found.find(entity => entity.id === voice.id);
        assert(listed);
        assert.strictEqual(listed.audio, null);
    });

    it('test_query_with_limit_stops_at_the_limit', async () => {
        const found = await collect(await starkinfra.aiVoice.query({ limit: 1 }));
        assert.strictEqual(found.length, 1);
    });

    it('test_delete_returns_the_deleted_voice', async () => {
        const extra = await starkinfra.aiVoice.create(new starkinfra.AiVoice({ audio: await speechAudio(), name: 'sdk-node delete test' }));
        const deleted = await starkinfra.aiVoice.delete([extra.id]);
        assert.deepStrictEqual(deleted.map(entity => entity.id), [extra.id]);
    });
});


describe('TestAiVoicePageAtTheHttpBoundary', function() {
    const boundary = httpBoundary();
    const item = { id: '5646488461901824', name: 'Helena', status: 'success' };

    afterEach(() => boundary.restore());

    it('test_page_returns_the_items_and_the_cursor', async () => {
        boundary.answerWith({ cursor: 'next-page', voices: [item] });
        const [items, cursor] = await starkinfra.aiVoice.page({ limit: 1, cursor: 'current-page' });
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0].id, item.id);
        assert.strictEqual(cursor, 'next-page');
        assert.strictEqual(boundary.requests.length, 1);
        assert.strictEqual(new URL(boundary.requests[0].url).searchParams.get('limit'), '1');
        assert.strictEqual(new URL(boundary.requests[0].url).searchParams.get('cursor'), 'current-page');
    });

    it('test_page_returns_a_null_cursor_on_the_last_page', async () => {
        boundary.answerWith({ cursor: null, voices: [item] });
        const [items, cursor] = await starkinfra.aiVoice.page();
        assert.strictEqual(items.length, 1);
        assert.strictEqual(cursor, null);
        assert.strictEqual(new URL(boundary.requests[0].url).searchParams.get('cursor'), null);
    });
});
