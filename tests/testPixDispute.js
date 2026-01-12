const assert = require("assert");
const starkinfra = require("../index.js");

starkinfra.user = require("./utils/user").exampleProject;


describe("TestPixDisputeQuery", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let disputes = await starkinfra.pixDispute.query({
            limit: 2,
        });

        const ids = [];
        for await (let dispute of disputes) {
            assert(!ids.includes(dispute.id));
            ids.push(dispute.id);
            assert(typeof dispute.id == "string");
        }
        assert(ids.length === 2);
    });
});

describe("TestPixDisputeGetPage", function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixDispute.page({ limit: 5, cursor: cursor });
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

describe("TestPixDisputeGet", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let disputes = await starkinfra.pixDispute.query({
            limit: 1,
        });
        let disputeId = (await disputes.next()).value.id;
        let dispute = await starkinfra.pixDispute.get(disputeId);
        assert(typeof dispute.id == "string");
    });
});

describe("TestPixDisputeCancel", function(){
    this.timeout(10000);
    it("test_success", async function() {
        let disputes = await starkinfra.pixDispute.query({
            limit: 1,
            status: ["created", "delivered"],
        });

        const next = await disputes.next();
        if (!next.value) {
            this.skip();
        }

        const disputeId = next.value.id;
        const canceledDispute = await starkinfra.pixDispute.cancel(disputeId);
    });
});

describe("TestEventParse", function(){
    this.timeout(10000);
    it("test_success", async () => {
        content = `{"event": {"created": "2025-12-19T19:20:08.687079+00:00", "id": "4543235613523968", "log": {"created": "2025-12-19T19:20:08.107566+00:00", "dispute": {"bacenId": "42e3c802-22c0-4862-b352-cedc912c07a1", "created": "2025-12-19T19:16:04.867430+00:00", "description": "", "flow": "in", "id": "4652621482688512", "maxHopCount": 5, "maxHopInterval": 86400, "maxTransactionCount": 500, "method": "scam", "minTransactionAmount": 20000, "operatorEmail": "fraud@company.com", "operatorPhone": "+5511989898989", "referenceId": "E20018183202512191914WcfANNEIYnt", "status": "analysed", "tags": [], "transactions": [{"amount": 20000, "endToEndId": "E20018183202512191914WcfANNEIYnt", "nominalAmount": 20000, "receiverAccountCreated": "", "receiverBankCode": "39908427", "receiverId": "1", "receiverTaxIdCreated": "", "receiverType": "business", "senderAccountCreated": "", "senderBankCode": "20018183", "senderId": "2", "senderTaxIdCreated": "", "senderType": "business", "settled": "2025-12-19T19:14:25.760000+00:00"}], "updated": "2025-12-19T19:20:08.107585+00:00"}, "errors": [], "id": "6007878011846656", "type": "analysed"}, "subscription": "pix-dispute", "workspaceId": "5560467233701888"}}`;
        validSignature = "MEYCIQCPgzyktxttTM9ooQaXq37NvFjL2cF/nQMfl1rvUcsLAQIhAKLbphPa5311mHvXlz6Rtkk+LPhctxgGYOnxAdhdldls";

        let event = await starkinfra.event.parse({
            content: content,
            signature: validSignature
        });
        assert(event.log.dispute.id == "4652621482688512");
    });

    it("test_invalid_signature", async () => {
        content = `{"event": {"created": "2025-12-19T19:20:08.687079+00:00", "id": "4543235613523968", "log": {"created": "2025-12-19T19:20:08.107566+00:00", "dispute": {"bacenId": "42e3c802-22c0-4862-b352-cedc912c07a1", "created": "2025-12-19T19:16:04.867430+00:00", "description": "", "flow": "in", "id": "4652621482688512", "maxHopCount": 5, "maxHopInterval": 86400, "maxTransactionCount": 500, "method": "scam", "minTransactionAmount": 20000, "operatorEmail": "fraud@company.com", "operatorPhone": "+5511989898989", "referenceId": "E20018183202512191914WcfANNEIYnt", "status": "analysed", "tags": [], "transactions": [{"amount": 20000, "endToEndId": "E20018183202512191914WcfANNEIYnt", "nominalAmount": 20000, "receiverAccountCreated": "", "receiverBankCode": "39908427", "receiverId": "1", "receiverTaxIdCreated": "", "receiverType": "business", "senderAccountCreated": "", "senderBankCode": "20018183", "senderId": "2", "senderTaxIdCreated": "", "senderType": "business", "settled": "2025-12-19T19:14:25.760000+00:00"}], "updated": "2025-12-19T19:20:08.107585+00:00"}, "errors": [], "id": "6007878011846656", "type": "analysed"}, "subscription": "pix-dispute", "workspaceId": "5560467233701888"}}`;
        invalidSignature = "MEYCIQCPgzyktxtttM9ooQaXq37NvFjL2cF/nQMfl1rvUcsLAQIhAKLbphPa5311mHvXlz6Rtkk+LPhctxgGYOnxAdhdldls";

        try {
            await starkinfra.event.parse({
                content: content,
                signature: invalidSignature
            });
        } catch (e) {
            return;
        }
        throw new Error("Oops, signature was accepted!");
    });
});
