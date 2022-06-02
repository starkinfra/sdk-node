const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExamplePixClaimJson, getPixClaimToPatch} = require('./utils/pixClaim');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixClaimPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const claims = []
        for (let i = 0; i < 2; i++) {
            let claim = await starkinfra.pixClaim.create(generateExamplePixClaimJson())
            claims.push(claim);
        }
        assert(claims.length === 2)
    });
});

describe('TestPixClaimQuery', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cards = await starkinfra.pixClaim.query({'limit': 10});
        for await (let card of cards) {
            assert(typeof card.id == 'string');
        }
    });
});

describe('TestPixClaimPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixClaim.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestPixClaimGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cards = await starkinfra.pixClaim.query({'limit': 1});
        for await (let card of cards) {
            assert(typeof card.id == 'string');
            card = await starkinfra.pixClaim.get(card.id);
            assert(typeof card.id == 'string');
        }
    });
});

describe('TestPixClaimPatch', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let pixClaim = await getPixClaimToPatch()
        assert(pixClaim.status === 'delivered');
        let updatedPixClaim = await starkinfra.pixClaim.update(
            pixClaim.id,
            'canceled',
            {
                reason: 'userRequested',
            }
        );
        assert(updatedPixClaim);
    });
});
