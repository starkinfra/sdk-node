const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExamplePixFraud} = require("./utils/pixFraud");

starkinfra.user = require("./utils/user").exampleProject;


describe("TestPixFraudPost", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let frauds = [];
        frauds.push(generateExamplePixFraud());
        frauds = await starkinfra.pixFraud.create(frauds);
        for (let fraud of frauds) {
            assert(typeof fraud.id == "string");
        }
    });
});


describe("TestPixFraudGet", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const frauds = await starkinfra.pixFraud.query({limit: 5});
        for await (let fraud of frauds) {
            assert(typeof fraud.id == "string");
            i += 1;
        }
        assert(i === 5);
    });
});


describe("TestPixFraudInfoGet", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let frauds = await starkinfra.pixFraud.query({limit: 3});
        for await (let fraud of frauds) {
            assert(typeof fraud.id == "string");
            fraud = await starkinfra.pixFraud.get(fraud.id);
            assert(typeof fraud.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let frauds = await starkinfra.pixFraud.query({limit: 10});
        let fraudsIdsExpected = [];
        for await (let fraud of frauds) {
            fraudsIdsExpected.push(fraud.id);
        }

        let fraudsResult = await starkinfra.pixFraud.query({ids: fraudsIdsExpected});
        let fraudsIdsResult = [];
        for await (let fraud of fraudsResult) {
            fraudsIdsResult.push(fraud.id);
        }

        fraudsIdsExpected.sort();
        fraudsIdsResult.sort();
        assert(fraudsIdsExpected.length === fraudsIdsResult.length);
        for (let i = 0; i < fraudsIdsExpected.length; i++) {
            assert(fraudsIdsExpected[i] === fraudsIdsResult[i]);
        }
    });
});


describe("TestPixFraudGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixFraud.page({limit: 5, cursor: cursor});
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


describe("TestPixFraudQueryParams", function(){
    this.timeout(10000);
    it("test_success", async () => {
        const frauds = await starkinfra.pixFraud.query({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: ["created", "registered"],
            tags: ["fraudulent"],
            ids: ["1", "2"],
        });
        assert(frauds.length === undefined);
    });
});


describe("TestPixFraudPageParams", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let frauds = null;
        [frauds, cursor] = await starkinfra.pixFraud.page({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: ["created", "registered"],
            tags: ["fraudulent"],
            ids: ["1", "2"],
        });
        assert(frauds.length === 0);
    });
});


describe("TestPixFraudPostAndCancel", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let frauds = await starkinfra.pixFraud.query({status: ["registered"], limit: 1});
        for await (let fraud of frauds) {
            let canceled = await starkinfra.pixFraud.cancel(fraud.id);
            assert(typeof canceled.id == "string");
            assert(canceled.id === fraud.id);
        }
    });
});


describe("TestPixFraudAttributes", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const frauds = await starkinfra.pixFraud.query({limit: 5});
        for await (let fraud of frauds) {
            assert(typeof fraud.id == "string");
            assert(typeof fraud.type == "string");
            assert(fraud.type.length > 0);
            assert(typeof fraud.status == "string");
            assert(fraud.status.length > 0);
            assert(fraud.created);
            assert(fraud.updated);
            i += 1;
        }
        assert(i === 5);
    });
});
