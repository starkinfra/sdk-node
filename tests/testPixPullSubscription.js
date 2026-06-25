const assert = require("assert");
const starkinfra = require("../index.js");
const starkcoreError = require("starkcore/starkcore/error.js");
const pixPullSubscription = require("./utils/pixPullSubscription.js");

starkinfra.user = require("./utils/user").exampleProject;

describe("TestPixPullSubscriptionPost", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let subscriptions = [];
        subscriptions.push(pixPullSubscription.examplePixPullSubscription());
        subscriptions = await starkinfra.pixPullSubscription.create(subscriptions);
        for (let subscription of subscriptions) {
            assert(typeof subscription.id == "string");
        }
    });
});


describe("TestPixPullSubscriptionQuery", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const subscriptions = await starkinfra.pixPullSubscription.query({limit: 10});
        for await (let subscription of subscriptions) {
            assert(typeof subscription.id == "string");
            i += 1;
        }
        assert(i <= 10);
    });
});


describe("TestPixPullSubscriptionInfoGet", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let subscriptions = await starkinfra.pixPullSubscription.query({limit: 3});
        for await (let subscription of subscriptions) {
            assert(typeof subscription.id == "string");
            subscription = await starkinfra.pixPullSubscription.get(subscription.id);
            assert(typeof subscription.id == "string");
        }
    });
});


describe("TestPixPullSubscriptionGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixPullSubscription.page({limit: 2, cursor: cursor});
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


describe("TestPixPullSubscriptionQueryParams", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const subscriptions = await starkinfra.pixPullSubscription.query({
            limit: 2,
            after: "2026-01-01",
            before: "2026-04-30",
            status: "active",
            tags: ["test"],
            ids: ["1", "2"],
        });
        assert(subscriptions.length === undefined);
    });
});


describe("TestPixPullSubscriptionParse", function () {
    this.timeout(10000);
    const content = `{"event": {"created": "2026-03-17T20:24:02.006080+00:00", "id": "5739991880695808", "log": {"created": "2026-03-17T20:23:58.050406+00:00", "errors": [], "id": "5340798381981696", "reason": "", "subscription": {"amount": 52064, "amountMinLimit": 0, "bacenId": "RR321606372026170317231564231", "created": "2026-03-17T20:23:57.255567+00:00", "description": "A Lannister always pays his debts", "due": "2026-04-17T02:59:59.999000+00:00", "externalId": "606512134", "flow": "out", "id": "5656970050666496", "installmentEnd": "", "installmentStart": "2026-03-18T02:59:59.999999+00:00", "interval": "month", "pullRetryLimit": 3, "receiverBankCode": "32160637", "receiverName": "Stark Bank", "receiverTaxId": "39.908.427/0001-28", "referenceCode": "36135971", "senderAccountNumber": "55213", "senderBankCode": null, "senderBranchCode": "356", "senderCityCode": "", "senderFinalName": "STARK SCD S.A.", "senderFinalTaxId": "39.908.427/0001-28", "senderTaxId": "99.999.919/9999-79", "status": "created", "tags": [], "type": "push", "updated": "2026-03-17T20:23:58.050421+00:00"}, "type": "delivering"}, "subscription": "pix-pull-subscription", "workspaceId": "4828094443552768"}}`;
    const validSignature = "MEUCIQCCZWR4+JYoDNENLnRbSCGGZf+atOaG4q8jWB3ADgc+DQIgIZ1LuXLZ06pke2qzaMNTlDLwcriuH+S3ve1aTQeqNK0=";
    const invalidSignature = "MEUCIQCCZWR4+JYoDNENLnRbSCGGZf+atOaG4q8jWB3ADgc+DQIgIZ1LuXLZ06pke2qzaMNTlDLwcriuH+S3ve1aTQEqNK0=";
    const malformedSignature = "something is definitely wrong";

    it("test_success", async () => {
        const parsed = await starkinfra.pixPullSubscription.parse(content, validSignature);
        assert(parsed !== null);
    });

    it("test_invalid_signature", async () => {
        try {
            await starkinfra.pixPullSubscription.parse(content, invalidSignature);
            throw new Error("Oops, signature was accepted!");
        } catch (e) {
            if (!(e instanceof starkcoreError.InvalidSignatureError))
                throw e;
        }
    });

    it("test_malformed_signature", async () => {
        try {
            await starkinfra.pixPullSubscription.parse(content, malformedSignature);
            throw new Error("Oops, signature was accepted!");
        } catch (e) {
            if (!(e instanceof starkcoreError.InvalidSignatureError))
                throw e;
        }
    });
});


describe("TestPixPullSubscriptionNormalization", function () {
    it("test_empty_due_and_installment_end_become_null", () => {
        const subscription = new starkinfra.pixPullSubscription.PixPullSubscription({
            ...examplePixPullSubscription,
            due: "",
            installmentEnd: "",
        });
        assert.strictEqual(subscription.due, null);
        assert.strictEqual(subscription.installmentEnd, null);
    });
});


describe("TestPixPullSubscriptionPatch", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let subscriptionId = null;
        const subscriptions = await starkinfra.pixPullSubscription.query({status: "created", limit: 1});
        for await (let sub of subscriptions) {
            subscriptionId = sub.id;
            break;
        }
        if (!subscriptionId) return;
        try {
            const updated = await starkinfra.pixPullSubscription.update(subscriptionId, {
                status: "confirmed",
                senderCityCode: "1100015",
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


describe("TestPixPullSubscriptionCancel", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let subscriptionId = null;
        const subscriptions = await starkinfra.pixPullSubscription.query({status: "active", limit: 1});
        for await (let sub of subscriptions) {
            subscriptionId = sub.id;
            break;
        }
        if (!subscriptionId) return;
        try {
            const canceled = await starkinfra.pixPullSubscription.cancel(subscriptionId, "receiverUserRequested");
            assert(typeof canceled.id === "string");
        } catch (e) {
            const msg = e.message || "";
            const isExpected = msg.includes("invalidAction")
                || msg.includes("invalidCancellation");
            if (!isExpected) throw e;
        }
    });
});
