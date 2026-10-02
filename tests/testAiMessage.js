const assert = require('assert');
const starkinfra = require('../index.js');
const fixtures = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');
const { httpBoundary, collect } = fixtures;

starkinfra.user = require('./utils/user').exampleProject;


const messages = [
    {
        id: '5642368648740864',
        chatId: '5632499082330112',
        sender: 'user',
        text: 'Say hello.',
        speech: 'Say hello.',
        metadata: {},
        model: 'bender-1.0',
        created: '2026-10-01T14:28:02.652375+00:00'
    },
    {
        id: '5079418695319552',
        chatId: '5632499082330112',
        sender: 'system',
        text: 'Hello!',
        speech: 'Hello!',
        metadata: { order_id: '123' },
        model: 'bender-1.0',
        created: '2026-10-01T14:28:02.653375+00:00'
    }
];

describe('TestAiMessage', function() {
    this.timeout(60000);
    let chat;
    let posted;

    before(async () => {
        chat = await fixtures.chat();
        posted = await starkinfra.aiMessage.create(
            new starkinfra.AiMessage({ chatId: chat.id, text: 'Say hello and mention order 123.' }),
            { expand: ['chatName'] }
        );
    });

    it('test_create_returns_the_user_message_and_the_answer', () => {
        assert.deepStrictEqual(posted.map(message => message.sender), ['user', 'system']);
        for (let message of posted) {
            assert.strictEqual(message.chatId, chat.id);
            assert(typeof message.created === 'string');
            assert(message.chatName);
        }
    });

    it('test_the_answer_carries_a_metadata_object', () => {
        assert.strictEqual(typeof posted[1].metadata, 'object');
    });

    it('test_query_returns_the_whole_history', async () => {
        const found = await collect(await starkinfra.aiMessage.query(chat.id));
        assert.deepStrictEqual(found.map(message => message.id).sort(), posted.map(message => message.id).sort());
    });

    it('test_query_with_limit_stops_at_the_limit', async () => {
        const found = await collect(await starkinfra.aiMessage.query(chat.id, { limit: 1 }));
        assert.strictEqual(found.length, 1);
    });

    it('test_query_with_a_negative_limit_raises_input_errors', async () => {
        await assert.rejects(collect(await starkinfra.aiMessage.query(chat.id, { limit: -1 })), starkcoreError.InputErrors);
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiMessage.page(chat.id, { limit: 101 }), starkcoreError.InputErrors);
    });

    it('test_page_returns_a_cursor_that_leads_to_the_next_page', async () => {
        const [first, cursor] = await starkinfra.aiMessage.page(chat.id, { limit: 1 });
        assert.strictEqual(first.length, 1);
        assert(cursor);
        const [second] = await starkinfra.aiMessage.page(chat.id, { cursor: cursor, limit: 1 });
        assert.strictEqual(second.length, 1);
        assert.notStrictEqual(first[0].id, second[0].id);
    });

    it('test_create_in_an_unknown_chat_raises_input_errors', async () => {
        await assert.rejects(
            starkinfra.aiMessage.create(new starkinfra.AiMessage({ chatId: '0000000000000000', text: 'hi' })),
            starkcoreError.InputErrors
        );
    });
});

describe('TestAiMessageAtTheHttpBoundary', function() {
    const boundary = httpBoundary();

    afterEach(() => boundary.restore());

    it('test_create_sends_expand_in_the_query_string_and_not_in_the_body', async () => {
        boundary.answerWith({ chatName: 'Greeting', messages: messages });
        const created = await starkinfra.aiMessage.create(
            new starkinfra.AiMessage({ chatId: '5632499082330112', text: 'Say hello.', model: 'prime-1.0' }),
            { expand: ['chatName'] }
        );
        assert.strictEqual(boundary.requests[0].method.toUpperCase(), 'POST');
        assert(boundary.requests[0].url.endsWith('/v2/ai-message?expand=chatName'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(), { chatId: '5632499082330112', text: 'Say hello.', model: 'prime-1.0' });
        assert.deepStrictEqual(created.map(message => message.sender), ['user', 'system']);
        assert.deepStrictEqual(created.map(message => message.chatName), ['Greeting', 'Greeting']);
    });

    it('test_create_without_expand_has_no_chat_name_and_keeps_metadata_keys', async () => {
        boundary.answerWith({ messages: messages });
        const created = await starkinfra.aiMessage.create(new starkinfra.AiMessage({ chatId: '5632499082330112', text: 'Say hello.' }));
        assert(boundary.requests[0].url.endsWith('/v2/ai-message'), boundary.requests[0].url);
        assert.deepStrictEqual(boundary.bodyOf(), { chatId: '5632499082330112', text: 'Say hello.' });
        assert.strictEqual(created[0].chatName, null);
        assert.deepStrictEqual(created[1].metadata, { order_id: '123' });
    });

    it('test_query_follows_the_cursor_until_it_runs_out', async () => {
        boundary.answerWith(
            { cursor: 'next-page', messages: [messages[0]] },
            { cursor: null, messages: [messages[1]] }
        );
        const found = await collect(await starkinfra.aiMessage.query('5632499082330112'));
        assert.deepStrictEqual(found.map(message => message.id), ['5642368648740864', '5079418695319552']);
        assert(boundary.requests[0].url.includes('chatId=5632499082330112'), boundary.requests[0].url);
        assert(!boundary.requests[0].url.includes('cursor'), boundary.requests[0].url);
        assert(boundary.requests[1].url.includes('cursor=next-page'), boundary.requests[1].url);
    });

    it('test_query_with_limit_stops_without_asking_for_another_page', async () => {
        boundary.answerWith({ cursor: 'next-page', messages: [messages[0]] });
        const found = await collect(await starkinfra.aiMessage.query('5632499082330112', { limit: 1 }));
        assert.strictEqual(found.length, 1);
        assert.strictEqual(boundary.requests.length, 1);
        assert(boundary.requests[0].url.includes('limit=1'), boundary.requests[0].url);
    });

    it('test_page_returns_the_items_and_the_cursor', async () => {
        boundary.answerWith({ cursor: 'next-page', messages: messages });
        const [items, cursor] = await starkinfra.aiMessage.page('5632499082330112', { limit: 2 });
        assert.strictEqual(items.length, 2);
        assert.strictEqual(cursor, 'next-page');
    });

    it('test_page_without_chat_id_is_refused_before_any_request', async () => {
        boundary.answerWith({ cursor: null, messages: [] });
        await assert.rejects(starkinfra.aiMessage.page(undefined));
        assert.strictEqual(boundary.requests.length, 0);
    });
});
