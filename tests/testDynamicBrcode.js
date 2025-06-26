const assert = require('assert');
const starkinfra = require('../index.js');
const {createDynamicBrcodeByType} = require('./utils/dynamicBrcode');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestDynamicBrcodePost', function(){
    this.timeout(10000);

    it('test_create_instant_br_code', async () => {
        const type = "instant";
        const createdBrcode = await createDynamicBrcodeByType(type);

        assert(createdBrcode.type === type);
        assert(typeof createdBrcode.uuid === 'string');
    });

    it('test_create_due_br_code', async () => {
        const type = "due";
        const createdBrcode = await createDynamicBrcodeByType(type);

        assert(createdBrcode.type === type);
        assert(typeof createdBrcode.uuid === 'string');
    });

    it('test_create_subscription_br_code', async () => {
        const type = "subscription";
        const createdBrcode = await createDynamicBrcodeByType(type);

        assert(createdBrcode.type === type);
        assert(typeof createdBrcode.uuid === 'string');
    });

    it('test_create_subscriptionAndInstant_br_code', async () => {
        const type = "subscriptionAndInstant";
        const createdBrcode = await createDynamicBrcodeByType(type);

        assert(createdBrcode.type === type);
        assert(typeof createdBrcode.uuid === 'string');
    });

    it('test_create_dueAndOrSubscription_br_code', async () => {
        const type = "dueAndOrSubscription";
        const createdBrcode = await createDynamicBrcodeByType(type);

        assert(createdBrcode.type === type);
        assert(typeof createdBrcode.uuid === 'string');
    });
});

describe('TestDynamicBrcodeQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let brcodes = await starkinfra.dynamicBrcode.query({'limit': 10});
        for await (let brcode of brcodes) {
            assert(typeof brcode.id == 'string');
        }
    });
});

describe('TestDynamicBrcodeGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let brcodes = await starkinfra.dynamicBrcode.query({'limit': 1});
        for await (let brcode of brcodes) {
            assert(typeof brcode.uuid == 'string');
            brcode = await starkinfra.dynamicBrcode.get(brcode.uuid);
            assert(typeof brcode.uuid == 'string');
        }
    });
});


const UUID = '21f174ab942843eb90837a5c3135dfd6';
const VALID_SIGNATURE = 'MEYCIQC+Ks0M54DPLEbHIi0JrMiWbBFMRETe/U2vy3gTiid3rAIhANMmOaxT03nx2bsdo+vg6EMhWGzdphh90uBH9PY2gJdd';
const INVALID_SIGNATURE = 'MEUCIQDOpo1j+V40DNZK2URL2786UQK/8mDXon9ayEd8U0/l7AIgYXtIZJBTs8zCRR3vmted6Ehz/qfw1GRut/eYyvf1yOk=';


describe('TestDynamicBrcodeVerifyRight', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let uuid = await starkinfra.dynamicBrcode.verify({uuid: UUID, signature: VALID_SIGNATURE})
    });
});


describe('TestDynamicBrcodeVerifyWrong', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let uuid = await starkinfra.dynamicBrcode.verify({uuid: UUID, signature: INVALID_SIGNATURE})
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});

describe('TestDynamicBrcodeVerifyMalformed', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let uuid = await starkinfra.dynamicBrcode.verify({uuid: UUID, signature: 'something is definitely wrong'})
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});

describe('TestDynamicBrcodeResponseDue', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let response = await starkinfra.dynamicBrcode.responseDue({
            version: 1,
            created: "2022-03-10 10:30:00.000",
            due: "2022-07-15",
            expiration: 100000,
            keyId: "+5511989898989",
            status: "paid",
            reconciliationId: "b77f52367ab944879f9566ee6eaf1781",
            amount: 100,
            senderName: "Anthony Edward Stark",
            senderTaxId: "012.345.678-90",
            receiverName: "Jamie Lannister",
            receiverTaxId: "20.018.183/0001-8",
            receiverStreetLine: "Av. Paulista, 200",
            receiverCity: "Sao Paulo",
            receiverStateCode: "SP",
            receiverZipCode: "01234-567",
        });
        assert(typeof response == 'string');
    });
});

describe('TestDynamicBrcodeResponseInstant', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let response = await starkinfra.dynamicBrcode.responseInstant({
            version: 1,
            created: "2022-07-01",
            keyId: "+5511989898989",
            status: "paid",
            reconciliationId: "b77f52367ab944879f9566ee6eaf1781",
            amount: 100,

        });
        assert(typeof response == 'string');
    });
});
