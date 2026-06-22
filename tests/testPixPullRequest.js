const assert = require("assert");
const starkinfra = require("../index.js");
const pixPullRequest = require("./utils/pixPullRequest.js");

starkinfra.user = require("./utils/user").exampleProject;


describe("TestPixPullRequestPost", function () {
    this.timeout(30000);
    it("test_success", async () => {
        let subscriptionId = null;
        const subscriptions = await starkinfra.pixPullSubscription.query({status: "active", limit: 1});
        for await (let sub of subscriptions) {
            subscriptionId = sub.id;
            break;
        }
        if (!subscriptionId) {
            try {
                let requests = [];
                requests.push(pixPullRequest.examplePixPullRequest());
                requests = await starkinfra.pixPullRequest.create(requests);
                for (let request of requests) {
                    assert(typeof request.id == "string");
                }
            } catch (e) {
                const msg = e.message || "";
                const isExpected = msg.includes("invalidPixPullSubscription") || msg.includes("invalidAction") || msg.includes("invalidCancellation");
                if (!isExpected) throw e;
            }
            return;
        }
        let requests = [];
        requests.push(new starkinfra.pixPullRequest.PixPullRequest(examplePixPullRequest(subscriptionId)));
        requests = await starkinfra.pixPullRequest.create(requests);
        for (let request of requests) {
            assert(typeof request.id == "string");
        }
    });
});


describe("TestPixPullRequestQuery", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const requests = await starkinfra.pixPullRequest.query({limit: 10});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            i += 1;
        }
        assert(i <= 10);
    });
});


describe("TestPixPullRequestGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixPullRequest.page({limit: 2, cursor: cursor});
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length <= 4);
    });
});


describe("TestPixPullRequestQueryParams", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.pixPullRequest.query({
            limit: 2,
            after: "2026-01-01",
            before: "2026-04-30",
            status: "created",
            tags: ["test"],
            ids: ["1", "2"],
            flows: ["out"],
            subscriptionIds: ["1", "2"],
        });
        assert(requests.length === undefined);
    });
});


describe("TestPixPullRequestInfoGet", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.pixPullRequest.query({limit: 3});
        for await (let request of requests) {
            assert(typeof request.id === "string");
            const got = await starkinfra.pixPullRequest.get(request.id);
            assert(typeof got.id === "string");
            assert.strictEqual(got.id, request.id);
        }
    });
});


describe("TestPixPullRequestPatch", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let requestId = null;
        const requests = await starkinfra.pixPullRequest.query({status: "created", limit: 1});
        for await (let req of requests) {
            requestId = req.id;
            break;
        }
        if (!requestId) return;
        try {
            const updated = await starkinfra.pixPullRequest.update(requestId, {
                status: "scheduled",
            });
            assert(typeof updated.id === "string");
        } catch (e) {
            const msg = e.message || "";
            const isExpected = msg.includes("invalidAction")
                || msg.includes("invalidStatusPatch")
                || msg.includes("invalidJson");
            if (!isExpected) throw e;
        }
    });
});


describe("TestPixPullRequestCancel", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let requestId = null;
        const requests = await starkinfra.pixPullRequest.query({status: "created", limit: 1});
        for await (let req of requests) {
            requestId = req.id;
            break;
        }
        if (!requestId) return;
        try {
            const canceled = await starkinfra.pixPullRequest.cancel(requestId, "senderUserRequested");
            assert(typeof canceled.id === "string");
        } catch (e) {
            const msg = e.message || "";
            const isExpected = msg.includes("invalidAction")
                || msg.includes("invalidCancellation");
            if (!isExpected) throw e;
        }
    });
});


describe("TestPixPullRequestNoParse", function () {
    it("test_parse_is_undefined", () => {
        assert.strictEqual(starkinfra.pixPullRequest.parse, undefined);
    });
});


describe("TestPixPullRequestNormalization", function () {
    it("test_empty_due_becomes_null", () => {
        const req = new starkinfra.pixPullRequest.PixPullRequest({
            amount: 1000,
            due: "",
            endToEndId: "E32160637202604011200abc12345xyz",
            receiverAccountNumber: "00000000",
            receiverAccountType: "checking",
            receiverBankCode: "32160637",
            reconciliationId: "test-reconciliation",
            subscriptionId: "5656565656565656",
        });
        assert.strictEqual(req.due, null);
    });
});


describe("TestPixPullRequestEventParse", function () {
    this.timeout(10000);
    const content = `{"event": {"created": "2026-03-17T22:17:48.687366+00:00", "id": "5980132964564992", "log": {"created": "2026-03-17T22:17:44.741312+00:00", "description": "The Pix Pull Request was created in Stark Infra.", "errors": [], "id": "4777799707525120", "reason": "", "request": {"amount": 79562, "attemptType": "default", "created": "2026-03-17T22:17:44.727124+00:00", "description": "Monthly fare", "due": "2026-03-18T19:17:44.382949+00:00", "endToEndId": "E32160637202617031917FXbuEOeqxTE", "flow": "out", "id": "5859939668983808", "receiverAccountNumber": "00000000", "receiverAccountType": "payment", "receiverBankCode": "32160637", "receiverBranchCode": "", "receiverName": "Stark Bank", "receiverTaxId": "39.908.427/0001-28", "reconciliationId": "20260317191744.382994-03001917VKqeyyGMWvK", "senderBankCode": null, "senderFinalName": "STARK SCD S.A.", "senderFinalTaxId": "39.908.427/0001-28", "senderTaxId": "99.999.919/9999-79", "status": "created", "subscriptionBacenId": "RR321606372026170319175775651", "subscriptionId": "6366699370577920", "tags": [], "updated": "2026-03-17T22:17:45.560279+00:00"}, "type": "created"}, "subscription": "pix-pull-request", "workspaceId": "4828094443552768"}}`;
    const validSignature = "MEUCIQDPci6mVcRQUqQazbol04cYvz8Ffuhh0birk4+8jSUH4AIgKlLhIH5zKzu+4jQlyabvSJin+8+5kJKiJpoqSQPCITg=";
    const invalidSignature = "MEUCIQDPci6mVcRQUqQazbol04cYvz8Ffuhh0bIrk4+8jSUH4AIgKlLhIH5zKzu+4jQlyabvSJin+8+5kJKiJpoqSQPCITg=";

    it("test_success", async () => {
        const event = await starkinfra.event.parse({content: content, signature: validSignature});
        assert(event.log.request.amount === 79562);
    });

    it("test_invalid_signature", async () => {
        try {
            await starkinfra.event.parse({content: content, signature: invalidSignature});
            throw new Error("Oops, signature was accepted!");
        } catch (e) {
            if (!(e instanceof starkinfra.error.InvalidSignatureError))
                throw e;
        }
    });
});
