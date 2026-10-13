const assert = require('assert');
const starkinfra = require('../index.js');
const { collect, speechAudio } = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');

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

describe('TestAiVoicePage', function() {
    this.timeout(30000);

    it('test_page_returns_the_items_and_a_cursor', async () => {
        const [items, cursor] = await starkinfra.aiVoice.page({ limit: 1 });
        assert(items.length <= 1);
        assert(cursor === null || typeof cursor === 'string');
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiVoice.page({ limit: 101 }), starkcoreError.InputErrors);
    });
});
