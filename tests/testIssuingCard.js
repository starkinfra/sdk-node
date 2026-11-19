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
            assert('isPinDefined' in card);
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


// Only the outgoing HTTP call (the axios adapter used by starkcore) is replaced in the *Payload tests: payload building and
// signing run for real.
const createRequire = require('module').createRequire;
const axios = createRequire(require.resolve('starkcore'))('axios').default;
const {generateExampleCardsWithoutHolder, findExistingHolderForProduct} = require('./utils/issuingCard');

let requests;
let originalAdapter;

function fakeApi(data) {
    requests = [];
    originalAdapter = axios.defaults.adapter;
    axios.defaults.adapter = async (config) => {
        requests.push(config);
        return { data: data, status: 200, statusText: 'OK', headers: {}, config: config };
    };
}

function restoreApi() {
    axios.defaults.adapter = originalAdapter;
}

async function firstProduct() {
    for await (let product of await starkinfra.issuingProduct.query({ limit: 1 })) {
        return product;
    }
}

async function cancelAll(cards) {
    for (let card of cards) {
        await starkinfra.issuingCard.cancel(card.id);
    }
}

// The API rejection reaches the caller untouched: HTTP 400 with the error list of the API. The error class comes from
// starkcore, which is not the class exported by starkinfra.error, so the shape is checked instead of instanceof.
async function rejects(promise, code) {
    try {
        await promise;
    } catch (error) {
        assert.strictEqual(error.status, 400, 'expected a 400 rejection, got ' + error);
        assert.ok(error.errors.length > 0);
        assert.ok(error.errors.some(e => e.code === code), 'expected code ' + code + ', got ' + JSON.stringify(error.errors.map(e => e.code)));
        return error;
    }
    assert.fail('expected the API to reject the call');
}

describe('TestIssuingCardWithoutHolderPayload', function () {
    let card = { id: '5656565656565656', status: 'pending', holderId: '', holderName: '' };
    beforeEach(() => fakeApi({ cards: [card] }));
    afterEach(restoreApi);

    it('test_holder_fields_are_not_sent_when_omitted', async () => {
        let cards = await starkinfra.issuingCard.create([new starkinfra.IssuingCard({ productId: '123', type: 'physical' })]);
        assert.deepStrictEqual(JSON.parse(requests[0].data), { cards: [{ productId: '123', type: 'physical' }] });
        assert.strictEqual(cards[0].holderId, '');
        assert.strictEqual(cards[0].holderName, '');
    });

    it('test_holder_fields_are_sent_when_informed', async () => {
        await starkinfra.issuingCard.create([new starkinfra.IssuingCard({
            holderName: 'Tony Stark',
            holderTaxId: '012.345.678-90',
            holderExternalId: 'my-entity/123',
            productId: '123',
        })]);
        assert.deepStrictEqual(JSON.parse(requests[0].data), { cards: [{
            holderName: 'Tony Stark',
            holderTaxId: '012.345.678-90',
            holderExternalId: 'my-entity/123',
            productId: '123',
        }] });
    });
});

describe('TestIssuingCardWithoutHolder', function () {
    this.timeout(60000);

    it('test_physical_card_without_holder_is_created_pending', async () => {
        let cards = await starkinfra.issuingCard.create(await generateExampleCardsWithoutHolder(1, 'physical'));
        try {
            assert.strictEqual(cards.length, 1);
            assert.strictEqual(cards[0].status, 'pending');
            assert.strictEqual(cards[0].type, 'physical');
            assert.strictEqual(cards[0].holderId, '');
            assert.strictEqual(cards[0].holderName, '');
        } finally {
            await cancelAll(cards);
        }
    });

    it('test_api_rejects_virtual_card_without_holder', async () => {
        await rejects(starkinfra.issuingCard.create(await generateExampleCardsWithoutHolder(1, 'virtual')), 'invalidHolder');
    });

    it('test_api_rejects_incomplete_holder_fields', async () => {
        let cards = await generateExampleCardsWithoutHolder(1, 'physical');
        cards[0].holderName = 'Tony Stark';
        await rejects(starkinfra.issuingCard.create(cards), 'invalidHolder');
    });
});

describe('TestIssuingCardUpdatePayload', function () {
    beforeEach(() => fakeApi({ card: { id: '5656565656565656', status: 'pending' } }));
    afterEach(restoreApi);

    it('test_holder_fields_are_not_sent_when_omitted', async () => {
        await starkinfra.issuingCard.update('5656565656565656', { displayName: 'ANTHONY STARK' });
        assert.strictEqual(requests[0].method.toUpperCase(), 'PATCH');
        assert.deepStrictEqual(JSON.parse(requests[0].data), { displayName: 'ANTHONY STARK' });
    });

    it('test_holder_fields_are_sent_alone', async () => {
        await starkinfra.issuingCard.update('5656565656565656', {
            holderName: 'Tony Stark',
            holderTaxId: '012.345.678-90',
            holderExternalId: 'my-entity/123',
        });
        assert.deepStrictEqual(JSON.parse(requests[0].data), {
            holderName: 'Tony Stark',
            holderTaxId: '012.345.678-90',
            holderExternalId: 'my-entity/123',
        });
    });

    it('test_holder_fields_are_sent_with_status_and_pin', async () => {
        await starkinfra.issuingCard.update('5656565656565656', {
            holderName: 'Tony Stark',
            holderTaxId: '012.345.678-90',
            holderExternalId: 'my-entity/123',
            status: 'active',
            pin: '1234',
        });
        assert.deepStrictEqual(JSON.parse(requests[0].data), {
            status: 'active',
            pin: '1234',
            holderName: 'Tony Stark',
            holderTaxId: '012.345.678-90',
            holderExternalId: 'my-entity/123',
        });
    });
});

