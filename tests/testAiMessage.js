const assert = require('assert');
const starkinfra = require('../index.js');
const fixtures = require('./utils/aiFixtures');
const starkcoreError = require('starkcore/starkcore/error.js');
const { collect } = fixtures;

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
        const found = await collect(await starkinfra.aiMessage.query({ chatId: chat.id }));
        assert.deepStrictEqual(found.map(message => message.id).sort(), posted.map(message => message.id).sort());
    });

    it('test_query_with_limit_stops_at_the_limit', async () => {
        const found = await collect(await starkinfra.aiMessage.query({ chatId: chat.id, limit: 1 }));
        assert.strictEqual(found.length, 1);
    });

    it('test_query_with_a_negative_limit_raises_input_errors', async () => {
        await assert.rejects(collect(await starkinfra.aiMessage.query({ chatId: chat.id, limit: -1 })), starkcoreError.InputErrors);
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiMessage.page({ chatId: chat.id, limit: 101 }), starkcoreError.InputErrors);
    });

    it('test_query_without_chat_id_lists_the_messages_of_every_chat', async () => {
        const found = await collect(await starkinfra.aiMessage.query({ limit: 100 }));
        const ids = found.map(message => message.id);
        for (let message of posted) {
            assert(ids.includes(message.id));
        }
    });

    it('test_query_with_an_unknown_chat_id_raises_input_errors', async () => {
        await assert.rejects(collect(await starkinfra.aiMessage.query({ chatId: '0000000000000000' })), starkcoreError.InputErrors);
    });

    it('test_page_returns_a_cursor_that_leads_to_the_next_page', async () => {
        const [first, cursor] = await starkinfra.aiMessage.page({ chatId: chat.id, limit: 1 });
        assert.strictEqual(first.length, 1);
        assert(cursor);
        const [second] = await starkinfra.aiMessage.page({ chatId: chat.id, cursor: cursor, limit: 1 });
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
