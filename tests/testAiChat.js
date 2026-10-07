const assert = require('assert');
const starkinfra = require('../index.js');
const fixtures = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');
const { httpBoundary, collect } = fixtures;

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

describe('TestAiChatAtTheHttpBoundary', function() {
    const boundary = httpBoundary();

    afterEach(() => boundary.restore());

    it('test_create_sends_the_attributes_that_were_set_and_leaves_out_the_null_ones', async () => {
        boundary.answerWith({ chat: chat });
        await starkinfra.aiChat.create(new starkinfra.AiChat({ agentId: '5740688905863168', title: 'Support chat' }));
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'POST');
        assert(boundary.requests[0].url.endsWith('/v2/ai-chat'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(), { agentId: '5740688905863168', title: 'Support chat' });
    });

    it('test_create_and_update_send_tags_and_context_and_keep_the_empty_ones', async () => {
        boundary.answerWith({ chat: chat });
        await starkinfra.aiChat.create(new starkinfra.AiChat({ agentId: '5740688905863168', tags: ['customer-123'], context: { name: 'Ana' } }));
        await starkinfra.aiChat.update('5761660895625216', { tags: [], context: {} });
        assert.deepStrictEqual(boundary.bodyOf(0), { agentId: '5740688905863168', tags: ['customer-123'], context: { name: 'Ana' } });
        assert.deepStrictEqual(boundary.bodyOf(1), { tags: [], context: {} });
    });

    it('test_query_sends_the_tags_as_a_comma_separated_list', async () => {
        boundary.answerWith({ chats: [chat] });
        await collect(await starkinfra.aiChat.query({ tags: ['customer-123', 'whatsapp'] }));
        assert(boundary.requests[0].url.includes('tags=customer-123%2Cwhatsapp'), boundary.requests[0].url);
    });

    it('test_update_sends_the_given_fields_and_an_empty_object_when_none_is_given', async () => {
        boundary.answerWith({ chat: chat });
        await starkinfra.aiChat.update('5761660895625216', { title: 'New title', agentId: '5740688905863169' });
        await starkinfra.aiChat.update('5761660895625216');
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'PATCH');
        assert(boundary.requests[0].url.endsWith('/v2/ai-chat/5761660895625216'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(0), { title: 'New title', agentId: '5740688905863169' });
        assert.deepStrictEqual(boundary.bodyOf(1), {});
    });

    it('test_delete_sends_ids_in_the_query_string_and_no_body', async () => {
        boundary.answerWith({ chats: [chat] });
        const deleted = await starkinfra.aiChat.delete(['5761660895625216', '5761660895625217']);
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'DELETE');
        assert(boundary.requests[0].url.endsWith('/v2/ai-chat?ids=5761660895625216%2C5761660895625217'), boundary.requests[0].url);
        assert.strictEqual(boundary.requests[0].data, undefined);
        assert.deepStrictEqual(deleted.map(entity => entity.id), ['5761660895625216']);
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
