const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExamplePixKeyHolmesJson} = require("./utils/pixKeyHolmes");

starkinfra.user = require("./utils/user").exampleProject;


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


describe("TestPixKeyHolmesAttributes", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const holmes = await starkinfra.pixKeyHolmes.query({limit: 5});
        for await (let sherlock of holmes) {
            assert(typeof sherlock.id == "string");
            assert(typeof sherlock.status == "string");
            assert(sherlock.status.length > 0);
            assert(sherlock.created);
            assert(sherlock.updated);
            i += 1;
        }
        assert(i === 5);
    });
});
