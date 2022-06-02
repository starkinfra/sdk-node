const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleCardJson} = require('./utils/issuingCard');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingCardQuery', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cards = await starkinfra.issuingCard.query({'limit': 10});
        for await (let card of cards) {
            assert(typeof card.id == 'string');
        }
    });
});

describe('TestIssuingCardPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingCard.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestIssuingCardGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cards = await starkinfra.issuingCard.query({'limit': 1});
        for await (let card of cards) {
            assert(typeof card.id == 'string');
            card = await starkinfra.issuingCard.get(card.id);
            assert(typeof card.id == 'string');
        }
    });
});

describe('TestIssuingCardPostAndDelete', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holders = await starkinfra.issuingHolder.query({'limit': 1});
        for await (let holder of holders) {
            let cards = await starkinfra.issuingCard.create(generateExampleCardJson(holder, 2))
            for await (let card of cards) {
                assert(card.securityCode === '***');
                let cardId = card.id;
                card = await starkinfra.issuingCard.update(cardId, {'displayName': 'Updated Name'})
                assert(card.displayName === 'Updated Name');
                card = await starkinfra.issuingCard.cancel(cardId);
                assert(card.status === 'canceled');
            }
        }
    });
});