describe('TestIssuingCardAssignHolder', function () {
    this.timeout(60000);
    let holder;
    let cards = [];

    beforeEach(async function () {
        let product = await firstProduct();
        holder = await findExistingHolderForProduct(product);
        if (!holder) {
            this.skip();
        }
        cards = await starkinfra.issuingCard.create(await generateExampleCardsWithoutHolder(1, 'physical', product.id));
    });

    afterEach(async () => {
        await cancelAll(cards);
        cards = [];
    });

    it('test_holder_is_assigned_to_a_pending_card', async () => {
        let card = await starkinfra.issuingCard.update(cards[0].id, {
            holderName: holder.name,
            holderTaxId: holder.taxId,
            holderExternalId: holder.externalId,
        });
        assert.strictEqual(card.status, 'pending');
        assert.strictEqual(card.holderId, holder.id);
        assert.ok(card.holderName === holder.name, 'the holder name was not assigned to the card'); // no values in the message: they are real holder data
    });

    it('test_holder_is_assigned_and_card_activated_in_the_same_call', async () => {
        let card = await starkinfra.issuingCard.update(cards[0].id, {
            holderName: holder.name,
            holderTaxId: holder.taxId,
            holderExternalId: holder.externalId,
            status: 'active',
            pin: '1234',
        });
        assert.strictEqual(card.status, 'active');
        assert.strictEqual(card.holderId, holder.id);
    });

    it('test_api_rejects_incomplete_holder_fields', async () => {
        await rejects(starkinfra.issuingCard.update(cards[0].id, { holderName: holder.name }), 'invalidHolder');
    });

    it('test_api_rejects_activation_without_holder', async () => {
        await rejects(starkinfra.issuingCard.update(cards[0].id, { status: 'active', pin: '1234' }), 'invalidHolder');
    });
});

describe('TestIssuingCardUpdateMultiPayload', function () {
    beforeEach(() => fakeApi({ cards: [{ id: '1', status: 'pending' }, { id: '2', status: 'pending' }] }));
    afterEach(restoreApi);

    it('test_items_are_sent_in_the_cards_list_with_only_informed_fields', async () => {
        let cards = await starkinfra.issuingCard.updateMulti([
            new starkinfra.IssuingCard({
                id: '1',
                holderName: 'Tony Stark',
                holderTaxId: '012.345.678-90',
                holderExternalId: 'my-entity/123',
            }),
            { id: '2', tags: ['batch'] },
        ]);
        assert.strictEqual(requests[0].method.toUpperCase(), 'PATCH');
        assert.ok(requests[0].url.endsWith('/v2/issuing-card'), requests[0].url);
        assert.deepStrictEqual(JSON.parse(requests[0].data), { cards: [
            { id: '1', holderName: 'Tony Stark', holderTaxId: '012.345.678-90', holderExternalId: 'my-entity/123' },
            { id: '2', tags: ['batch'] },
        ] });
        assert.deepStrictEqual(cards.map(card => card.id), ['1', '2']);
        assert.ok(cards.every(card => card instanceof starkinfra.IssuingCard));
    });
});

describe('TestIssuingCardUpdateMulti', function () {
    this.timeout(60000);
    let holder;
    let cards = [];

    beforeEach(async function () {
        let product = await firstProduct();
        holder = await findExistingHolderForProduct(product);
        if (!holder) {
            this.skip();
        }
        cards = await starkinfra.issuingCard.create(await generateExampleCardsWithoutHolder(2, 'physical', product.id));
    });

    afterEach(async () => {
        await cancelAll(cards);
        cards = [];
    });

    function holderFields() {
        return { holderName: holder.name, holderTaxId: holder.taxId, holderExternalId: holder.externalId };
    }

    it('test_holder_is_assigned_to_several_cards', async () => {
        let updated = await starkinfra.issuingCard.updateMulti(cards.map(card => ({ id: card.id, ...holderFields() })));
        assert.deepStrictEqual(updated.map(card => card.id).sort(), cards.map(card => card.id).sort());
        for (let card of updated) {
            assert.strictEqual(card.holderId, holder.id);
        }
    });

    it('test_api_rejects_the_whole_list_when_one_item_is_invalid', async () => {
        await rejects(starkinfra.issuingCard.updateMulti([
            { id: cards[0].id, ...holderFields() },
            { id: '0000000000000001', ...holderFields() },
        ]), 'invalidCard');
        let card = await starkinfra.issuingCard.get(cards[0].id);
        assert.strictEqual(card.holderId, '');
    });

    it('test_api_rejects_incomplete_holder_fields', async () => {
        await rejects(starkinfra.issuingCard.updateMulti([{ id: cards[0].id, holderName: holder.name }]), 'invalidHolder');
    });
});
