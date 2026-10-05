const assert = require('assert');
const starkinfra = require('../index.js');
const { collect } = require('./utils/aiFixtures');
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
