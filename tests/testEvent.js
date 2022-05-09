const starkinfra = require('../index.js');
const assert = require('assert');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestEventParse', function(){
    this.timeout(10000);
    it('test_success', async () => {
        content = '{"event": {"created": "2022-02-15T20:45:09.852878+00:00", "id": "5015597159022592", "log": {"created": "2022-02-15T20:45:09.436621+00:00", "errors": [{"code": "insufficientFunds", "message": "Amount of funds available is not sufficient to cover the specified transfer"}], "id": "5288053467774976", "request": {"amount": 1000, "bankCode": "34052649", "cashAmount": 0, "cashierBankCode": "", "cashierType": "", "created": "2022-02-15T20:45:08.210009+00:00", "description": "For saving my life", "endToEndId": "E34052649202201272111u34srod1a91", "externalId": "141322efdgber1ecd1s342341321", "fee": 0, "flow": "out", "id": "5137269514043392", "initiatorTaxId": "", "method": "manual", "receiverAccountNumber": "000001", "receiverAccountType": "checking", "receiverBankCode": "00000001", "receiverBranchCode": "0001", "receiverKeyId": "", "receiverName": "Jamie Lennister", "receiverTaxId": "45.987.245/0001-92", "reconciliationId": "", "senderAccountNumber": "000000", "senderAccountType": "checking", "senderBankCode": "34052649", "senderBranchCode": "0000", "senderName": "tyrion Lennister", "senderTaxId": "012.345.678-90", "status": "failed", "tags": [], "updated": "2022-02-15T20:45:09.436661+00:00"}, "type": "failed"}, "subscription": "pix-request.out", "workspaceId": "5692908409716736"}}';
        valid_signature = 'MEYCIQD0oFxFQX0fI6B7oqjwLhkRhkDjrOiD86wguEKWdzkJbgIhAPNGUUdlNpYBe+npOaHa9WJopzy3WJYl8XJG6f4ek2R/';

        let event = await starkinfra.event.parse({
            content: content,
            signature: valid_signature
        });
        assert(event.log.request.amount === 1000);
    });

    it('test_invalid_signature', async () => {
        content = '{"event": {"created": "2022-02-15T20:45:09.852878+00:00", "id": "5015597159022592", "log": {"created": "2022-02-15T20:45:09.436621+00:00", "errors": [{"code": "insufficientFunds", "message": "Amount of funds available is not sufficient to cover the specified transfer"}], "id": "5288053467774976", "request": {"amount": 1000, "bankCode": "34052649", "cashAmount": 0, "cashierBankCode": "", "cashierType": "", "created": "2022-02-15T20:45:08.210009+00:00", "description": "For saving my life", "endToEndId": "E34052649202201272111u34srod1a91", "externalId": "141322efdgber1ecd1s342341321", "fee": 0, "flow": "out", "id": "5137269514043392", "initiatorTaxId": "", "method": "manual", "receiverAccountNumber": "000001", "receiverAccountType": "checking", "receiverBankCode": "00000001", "receiverBranchCode": "0001", "receiverKeyId": "", "receiverName": "Jamie Lennister", "receiverTaxId": "45.987.245/0001-92", "reconciliationId": "", "senderAccountNumber": "000000", "senderAccountType": "checking", "senderBankCode": "34052649", "senderBranchCode": "0000", "senderName": "tyrion Lennister", "senderTaxId": "012.345.678-90", "status": "failed", "tags": [], "updated": "2022-02-15T20:45:09.436661+00:00"}, "type": "failed"}, "subscription": "pix-request.out", "workspaceId": "5692908409716736"}}';
        invalid_signature = 'MEYCIQCmFCAn2Z+6qEHmf8paI08Ee5ZJ9+KvLWSS3ddp8+RF3AIhALlK7ltfRvMCXhjS7cy8SPlcSlpQtjBxmhN6ClFC0Tv5';

        try {
            await starkinfra.event.parse({
                content: content,
                signature: invalid_signature
            });
            throw new Error('Oops, signature was accepted!');
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });

    it('test_malformed_signature', async () => {
        content = '{"event": {"created": "2022-02-15T20:45:09.852878+00:00", "id": "5015597159022592", "log": {"created": "2022-02-15T20:45:09.436621+00:00", "errors": [{"code": "insufficientFunds", "message": "Amount of funds available is not sufficient to cover the specified transfer"}], "id": "5288053467774976", "request": {"amount": 1000, "bankCode": "34052649", "cashAmount": 0, "cashierBankCode": "", "cashierType": "", "created": "2022-02-15T20:45:08.210009+00:00", "description": "For saving my life", "endToEndId": "E34052649202201272111u34srod1a91", "externalId": "141322efdgber1ecd1s342341321", "fee": 0, "flow": "out", "id": "5137269514043392", "initiatorTaxId": "", "method": "manual", "receiverAccountNumber": "000001", "receiverAccountType": "checking", "receiverBankCode": "00000001", "receiverBranchCode": "0001", "receiverKeyId": "", "receiverName": "Jamie Lennister", "receiverTaxId": "45.987.245/0001-92", "reconciliationId": "", "senderAccountNumber": "000000", "senderAccountType": "checking", "senderBankCode": "34052649", "senderBranchCode": "0000", "senderName": "tyrion Lennister", "senderTaxId": "012.345.678-90", "status": "failed", "tags": [], "updated": "2022-02-15T20:45:09.436661+00:00"}, "type": "failed"}, "subscription": "pix-request.out", "workspaceId": "5692908409716736"}}';
        malformed_signature = 'something is definitely wrong';

        try {
            await starkinfra.event.parse({
                content: content,
                signature: malformed_signature
            });
            throw new Error('Oops, signature was accepted!');
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });
});

describe('TesEventQuery', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let events = await starkinfra.event.query({'limit': 5});
        for await (let event of events) {
            assert(typeof event.id == 'string');
            let attempts = await starkinfra.event.attempt.query({eventIds: [event.id]});
            for (let attempt of attempts) {
                attempt = await starkinfra.event.attempt.get(attempts.id);
            }
        }
    });
});

describe('TestEventPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.event.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestEventInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let events = await starkinfra.event.query();
        for await (let event of events) {
            assert(typeof event.id == 'string');
            event = await starkinfra.event.get(event.id);
            assert(typeof event.id == 'string');
        }
    });
});

describe('TestEventDelete', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let events = await starkinfra.event.query({'limit': 1});
        let event = null
        for (const e of events) {
            event = await starkinfra.event.delete(e.id);
        }
        console.log(event)
    });
});

describe('TestEventSetDelivered', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let events = await starkinfra.event.query({'limit': 1, 'isDelivered': false });
        let event = null
        for (const e of events) {
            event = e;
        }
        event = await starkinfra.event.update(event.id, { 'isDelivered': false });
        assert(event.isDelivered);
        console.log(event)
    });
});
