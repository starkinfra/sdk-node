const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExamplePixKeyHolmesJson} = require("./utils/pixKeyHolmes");

starkinfra.user = require("./utils/user").exampleProject;


// [M1] create accepts a LIST of PixKeyHolmes and returns the list with the
// server-assigned id (also status/result/created/updated populated). The only
// input fields are key_id (keyId) and tags ([M5], [M7]).
// [M8] the wire resource name is PixKeyHolmes; the endpoint path /pix-key-holmes
// is derived by the core rest layer — exercised implicitly by this round-trip.
describe("TestPixKeyHolmesPost", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let holmes = generateExamplePixKeyHolmesJson();
        holmes = await starkinfra.pixKeyHolmes.create(holmes);
        for (let sherlock of holmes) {
            assert(typeof sherlock.id == "string");
        }
        assert(holmes.length == 1);
    });
});


// [M2] query supports limit (streaming async-iterable list). The full filter
// set (after, before, status, tags, ids) is exercised in TestPixKeyHolmesQueryParams.
describe("TestPixKeyHolmesGet", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const holmes = await starkinfra.pixKeyHolmes.query({limit: 5});
        for await (let sherlock of holmes) {
            assert(typeof sherlock.id == "string");
            i += 1;
        }
        assert(i === 5);
    });
});


// [M2] page supports limit + cursor. [M4] pagination uses an opaque cursor, not
// a numeric page index: two pages of 5 yield 10 distinct ids (or the cursor
// terminates). page returns a [entities, cursor] tuple.
describe("TestPixKeyHolmesGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixKeyHolmes.page({limit: 5, cursor: cursor});
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


// [M2] query accepts every documented filter (limit, after, before, status,
// tags, ids) without rejecting any. query returns an async iterable, so
// `.length` is undefined (it is not a materialized array).
describe("TestPixKeyHolmesQueryParams", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const holmes = await starkinfra.pixKeyHolmes.query({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: ["solved", "solving"],
            tags: ["pix-key-holmes-test"],
            ids: ["1", "2"],
        });
        assert(holmes.length === undefined);
    });
});


// [M2] page accepts the same filters plus cursor. page returns a
// [entities, cursor] tuple, so the entities slice is a real (here empty) array.
describe("TestPixKeyHolmesPageParams", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let holmes = null;
        [holmes, cursor] = await starkinfra.pixKeyHolmes.page({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: ["solved", "solving"],
            tags: ["pix-key-holmes-test"],
            ids: ["1", "2"],
        });
        assert(holmes.length === 0);
    });
});


// [M3] The resource exposes ONLY create, query, page — there is NO get and NO
// cancel/delete. Assert the public surface does not expose those verbs.
// (No TestPixKeyHolmesInfoGet / TestPixKeyHolmesPostAndCancel describe blocks
// are written, by design.)
describe("TestPixKeyHolmesSurface", function () {
    this.timeout(10000);
    it("test_no_get_no_cancel", async () => {
        assert(typeof starkinfra.pixKeyHolmes.create === "function");
        assert(typeof starkinfra.pixKeyHolmes.query === "function");
        assert(typeof starkinfra.pixKeyHolmes.page === "function");
        assert(starkinfra.pixKeyHolmes.get === undefined);
        assert(starkinfra.pixKeyHolmes.cancel === undefined);
        assert(starkinfra.pixKeyHolmes.delete === undefined);
    });
});


// [M5] id/result/status/created/updated are output-only and present on the
// returned entity. [M7] tags defaults to an empty list when omitted.
// [M6] created and updated are PARSED datetime fields. starkcore's
// check.datetime returns a normalized STRING (not a native Date) — see
// node_modules/starkcore/starkcore/utils/check.js — so we assert the field is
// parsed and present (truthy), matching testPixRequest.js / testPixFraud.js.
// `X instanceof Date` would always be false here, so it is NOT asserted.
// status (created|solving|solved|failed) and result (registered|unregistered)
// are an OPEN set — asserted as parsed/non-empty, NOT against a closed enum.
describe("TestPixKeyHolmesAttributes", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const holmes = await starkinfra.pixKeyHolmes.query({limit: 5});
        for await (let sherlock of holmes) {
            assert(typeof sherlock.id == "string");
            // [M5] status parsed and non-empty (open set — do NOT assert a closed enum)
            assert(typeof sherlock.status == "string");
            assert(sherlock.status.length > 0);
            // [M6] created and updated parsed and present (normalized string)
            assert(sherlock.created);
            assert(sherlock.updated);
            i += 1;
        }
        assert(i === 5);
    });
});
