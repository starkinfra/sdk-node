const assert = require('assert');
const starkinfra = require('../index.js');
const fixtures = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');
const { httpBoundary, collect } = fixtures;

starkinfra.user = require('./utils/user').exampleProject;


const agent = {
    id: '5740688905863168',
    name: 'Support assistant',
    model: 'bender-1.0',
    systemPrompt: 'Answer in one short sentence.',
    voiceId: '',
    knowledgeBaseIds: ['5083538508480512'],
    metadataSchema: { order_id: { type: 'string' } },
    created: '2026-09-30T15:42:56.879325+00:00',
    updated: '2026-09-30T15:42:56.879334+00:00'
};

describe('TestAiAgent', function() {
    this.timeout(30000);

    it('test_create_returns_the_agent_with_the_schema_keys_as_written', async () => {
        const knowledgeBase = await fixtures.knowledgeBase();
        const created = await fixtures.agent();
        assert(typeof created.id === 'string');
        assert.strictEqual(created.model, 'bender-1.0');
        assert.deepStrictEqual(created.knowledgeBaseIds, [knowledgeBase.id]);
        assert.deepStrictEqual(Object.keys(created.metadataSchema), ['order_id']);
        assert(typeof created.created === 'string');
    });

    it('test_get_and_expand_knowledge_bases', async () => {
        const knowledgeBase = await fixtures.knowledgeBase();
        const created = await fixtures.agent();
        const plain = await starkinfra.aiAgent.get(created.id);
        assert.strictEqual(plain.id, created.id);
        assert.strictEqual(plain.knowledgeBases, null);
        const expanded = await starkinfra.aiAgent.get(created.id, { expand: ['knowledgeBases'] });
        assert.deepStrictEqual(expanded.knowledgeBases.map(entity => entity.id), [knowledgeBase.id]);
    });

    it('test_update_keeps_the_knowledge_bases_it_was_not_asked_to_change', async () => {
        const knowledgeBase = await fixtures.knowledgeBase();
        const created = await fixtures.agent();
        try {
            const renamed = await starkinfra.aiAgent.update(created.id, { name: 'renamed-by-sdk' });
            assert.strictEqual(renamed.name, 'renamed-by-sdk');
            assert.deepStrictEqual(renamed.knowledgeBaseIds, [knowledgeBase.id]);
            assert.deepStrictEqual(Object.keys(renamed.metadataSchema), ['order_id']);
        } finally {
            await starkinfra.aiAgent.update(created.id, { name: created.name });
        }
    });

    it('test_update_with_an_empty_list_clears_the_knowledge_bases', async () => {
        const knowledgeBase = await fixtures.knowledgeBase();
        const extra = await starkinfra.aiAgent.create(fixtures.generateExampleAiAgent({ knowledgeBaseIds: [knowledgeBase.id] }));
        try {
            const cleared = await starkinfra.aiAgent.update(extra.id, { knowledgeBaseIds: [] });
            assert.deepStrictEqual(cleared.knowledgeBaseIds, []);
        } finally {
            await starkinfra.aiAgent.delete([extra.id]);
        }
    });

    it('test_delete_returns_the_deleted_agents', async () => {
        const extra = await starkinfra.aiAgent.create(fixtures.generateExampleAiAgent());
        const deleted = await starkinfra.aiAgent.delete([extra.id]);
        assert.deepStrictEqual(deleted.map(entity => entity.id), [extra.id]);
    });

    it('test_create_with_invalid_model_raises_input_errors', async () => {
        await assert.rejects(
            starkinfra.aiAgent.create(new starkinfra.AiAgent({ name: 'invalid', model: 'gpt' })),
            starkcoreError.InputErrors
        );
    });

    it('test_get_unknown_id_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiAgent.get('0000000000000000'), starkcoreError.InputErrors);
    });
});

