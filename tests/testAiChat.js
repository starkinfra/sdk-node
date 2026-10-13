const assert = require('assert');
const starkinfra = require('../index.js');
const fixtures = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');
const { collect } = fixtures;

starkinfra.user = require('./utils/user').exampleProject;


const chat = {
    id: '5761660895625216',
    agentId: '5740688905863168',
    title: 'Support chat',
    updated: '2026-09-30T15:42:58.464506+00:00'
};

describe('TestAiChat', function() {
    this.timeout(30000);

    it('test_create_returns_the_chat', async () => {
        const agent = await fixtures.agent();
        const created = await fixtures.chat();
        assert(typeof created.id === 'string');
        assert.strictEqual(created.agentId, agent.id);
        assert(typeof created.updated === 'string');
    });

    it('test_get_and_expand_agent_name', async () => {
        const agent = await fixtures.agent();
        const created = await fixtures.chat();
        assert((await starkinfra.aiChat.get(created.id)).agentName === null);
        assert.strictEqual((await starkinfra.aiChat.get(created.id, { expand: ['agentName'] })).agentName, agent.name);
    });

    it('test_tags_and_context_are_stored_filtered_and_replaced_as_a_whole', async () => {
        const agent = await fixtures.agent();
        const tag = 'sdk-node-' + Date.now();
        const created = await starkinfra.aiChat.create(new starkinfra.AiChat({
            agentId: agent.id,
            title: 'tags and context',
            tags: [tag],
            context: { name: 'Ana', balance: 1520.33 }
        }));
        assert.deepStrictEqual(created.tags, [tag]);
        assert.deepStrictEqual(created.context, { name: 'Ana', balance: 1520.33 });
        const found = await collect(await starkinfra.aiChat.query({ tags: [tag, 'another-tag'] }));
        assert.deepStrictEqual(found.map(entity => entity.id), [created.id]);
        const changed = await starkinfra.aiChat.update(created.id, { context: { name: 'Ana', balance: 10 } });
        assert.deepStrictEqual(changed.context, { name: 'Ana', balance: 10 });
        assert.deepStrictEqual(changed.tags, [tag]);
        const cleared = await starkinfra.aiChat.update(created.id, { tags: [], context: {} });
        assert.deepStrictEqual(cleared.tags, []);
        assert.deepStrictEqual(cleared.context, {});
        await starkinfra.aiChat.delete([created.id]);
    });

    it('test_query', async () => {
        const created = await fixtures.chat();
        const found = await collect(await starkinfra.aiChat.query());
        assert(found.map(entity => entity.id).includes(created.id));
    });

    it('test_update_changes_only_the_title', async () => {
        const created = await fixtures.chat();
        try {
            const updated = await starkinfra.aiChat.update(created.id, { title: 'renamed-by-sdk' });
            assert.strictEqual(updated.title, 'renamed-by-sdk');
            assert.strictEqual(updated.agentId, created.agentId);
        } finally {
            await starkinfra.aiChat.update(created.id, { title: created.title });
        }
    });

    it('test_create_with_unknown_agent_raises_input_errors', async () => {
        await assert.rejects(
            starkinfra.aiChat.create(new starkinfra.AiChat({ agentId: '0000000000000000' })),
            starkcoreError.InputErrors
        );
    });

    it('test_get_unknown_id_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiChat.get('0000000000000000'), starkcoreError.InputErrors);
    });
});

describe('TestAiChatQueryLimit', function() {
    this.timeout(30000);

    it('test_query_with_limit_stops_at_the_limit', async () => {
        await fixtures.chat();
        const found = await collect(await starkinfra.aiChat.query({ limit: 1 }));
        assert.strictEqual(found.length, 1);
    });
});

describe('TestAiChatPage', function() {
    this.timeout(30000);

    it('test_page_returns_the_items_and_a_cursor', async () => {
        await fixtures.chat();
        const [items, cursor] = await starkinfra.aiChat.page({ limit: 1 });
        assert(items.length <= 1);
        assert(cursor === null || typeof cursor === 'string');
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiChat.page({ limit: 101 }), starkcoreError.InputErrors);
    });
});
