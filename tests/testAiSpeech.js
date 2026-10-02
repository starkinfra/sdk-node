const assert = require('assert');
const starkinfra = require('../index.js');
const { httpBoundary, collect, isStarkError } = require('./utils/aiFixtures');

starkinfra.user = require('./utils/user').exampleProject;


const speech = {
    id: '5646488461901824',
    voiceId: '5632499082330112',
    text: 'Short test.',
    status: 'success',
    audio: 'SUQzBAAAAAAA',
    errors: [],
    created: '2026-10-01T14:28:06.942491+00:00',
    updated: '2026-10-01T14:28:07.605185+00:00'
};

async function findFinishedSpeech() {
    const speeches = await collect(await starkinfra.aiSpeech.query());
    return speeches.find(entity => entity.status === 'success');
}

describe('TestAiSpeechQuery', function() {
    this.timeout(20000);

    it('test_query_leaves_the_audio_out', async () => {
        for (let entity of await collect(await starkinfra.aiSpeech.query())) {
            assert(typeof entity.id === 'string');
            assert(typeof entity.created === 'string');
            assert(entity.audio === null);
        }
    });

    it('test_fields_keep_only_what_was_asked', async () => {
        for (let entity of await collect(await starkinfra.aiSpeech.query({ fields: ['id', 'status'] }))) {
            assert(typeof entity.id === 'string');
            assert(entity.text === undefined);
        }
    });
});

describe('TestAiSpeechGet', function() {
    this.timeout(20000);

    it('test_get_returns_the_audio', async function() {
        const finished = await findFinishedSpeech();
        if (!finished) {
            return this.skip();
        }
        const fetched = await starkinfra.aiSpeech.get(finished.id);
        assert.strictEqual(fetched.id, finished.id);
        assert(fetched.audio);
    });

    it('test_expand_voice_name', async function() {
        const finished = await findFinishedSpeech();
        if (!finished) {
            return this.skip();
        }
        const fetched = await starkinfra.aiSpeech.get(finished.id, { fields: ['id', 'voiceName'], expand: ['voiceName'] });
        assert(fetched.voiceName);
    });

    it('test_get_unknown_id_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiSpeech.get('0000000000000000'), isStarkError('InputErrors'));
    });
});

describe('TestAiSpeechAtTheHttpBoundary', function() {
    const boundary = httpBoundary();

    afterEach(() => boundary.restore());

    it('test_create_sends_only_the_creatable_fields', async () => {
        boundary.answerWith({ speech: speech });
        const input = new starkinfra.AiSpeech(Object.assign({ voiceName: 'Fakas' }, speech));
        const created = await starkinfra.aiSpeech.create(input);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'POST');
        assert(boundary.requests[0].url.endsWith('/v2/ai-speech'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(), { voiceId: '5632499082330112', text: 'Short test.' });
        assert.strictEqual(created.voiceId, '5632499082330112');
        assert.strictEqual(created.audio, 'SUQzBAAAAAAA');
    });

    it('test_query_reads_the_speeches_key_and_sends_fields_and_expand', async () => {
        boundary.answerWith({ speeches: [speech] });
        const found = await collect(await starkinfra.aiSpeech.query({ fields: ['id', 'voiceName'], expand: ['voiceName'] }));
        const url = boundary.requests[0].url;
        assert(url.includes('fields=id%2CvoiceName'), url);
        assert(url.includes('expand=voiceName'), url);
        assert(!url.includes('limit'), url);
        assert.deepStrictEqual(found.map(entity => entity.id), ['5646488461901824']);
    });

    it('test_get_reads_the_speech_key_without_a_double_slash', async () => {
        boundary.answerWith({ speech: speech });
        const fetched = await starkinfra.aiSpeech.get('5646488461901824');
        assert(boundary.requests[0].url.endsWith('/v2/ai-speech/5646488461901824'), boundary.requests[0].url);
        assert.strictEqual(fetched.text, 'Short test.');
    });
});
