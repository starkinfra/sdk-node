const assert = require('assert');
const starkinfra = require('../index.js');
const {bankCode} = require("./utils/user");
const {generateExamplePixChargebackJson, getPixChargebackToPatch} = require("./utils/pixChargeback");

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixChargebackPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let chargebacks = await starkinfra.pixChargeback.create(await generateExamplePixChargebackJson(2));
        for (let chargeback of chargebacks) {
            let canceledPixChargeback = await starkinfra.pixChargeback.cancel(chargeback.id);
            assert(canceledPixChargeback.status === 'canceled');
            console.log(canceledPixChargeback);
        }
    });
});

describe('TestPixChargebackQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let chargebacks = await starkinfra.pixChargeback.query({'limit': 10});
        for await (let chargeback of chargebacks) {
            assert(typeof chargeback.id == 'string');
        }
    });
});

describe('TestPixChargebackPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixChargeback.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestPixChargebackGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let chargebacks = await starkinfra.pixChargeback.query({'limit': 1});
        for await (let chargeback of chargebacks) {
            assert(typeof chargeback.id == 'string');
            console.log(chargeback);
            chargeback = await starkinfra.pixChargeback.get(chargeback.id, '012.345.678-90');
            assert(typeof chargeback.id == 'string');
        }
    });
});

describe('TestPixChargebackPatch', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let pixChargeback = await getPixChargebackToPatch();
        assert(pixChargeback.status === 'delivered');
        let updatedPixChargeback = await starkinfra.pixChargeback.update(
            pixChargeback.id,
            'accepted',
            { reversalReferenceId: starkinfra.returnId.create(bankCode)}
        );
        assert(updatedPixChargeback.result === "agreed");
    });
});
