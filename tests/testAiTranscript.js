const assert = require('assert');
const starkinfra = require('../index.js');
const { collect, speechAudio } = require('./utils/aiFixtures');

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
