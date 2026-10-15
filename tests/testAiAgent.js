const assert = require('assert');
const starkinfra = require('../index.js');
const fixtures = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');
const { collect } = fixtures;

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

    it('test_update_keeps_the_knowledge_bases_when_none_are_given', async () => {
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

    it('test_update_accepts_an_empty_voice_id', async () => {
        const created = await fixtures.agent();
        const updated = await starkinfra.aiAgent.update(created.id, { voiceId: '' });
        assert.strictEqual(updated.voiceId, '');
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

describe('TestAiAgentConstructor', function() {
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

describe('TestAiAgentQueryLimit', function() {
    this.timeout(30000);

    it('test_query_with_limit_stops_at_the_limit', async () => {
        await fixtures.agent();
        const found = await collect(await starkinfra.aiAgent.query({ limit: 1 }));
        assert.strictEqual(found.length, 1);
    });
});

describe('TestAiAgentPage', function() {
    this.timeout(30000);

    it('test_page_returns_the_items_and_a_cursor', async () => {
        await fixtures.agent();
        const [items, cursor] = await starkinfra.aiAgent.page({ limit: 1 });
        assert(items.length <= 1);
        assert(cursor === null || typeof cursor === 'string');
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiAgent.page({ limit: 101 }), starkcoreError.InputErrors);
    });
});
