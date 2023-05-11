const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleIssuingEmbossingRequestJson} = require('./utils/issuingEmbossingRequest');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingIssuingEmbossingRequestQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.issuingEmbossingRequest.query({'limit': 10});
        for await (let request of requests) {
            assert(typeof request.id == 'string');
        }
    });
});

describe('TestIssuingIssuingEmbossingRequestPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingEmbossingRequest.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
    });
});

describe('TestIssuingIssuingEmbossingRequestGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.issuingEmbossingRequest.query({'limit': 1});
        for await (let request of requests) {
            assert(typeof request.id == 'string');
            request = await starkinfra.issuingEmbossingRequest.get(request.id);
            assert(typeof request.id == 'string');
        }
    });
});

describe('TestIssuingIssuingEmbossingRequestPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let request = (await starkinfra.issuingEmbossingRequest.create(await generateExampleIssuingEmbossingRequestJson(1)))[0];
        assert(typeof request.id == 'string');
    });
});
