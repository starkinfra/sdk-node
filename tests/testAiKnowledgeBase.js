const assert = require('assert');
const axios = require('axios').default;
const starkinfra = require('../index.js');
const { generateExampleAiKnowledgeBase } = require('./utils/aiKnowledgeBase');

starkinfra.user = require('./utils/user').exampleProject;


// starkcore throws its own error classes, which are not the ones exported by starkinfra.error
function isStarkError(className) {
    return (e) => e.constructor.name === className;
}

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
        try {
            await starkinfra.aiKnowledgeBase.delete([knowledgeBase.id]);
        } catch (e) {
            if (e.constructor.name !== 'InternalServerError') {
                throw e;
            }
            process.stderr.write('AiKnowledgeBase ' + knowledgeBase.id + ' was not deleted: the API answered 500\n');
        }
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
        // the crawl moves the status on its own, so filter by the status the server reports right now
        const current = await starkinfra.aiKnowledgeBase.get(knowledgeBase.id);
        const found = await collect(await starkinfra.aiKnowledgeBase.query({ name: current.name, status: current.status }));
        assert(found.map(entity => entity.id).includes(knowledgeBase.id));
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
        await assert.rejects(starkinfra.aiKnowledgeBase.create(invalid), isStarkError('InputErrors'));
    });

    it('test_get_unknown_id_raises_input_errors', async () => {
        await assert.rejects(starkinfra.aiKnowledgeBase.get('0000000000000000'), isStarkError('InputErrors'));
    });
});

// The sandbox answers 500 to hosts and delete for a valid id, so these two are checked at the HTTP boundary
// with the payloads documented for the API.
describe('TestAiKnowledgeBaseAtTheHttpBoundary', function() {
    const originalAdapter = axios.defaults.adapter;
    let request;

    function answerWith(data) {
        axios.defaults.adapter = async (config) => {
            request = config;
            return { data: data, status: 200, statusText: 'OK', headers: {}, config: config };
        };
    }

    afterEach(() => {
        axios.defaults.adapter = originalAdapter;
        request = null;
    });

    it('test_create_sends_only_the_creatable_fields', async () => {
        const returned = {
            id: '6767676767676767',
            name: 'Public Documentation',
            rootUrl: 'https://docs.starkinfra.com',
            isRecursive: false,
            status: 'success',
            tags: ['support'],
            created: '2022-01-01T00:00:00.000000+00:00',
            updated: '2022-01-02T00:00:00.000000+00:00'
        };
        answerWith({ knowledgeBase: returned });
        await starkinfra.aiKnowledgeBase.create(new starkinfra.AiKnowledgeBase(returned));
        assert.strictEqual(request.method.toUpperCase(), 'POST');
        assert.deepStrictEqual(Object.keys(JSON.parse(request.data)).sort(), ['isRecursive', 'name', 'rootUrl', 'tags']);
    });

    it('test_hosts_groups_pages_by_host', async () => {
        const hosts = {
            'docs.starkinfra.com': [{
                originalUrl: 'https://docs.starkinfra.com/get-started',
                status: 'success',
                storageUrl: 'https://storage.googleapis.com/ai-knowledge/6767676767676767/get-started.md'
            }]
        };
        answerWith({ hosts: hosts });
        const result = await starkinfra.aiKnowledgeBase.hosts('6767676767676767');
        assert(request.url.endsWith('/v2/ai-knowledge-base/6767676767676767/hosts'), request.url);
        assert.strictEqual(request.method.toUpperCase(), 'GET');
        assert.deepStrictEqual(result, hosts);
    });

    it('test_delete_sends_ids_in_the_query_string_and_returns_the_deleted_objects', async () => {
        answerWith({
            knowledgeBases: [{
                id: '6767676767676767',
                name: 'Public Documentation',
                rootUrl: 'https://docs.starkinfra.com',
                isRecursive: true,
                status: 'success',
                tags: ['support'],
                created: '2022-01-01T00:00:00.000000+00:00',
                updated: '2022-01-02T00:00:00.000000+00:00'
            }]
        });
        const deleted = await starkinfra.aiKnowledgeBase.delete(['6767676767676767', '6767676767676768']);
        assert(request.url.endsWith('/v2/ai-knowledge-base?ids=6767676767676767%2C6767676767676768'), request.url);
        assert.strictEqual(request.method.toUpperCase(), 'DELETE');
        assert.strictEqual(request.data, undefined);
        assert.deepStrictEqual(deleted.map(entity => entity.id), ['6767676767676767']);
        assert.strictEqual(deleted[0].name, 'Public Documentation');
    });
});
