const assert = require("assert");
const starkinfra = require("../index.js");
const uniqueId = require("./utils/uniqueId.js")
const endToEndId = require("../sdk/utils/endToEndId.js");

starkinfra.user = require("./utils/user").exampleProject;


describe("TestPixRequestPost", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let requests = [];
        requests.push(new starkinfra.PixRequest(examplePixRequest));
        requests = await starkinfra.pixRequest.create(requests);
        for (let request of requests) {
            assert(typeof request.id == "string");
        }
    });
});

describe("TestPixRequestGet", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const requests = await starkinfra.pixRequest.query({limit: 50});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            i += 1;
        }
        assert(i === 50);
    });
});

describe("TestPixRequestInfoGet", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.pixRequest.query({limit: 3});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            request = await starkinfra.pixRequest.get(request.id);
            assert(typeof request.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let requests = await starkinfra.pixRequest.query({limit: 10});
        let requestsIdsExpected = [];
        for await (let request of requests) {
            requestsIdsExpected.push(request.id);
        }

        let requestsResult = await starkinfra.pixRequest.query({ids: requestsIdsExpected});
        let requestsIdsResult = [];
        for await (let request of requestsResult){
            requestsIdsResult.push(request.id);
        }

        requestsIdsExpected.sort();
        requestsIdsResult.sort();
        assert(requestsIdsExpected.length === requestsIdsResult.length);
        for (let i=0; i<requestsIdsExpected.length; i++){
            assert(requestsIdsExpected[i] === requestsIdsResult[i]);
        }
    });
});

describe("TestPixRequestGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixRequest.page({ limit: 5, cursor: cursor });
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

describe("TestPixRequestQueryParams", function(){
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.pixRequest.query({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "success",
            tags: ["food","drink"],
            ids: ["1","2"],
            endToEndIds: ["1","2"],
            externalIds: ["1","2"]
        });
        assert(requests.length===undefined)
    });
});

describe("TestPixRequestQueryParams", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.pixRequest.page({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "success",
            tags: ["food","drink"],
            ids: ["1","2"],
            endToEndIds: ["1","2"],
            externalIds: ["1","2"]
        });
        assert(requests.length===0)
    });
});

