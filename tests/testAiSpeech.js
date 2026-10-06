const assert = require('assert');
const starkinfra = require('../index.js');
const { collect, httpBoundary } = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestAiSpeechCreate', function() {
    this.timeout(30000);
    let speech;

    before(async function() {
        const voices = await collect(await starkinfra.aiVoice.query());
        const ready = voices.find(entity => entity.status === 'success');
        if (!ready) {
            return this.skip();
        }
        speech = await starkinfra.aiSpeech.create(new starkinfra.AiSpeech({ voiceId: ready.id, text: 'Short test.' }));
    });

    it('test_create_returns_the_synthesized_audio', () => {
        assert(typeof speech.id === 'string');
        assert.strictEqual(speech.status, 'success');
        assert.strictEqual(speech.text, 'Short test.');
        assert(speech.audio);
    });

    it('test_get_returns_the_audio', async () => {
        const fetched = await starkinfra.aiSpeech.get(speech.id);
        assert.strictEqual(fetched.id, speech.id);
        assert(fetched.audio);
    });

    it('test_expand_voice_name', async () => {
        const fetched = await starkinfra.aiSpeech.get(speech.id, { expand: ['voiceName'] });
        assert(fetched.voiceName);
    });
});

describe('TestAiSpeechQuery', function() {
    this.timeout(20000);

    it('test_query_with_limit_stops_at_the_limit', async () => {
        const found = await collect(await starkinfra.aiSpeech.query({ limit: 1 }));
        assert(found.length <= 1);
    });

    it('test_query_leaves_the_audio_out', async () => {
        for (let entity of await collect(await starkinfra.aiSpeech.query())) {
            assert(typeof entity.id === 'string');
            assert(typeof entity.created === 'string');
            assert(entity.audio === null);
        }
    });
});

describe('TestAiSpeechGet', function() {
    this.timeout(20000);

    it('test_get_unknown_id_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiSpeech.get('0000000000000000'), starkcoreError.InputErrors);
    });
});

describe('TestAiSpeechQueryAtTheHttpBoundary', function() {
    const boundary = httpBoundary();
    const first = { id: '5646488461901824', voiceId: '5632499082330112', text: 'Short test.', status: 'success' };
    const second = { id: '5646488461901825', voiceId: '5632499082330112', text: 'Another one.', status: 'success' };

    afterEach(() => boundary.restore());

    it('test_query_follows_the_cursor_until_it_runs_out', async () => {
        boundary.answerWith(
            { cursor: 'next-page', speeches: [first] },
            { cursor: null, speeches: [second] }
        );
        const found = await collect(await starkinfra.aiSpeech.query());
        assert.deepStrictEqual(found.map(entity => entity.id), ['5646488461901824', '5646488461901825']);
        assert(!boundary.requests[0].url.includes('cursor'), boundary.requests[0].url);
        assert(boundary.requests[1].url.includes('cursor=next-page'), boundary.requests[1].url);
    });

    it('test_query_with_limit_stops_without_asking_for_another_page', async () => {
        boundary.answerWith({ cursor: 'next-page', speeches: [first] });
        const found = await collect(await starkinfra.aiSpeech.query({ limit: 1 }));
        assert.strictEqual(found.length, 1);
        assert.strictEqual(boundary.requests.length, 1);
    });
});
