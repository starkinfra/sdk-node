const assert = require('assert');
const starkinfra = require('../index.js');
const { generateExampleAiKnowledgeBase } = require('./utils/aiKnowledgeBase');
const starkcoreError = require('starkcore/starkcore/error.js');

starkinfra.user = require('./utils/user').exampleProject;


async function collect(generator) {
    const entities = [];
    for await (let entity of generator) {
        entities.push(entity);
    }
    return entities;
}

describe('TestAiKnowledgeBase', function() {
    this.timeout(20000);
    let knowledgeBase;

    before(async () => {
        knowledgeBase = await starkinfra.aiKnowledgeBase.create(generateExampleAiKnowledgeBase());
    });

    after(async () => {
        await starkinfra.aiKnowledgeBase.delete([knowledgeBase.id]);
    });

    it('test_create_returns_processing_knowledge_base', () => {
        assert(typeof knowledgeBase.id === 'string');
        assert.strictEqual(knowledgeBase.status, 'processing');
        assert.strictEqual(knowledgeBase.rootUrl, 'https://docs.starkinfra.com');
        assert.strictEqual(knowledgeBase.isRecursive, false);
        assert.deepStrictEqual(knowledgeBase.tags, ['sdk-node', 'test']);
        assert(typeof knowledgeBase.created === 'string');
    });

    it('test_get', async () => {
        const fetched = await starkinfra.aiKnowledgeBase.get(knowledgeBase.id);
        assert.strictEqual(fetched.id, knowledgeBase.id);
        assert.strictEqual(fetched.name, knowledgeBase.name);
    });

    it('test_query_filters_by_ids', async () => {
        const found = await collect(await starkinfra.aiKnowledgeBase.query({ ids: [knowledgeBase.id] }));
        assert.deepStrictEqual(found.map(entity => entity.id), [knowledgeBase.id]);
    });

    it('test_query_filters_by_name_and_status', async () => {
        const current = await starkinfra.aiKnowledgeBase.get(knowledgeBase.id);
        const found = await collect(await starkinfra.aiKnowledgeBase.query({ name: current.name, status: current.status }));
        assert(found.map(entity => entity.id).includes(knowledgeBase.id));
    });

    it('test_query_with_limit_stops_at_the_limit', async () => {
        const found = await collect(await starkinfra.aiKnowledgeBase.query({ limit: 1 }));
        assert.strictEqual(found.length, 1);
    });

    it('test_query_without_match_is_empty', async () => {
        const found = await collect(await starkinfra.aiKnowledgeBase.query({ name: 'no-knowledge-base-has-this-name' }));
        assert.deepStrictEqual(found, []);
    });

    it('test_update_changes_name_and_tags_only', async () => {
        try {
            const updated = await starkinfra.aiKnowledgeBase.update(knowledgeBase.id, { name: 'renamed-by-sdk', tags: ['renamed'] });
            assert.strictEqual(updated.name, 'renamed-by-sdk');
            assert.deepStrictEqual(updated.tags, ['renamed']);
            assert.strictEqual(updated.rootUrl, knowledgeBase.rootUrl);
        } finally {
            await starkinfra.aiKnowledgeBase.update(knowledgeBase.id, { name: knowledgeBase.name, tags: knowledgeBase.tags });
        }
    });
});

describe('TestAiKnowledgeBaseErrors', function() {
    this.timeout(20000);

    it('test_create_with_invalid_root_url_raises_input_errors', async () => {
        const invalid = new starkinfra.AiKnowledgeBase({ name: 'invalid', rootUrl: 'not-a-url' });
        await assert.rejects(starkinfra.aiKnowledgeBase.create(invalid), starkcoreError.InputErrors);
    });

    it('test_get_unknown_id_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiKnowledgeBase.get('0000000000000000'), starkcoreError.InputErrors);
    });
});

describe('TestAiKnowledgeBasePage', function() {
    this.timeout(30000);

    it('test_page_returns_the_items_and_a_cursor', async () => {
        const [items, cursor] = await starkinfra.aiKnowledgeBase.page({ limit: 1 });
        assert(items.length <= 1);
        assert(cursor === null || typeof cursor === 'string');
    });

    it('test_page_with_a_limit_above_the_maximum_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiKnowledgeBase.page({ limit: 101 }), starkcoreError.InputErrors);
    });
});