describe("TestAuthorizationParse", function(){
    this.timeout(10000);
    it("test_success", async () => {
        content = `{"receiverBranchCode": "0001", "cashierBankCode": "", "senderTaxId": "20.018.183/0001-80", "senderName": "Stark Bank S.A. - Instituicao de Pagamento", "id": "4508348862955520", "senderAccountType": "payment", "fee": 0, "receiverName": "Cora", "cashierType": "", "externalId": "", "method": "manual", "status": "processing", "updated": "2022-02-16T17:23:53.980250+00:00", "description": "", "tags": [], "receiverKeyId": "", "cashAmount": 0, "senderBankCode": "20018183", "senderBranchCode": "0001", "bankCode": "34052649", "senderAccountNumber": "5647143184367616", "receiverAccountNumber": "5692908409716736", "initiatorTaxId": "", "receiverTaxId": "34.052.649/0001-78", "created": "2022-02-16T17:23:53.980238+00:00", "flow": "in", "endToEndId": "E20018183202202161723Y4cqxlfLFcm", "amount": 1, "receiverAccountType": "checking", "reconciliationId": "", "receiverBankCode": "34052649"}`;
        valid_signature = "MEUCIQC7FVhXdripx/aXg5yNLxmNoZlehpyvX3QYDXJ8o02X2QIgVwKfJKuIS5RDq50NC/+55h/7VccDkV1vm8Q/7jNu0VM=";

        let request = await starkinfra.pixRequest.parse({
            content: content,
            signature: valid_signature
        });
        assert(request.amount === 1)
    });

    it("test_invalid_signature", async () => {
        content = `{"receiverBranchCode": "0001", "cashierBankCode": "", "senderTaxId": "20.018.183/0001-80", "senderName": "Stark Bank S.A. - Instituicao de Pagamento", "id": "4508348862955520", "senderAccountType": "payment", "fee": 0, "receiverName": "Cora", "cashierType": "", "externalId": "", "method": "manual", "status": "processing", "updated": "2022-02-16T17:23:53.980250+00:00", "description": "", "tags": [], "receiverKeyId": "", "cashAmount": 0, "senderBankCode": "20018183", "senderBranchCode": "0001", "bankCode": "34052649", "senderAccountNumber": "5647143184367616", "receiverAccountNumber": "5692908409716736", "initiatorTaxId": "", "receiverTaxId": "34.052.649/0001-78", "created": "2022-02-16T17:23:53.980238+00:00", "flow": "in", "endToEndId": "E20018183202202161723Y4cqxlfLFcm", "amount": 1, "receiverAccountType": "checking", "reconciliationId": "", "receiverBankCode": "34052649"}`;
        invalid_signature = "MEYCIQCmFCAn2Z+6qEHmf8paI08Ee5ZJ9+KvLWSS3ddp8+RF3AIhALlK7ltfRvMCXhjS7cy8SPlcSlpQtjBxmhN6ClFC0Tv5";

        try {
            await starkinfra.pixRequest.parse({
                content: content,
                signature: invalid_signature
            });
            throw new Error("Oops, signature was accepted!");
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });

    it("test_malformed_signature", async () => {
        content = `{"receiverBranchCode": "0001", "cashierBankCode": "", "senderTaxId": "20.018.183/0001-80", "senderName": "Stark Bank S.A. - Instituicao de Pagamento", "id": "4508348862955520", "senderAccountType": "payment", "fee": 0, "receiverName": "Cora", "cashierType": "", "externalId": "", "method": "manual", "status": "processing", "updated": "2022-02-16T17:23:53.980250+00:00", "description": "", "tags": [], "receiverKeyId": "", "cashAmount": 0, "senderBankCode": "20018183", "senderBranchCode": "0001", "bankCode": "34052649", "senderAccountNumber": "5647143184367616", "receiverAccountNumber": "5692908409716736", "initiatorTaxId": "", "receiverTaxId": "34.052.649/0001-78", "created": "2022-02-16T17:23:53.980238+00:00", "flow": "in", "endToEndId": "E20018183202202161723Y4cqxlfLFcm", "amount": 1, "receiverAccountType": "checking", "reconciliationId": "", "receiverBankCode": "34052649"}`;
        malformed_signature = "something is definitely wrong";

        try {
            await starkinfra.pixRequest.parse({
                content: content,
                signature: malformed_signature
        });
            throw new Error("Oops, signature was accepted!");
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });
});

describe("TestPixRequestResponse", function(){
    this.timeout(10000);
    it("test_approved", async () => {
        const requests = await starkinfra.pixRequest.response({
            status: 'approved',
        });
        assert(typeof requests === 'string');
        console.log(requests);
    });

    it("test_denied", async () => {
        const requests = await starkinfra.pixRequest.response({
            status: 'denied',
            reason: 'taxIdMismatch',
        });
        assert(typeof requests === 'string');
        console.log(requests);
    });
});

let examplePixRequest = {
    amount: 1000,
    externalId: uniqueId.create(),
    senderAccountNumber: "00000-0",
    senderBranchCode: "0000",
    senderAccountType: "checking",
    senderName: "jamie Lannister",
    senderTaxId: "012.345.678-90",
    receiverBankCode: "00000000",
    receiverAccountNumber: "00000-1",
    receiverBranchCode: "0001",
    receiverAccountType: "checking",
    receiverName: "Daenerys Targaryen Stormborn",
    receiverTaxId: "012.345.678-90",
    endToEndId: endToEndId.create(process.env.SANDBOX_ISPB),
    description: "A Lannister always pays his debts",
    cashAmount: 1000,
    cashierBankCode: "00000000",
    cashierType: "merchant",
    tags: ["lannister","chargeback"]
}
