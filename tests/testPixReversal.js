const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExamplePixReversalJson} = require('./utils/pixReversal');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixReversalPost', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let reversals = [];
        reversals.push(new starkinfra.PixReversal(generateExamplePixReversalJson()));
        reversals = await starkinfra.pixReversal.create(reversals);
        for (let reversal of reversals) {
            assert(typeof reversal.id == 'string');
        }
    });
});

describe('TestPixReversalGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const reversals = await starkinfra.pixReversal.query({limit: 15});
        for await (let reversal of reversals) {
            assert(typeof reversal.id == 'string');
            i += 1;
        }
        assert(i === 15);
    });
});

describe('TestPixReversalInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let reversals = await starkinfra.pixReversal.query({limit: 3});
        for await (let reversal of reversals) {
            assert(typeof reversal.id == 'string');
            reversal = await starkinfra.pixReversal.get(reversal.id);
            assert(typeof reversal.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let reversals = await starkinfra.pixReversal.query({limit: 10});
        let reversalsIdsExpected = [];
        for await (let reversal of reversals) {
            reversalsIdsExpected.push(reversal.id);
        }

        let reversalsResult = await starkinfra.pixReversal.query({ids: reversalsIdsExpected});
        let reversalsIdsResult = [];
        for await (let reversal of reversalsResult){
            reversalsIdsResult.push(reversal.id);
        }

        reversalsIdsExpected.sort();
        reversalsIdsResult.sort();
        assert(reversalsIdsExpected.length === reversalsIdsResult.length);
        for (let i=0; i<reversalsIdsExpected.length; i++){
            assert(reversalsIdsExpected[i] === reversalsIdsResult[i]);
        }
    });
});

describe('TestPixReversalGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixReversal.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length === 10);
    });
});

describe('TestPixReversalQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const reversals = await starkinfra.pixReversal.query({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'success',
            tags: ['food','drink'],
            ids: ['1','2'],
            returnIds: ['1','2'],
            externalIds: ['1','2']
        });
        assert(reversals.length===undefined)
    });
});

describe('TestPixReversalQueryParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let reversals = null;
        [reversals, cursor] = await starkinfra.pixReversal.page({
            limit: 2,
            after: '2020-04-01',
            before: '2021-04-30',
            status: 'success',
            tags: ['food','drink'],
            ids: ['1','2'],
            returnIds: ['1','2'],
            externalIds: ['1','2']
        });
        assert(reversals.length===0)
    });
});

describe('TestAuthorizationParse', function(){
    this.timeout(10000);
    it('test_success', async () => {
        content = '{"amount": "10", "external_id": "82635892395", "end_to_end_id": "E20018183202201201450u34sDGd19lz", "reason": "bankError", "tags": ["teste","sdk"], "senderAccountType": "payment", "fee": 0, "receiverName": "Cora", "cashierType": "", "externalId": "", "method": "manual", "status": "processing", "updated": "2022-02-16T17:23:53.980250+00:00", "description": "", "tags": [], "receiverKeyId": "", "cashAmount": 0, "senderBankCode": "20018183", "senderBranchCode": "0001", "bankCode": "34052649", "senderAccountNumber": "5647143184367616", "receiverAccountNumber": "5692908409716736", "initiatorTaxId": "", "receiverTaxId": "34.052.649/0001-78", "created": "2022-02-16T17:23:53.980238+00:00", "flow": "in", "endToEndId": "E20018183202202161723Y4cqxlfLFcm", "amount": 1, "receiverAccountType": "checking", "reconciliationId": "", "receiverBankCode": "34052649"}';
        valid_signature = 'MEUCIQC7FVhXdripx/aXg5yNLxmNoZlehpyvX3QYDXJ8o02X2QIgVwKfJKuIS5RDq50NC/+55h/7VccDkV1vm8Q/7jNu0VM=';

        let request = await starkinfra.pixReversal.parse(content, valid_signature);
        assert(request.amount === 1)
    });

    it('test_invalid_signature', async () => {
        content = '{"amount": "10", "external_id": "82635892395", "end_to_end_id": "E20018183202201201450u34sDGd19lz", "reason": "bankError", "tags": ["teste","sdk"], "senderAccountType": "payment", "fee": 0, "receiverName": "Cora", "cashierType": "", "externalId": "", "method": "manual", "status": "processing", "updated": "2022-02-16T17:23:53.980250+00:00", "description": "", "tags": [], "receiverKeyId": "", "cashAmount": 0, "senderBankCode": "20018183", "senderBranchCode": "0001", "bankCode": "34052649", "senderAccountNumber": "5647143184367616", "receiverAccountNumber": "5692908409716736", "initiatorTaxId": "", "receiverTaxId": "34.052.649/0001-78", "created": "2022-02-16T17:23:53.980238+00:00", "flow": "in", "endToEndId": "E20018183202202161723Y4cqxlfLFcm", "amount": 1, "receiverAccountType": "checking", "reconciliationId": "", "receiverBankCode": "34052649"}';
        invalid_signature = 'MEYCIQCmFCAn2Z+6qEHmf8paI08Ee5ZJ9+KvLWSS3ddp8+RF3AIhALlK7ltfRvMCXhjS7cy8SPlcSlpQtjBxmhN6ClFC0Tv5';

        try {
            await starkinfra.pixReversal.parse(content, invalid_signature);
            throw new Error('Oops, signature was accepted!');
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });

    it('test_malformed_signature', async () => {
        content = '{"amount": "10", "external_id": "82635892395", "end_to_end_id": "E20018183202201201450u34sDGd19lz", "reason": "bankError", "tags": ["teste","sdk"], "senderAccountType": "payment", "fee": 0, "receiverName": "Cora", "cashierType": "", "externalId": "", "method": "manual", "status": "processing", "updated": "2022-02-16T17:23:53.980250+00:00", "description": "", "tags": [], "receiverKeyId": "", "cashAmount": 0, "senderBankCode": "20018183", "senderBranchCode": "0001", "bankCode": "34052649", "senderAccountNumber": "5647143184367616", "receiverAccountNumber": "5692908409716736", "initiatorTaxId": "", "receiverTaxId": "34.052.649/0001-78", "created": "2022-02-16T17:23:53.980238+00:00", "flow": "in", "endToEndId": "E20018183202202161723Y4cqxlfLFcm", "amount": 1, "receiverAccountType": "checking", "reconciliationId": "", "receiverBankCode": "34052649"}';
        malformed_signature = 'something is definitely wrong';

        try {
            await starkinfra.pixReversal.parse(content, malformed_signature);
            throw new Error('Oops, signature was accepted!');
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });
});

describe("TestPixReversalResponse", function(){
    this.timeout(10000);
    it("test_approved", async () => {
        const requests = await starkinfra.pixReversal.response({
            'status': 'approved'
        });
        assert(typeof requests === 'string');
    });

    it("test_denied", async () => {
        const requests = await starkinfra.pixReversal.response({
            'status': 'denied',
            'reason': 'cashierError',
        });
        assert(typeof requests === 'string');
    });
});
