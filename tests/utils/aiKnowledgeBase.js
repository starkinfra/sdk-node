const crypto = require('crypto');
const starkinfra = require('../../index.js');

exports.generateExampleAiKnowledgeBase = function () {
    return new starkinfra.AiKnowledgeBase({
        name: 'sdk-node-' + crypto.randomBytes(6).toString('hex'),
        rootUrl: 'https://docs.starkinfra.com',
        isRecursive: false,
        tags: ['sdk-node', 'test']
    });
};
