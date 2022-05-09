const assert = require('assert');
const starkinfra = require('../index.js');
const {bankCode} = require("./utils/user");
const {generateExampleReversalRequestJson, getReversalRequestToPatch} = require("./utils/reversalRequest");

starkinfra.user = require('./utils/user').exampleProject;


describe('TestReversalRequestPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let request = await starkinfra.reversalRequest.create(await generateExampleReversalRequestJson());
        let deletedReversalRequest = await starkinfra.reversalRequest.delete(request.id);
        assert(deletedReversalRequest.status === 'canceled');
        console.log(deletedReversalRequest);
    });
});

describe('TestReversalRequestQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.reversalRequest.query({'limit': 10});
        for await (let request of requests) {
            assert(typeof request.id == 'string');
        }
    });
});

describe('TestReversalRequestPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.reversalRequest.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestReversalRequestGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let requests = await starkinfra.reversalRequest.query({'limit': 1});
        for await (let request of requests) {
            assert(typeof request.id == 'string');
            console.log(request);
            request = await starkinfra.reversalRequest.get(request.id, '012.345.678-90');
            assert(typeof request.id == 'string');
        }
    });
});

describe('TestReversalRequestPatch', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let reversalRequest = await getReversalRequestToPatch();
        assert(reversalRequest.status === 'delivered');
        let updatedReversalRequest = await starkinfra.reversalRequest.update(
            reversalRequest.id,
            'accepted',
            { reversalReferenceId: starkinfra.returnId.create(bankCode)}
        );
        assert(updatedReversalRequest.result === "agreed");
    });
});
