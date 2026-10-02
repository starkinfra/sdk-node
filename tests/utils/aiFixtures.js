const crypto = require('crypto');
const axios = require('axios').default;
const starkinfra = require('../../index.js');


const created = { knowledgeBase: null, agent: null, chat: null };

function name(prefix) {
    return prefix + '-' + crypto.randomBytes(6).toString('hex');
}

exports.knowledgeBase = async function () {
    if (created.knowledgeBase === null) {
        created.knowledgeBase = await starkinfra.aiKnowledgeBase.create(new starkinfra.AiKnowledgeBase({
            name: name('sdk-node-kb'),
            rootUrl: 'https://docs.starkinfra.com',
            isRecursive: false,
            tags: ['sdk-node', 'test']
        }));
    }
    return created.knowledgeBase;
};

exports.agent = async function () {
    if (created.agent === null) {
        const knowledgeBase = await exports.knowledgeBase();
        created.agent = await starkinfra.aiAgent.create(exports.generateExampleAiAgent({ knowledgeBaseIds: [knowledgeBase.id] }));
    }
    return created.agent;
};

exports.chat = async function () {
    if (created.chat === null) {
        const agent = await exports.agent();
        created.chat = await starkinfra.aiChat.create(new starkinfra.AiChat({ agentId: agent.id, title: name('sdk-node-chat') }));
    }
    return created.chat;
};

exports.generateExampleAiAgent = function ({ knowledgeBaseIds = null } = {}) {
    return new starkinfra.AiAgent({
        name: name('sdk-node-agent'),
        model: 'bender-1.0',
        systemPrompt: 'Answer in one short sentence.',
        knowledgeBaseIds: knowledgeBaseIds,
        metadataSchema: { order_id: { type: 'string', description: 'Order the customer mentions' } }
    });
};

exports.isStarkError = function (className) {
    return (e) => e.constructor.name === className;
};

exports.collect = async function (generator) {
    const entities = [];
    for await (let entity of generator) {
        entities.push(entity);
    }
    return entities;
};

exports.httpBoundary = function () {
    const originalAdapter = axios.defaults.adapter;
    const boundary = { requests: [], answers: [] };

    boundary.answerWith = function (...bodies) {
        boundary.answers = bodies.slice();
        axios.defaults.adapter = async (config) => {
            boundary.requests.push(config);
            const data = boundary.answers.length > 1 ? boundary.answers.shift() : boundary.answers[0];
            return { data: data, status: 200, statusText: 'OK', headers: {}, config: config };
        };
    };

    boundary.restore = function () {
        axios.defaults.adapter = originalAdapter;
        boundary.requests = [];
        boundary.answers = [];
    };

    boundary.bodyOf = function (index = 0) {
        return JSON.parse(boundary.requests[index].data);
    };

    return boundary;
};

after(async function () {
    this.timeout(30000);
    const pending = [['chat', starkinfra.aiChat], ['agent', starkinfra.aiAgent], ['knowledgeBase', starkinfra.aiKnowledgeBase]];
    for (let [key, resource] of pending) {
        if (created[key] === null) {
            continue;
        }
        try {
            await resource.delete([created[key].id]);
        } catch (e) {
            if (e.constructor.name !== 'InternalServerError') {
                throw e;
            }
            process.stderr.write(key + ' ' + created[key].id + ' was not deleted: the API answered 500\n');
        }
    }
});