describe('TestAiAgentAtTheHttpBoundary', function() {
    const boundary = httpBoundary();

    afterEach(() => boundary.restore());

    it('test_create_sends_only_the_creatable_fields_and_does_not_touch_the_schema_keys', async () => {
        boundary.answerWith({ agent: agent });
        const schema = { order_id: { type: 'string' }, isUrgent: { type: 'boolean' } };
        const input = new starkinfra.AiAgent({
            name: 'Support assistant',
            model: 'bender-1.0',
            systemPrompt: 'Be brief.',
            voiceId: '5632499082330112',
            knowledgeBaseIds: ['5083538508480512'],
            metadataSchema: schema,
            id: '5740688905863168',
            created: '2026-09-30T15:42:56+00:00',
            updated: '2026-09-30T15:42:56+00:00'
        });
        await starkinfra.aiAgent.create(input);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'POST');
        assert(boundary.requests[0].url.endsWith('/v2/ai-agent'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(), {
            name: 'Support assistant',
            model: 'bender-1.0',
            systemPrompt: 'Be brief.',
            voiceId: '5632499082330112',
            knowledgeBaseIds: ['5083538508480512'],
            metadataSchema: { order_id: { type: 'string' }, isUrgent: { type: 'boolean' } }
        });
    });

    it('test_an_empty_voice_id_is_sent_as_null', async () => {
        boundary.answerWith({ agent: agent });
        await starkinfra.aiAgent.create(new starkinfra.AiAgent({ name: 'a', model: 'bender-1.0', voiceId: '' }));
        assert.deepStrictEqual(boundary.bodyOf(), {
            name: 'a',
            model: 'bender-1.0',
            systemPrompt: null,
            voiceId: null,
            knowledgeBaseIds: null,
            metadataSchema: null
        });
    });

    it('test_create_keeps_empty_lists_and_does_not_rewrite_the_callers_schema', async () => {
        boundary.answerWith({ agent: agent });
        const schema = { order_id: { type: 'string', description: null } };
        await starkinfra.aiAgent.create(new starkinfra.AiAgent({
            name: 'a',
            model: 'prime-1.0',
            knowledgeBaseIds: [],
            metadataSchema: schema
        }));
        assert.deepStrictEqual(boundary.bodyOf().knowledgeBaseIds, []);
        assert.deepStrictEqual(schema, { order_id: { type: 'string', description: null } });
    });

    it('test_get_with_expand_keeps_the_knowledge_bases', async () => {
        boundary.answerWith({
            agent: Object.assign({
                knowledgeBases: [{
                    id: '5083538508480512',
                    name: 'Docs',
                    rootUrl: 'https://docs.starkinfra.com',
                    status: 'success'
                }]
            }, agent)
        });
        const fetched = await starkinfra.aiAgent.get('5740688905863168', { expand: ['knowledgeBases'] });
        const url = boundary.requests[0].url;
        assert(url.includes('expand=knowledgeBases'), url);
        assert.strictEqual(fetched.knowledgeBases[0].name, 'Docs');
    });

    it('test_update_without_knowledge_base_ids_reads_them_first_and_sends_them_back', async () => {
        boundary.answerWith({ agent: { id: '5740688905863168', knowledgeBaseIds: ['5083538508480512'] } }, { agent: agent });
        await starkinfra.aiAgent.update('5740688905863168', { name: 'Renamed' });
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'GET');
        assert(boundary.requests[0].url.endsWith('/v2/ai-agent/5740688905863168'), boundary.requests[0].url);
        assert.strictEqual(boundary.requests[1].method.toUpperCase(), 'PATCH');
        assert(boundary.requests[1].url.endsWith('/v2/ai-agent/5740688905863168'), boundary.requests[1].url);
        assert.deepStrictEqual(boundary.bodyOf(1), { name: 'Renamed', knowledgeBaseIds: ['5083538508480512'] });
    });

    it('test_update_with_knowledge_base_ids_does_not_read_the_agent', async () => {
        boundary.answerWith({ agent: agent });
        await starkinfra.aiAgent.update('5740688905863168', { knowledgeBaseIds: [] });
        assert.strictEqual(boundary.requests.length, 1);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'PATCH');
        assert.deepStrictEqual(boundary.bodyOf(), { knowledgeBaseIds: [] });
    });

    it('test_delete_sends_ids_in_the_query_string_and_no_body', async () => {
        boundary.answerWith({ agents: [agent] });
        const deleted = await starkinfra.aiAgent.delete(['5740688905863168', '5740688905863169']);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'DELETE');
        assert(boundary.requests[0].url.endsWith('/v2/ai-agent?ids=5740688905863168%2C5740688905863169'), boundary.requests[0].url);
        assert.strictEqual(boundary.requests[0].data, undefined);
        assert.deepStrictEqual(deleted.map(entity => entity.id), ['5740688905863168']);
    });
});

describe('TestAiAgentConstructor', function() {
    it('test_an_empty_voice_id_is_read_as_not_given', () => {
        const agent = new starkinfra.AiAgent({ name: 'a', model: 'bender-1.0', voiceId: '' });
        assert.strictEqual(agent.voiceId, null);
    });

    it('test_the_knowledge_bases_are_parsed', () => {
        const agent = new starkinfra.AiAgent({
            name: 'a',
            model: 'bender-1.0',
            knowledgeBases: [{ id: '5083538508480512', name: 'Docs', rootUrl: 'https://docs.starkinfra.com' }]
        });
        assert(agent.knowledgeBases[0] instanceof starkinfra.AiKnowledgeBase);
        assert.strictEqual(agent.knowledgeBases[0].name, 'Docs');
    });
});
