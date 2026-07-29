const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExampleBusinessAccountRequest} = require('./utils/businessAccountRequest');

starkinfra.user = require("./utils/user").exampleProject;


describe("TestBusinessAccountRequestPost", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = [];
        requests.push(new starkinfra.BusinessAccountRequest(generateExampleBusinessAccountRequest()));
        requests = await starkinfra.businessAccountRequest.create(requests);
        for (let request of requests) {
            assert(typeof request.id == "string");
        }
    });
});

describe("TestBusinessAccountRequestGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const requests = await starkinfra.businessAccountRequest.query({limit: 10});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            i += 1;
        }
        assert(i === 10);
    });
});

describe("TestBusinessAccountRequestInfoGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.businessAccountRequest.query({limit: 3});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            request = await starkinfra.businessAccountRequest.get(request.id);
            assert(typeof request.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let requests = await starkinfra.businessAccountRequest.query({limit: 10});
        let requestsIdsExpected = [];
        for await (let request of requests) {
            requestsIdsExpected.push(request.id);
        }

        let requestsResult = await starkinfra.businessAccountRequest.query({ids: requestsIdsExpected});
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

describe("TestBusinessAccountRequestGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.businessAccountRequest.page({ limit: 5, cursor: cursor });
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

describe("TestBusinessAccountRequestQueryParams", function() {
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.businessAccountRequest.query({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "created",
            tags: ["food","drink"],
            ids: ["1","2"]
        });
        assert(requests.length===undefined)
    });
});

describe("TestBusinessAccountRequestPageParams", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.businessAccountRequest.page({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "created",
            tags: ["food","drink"],
            ids: ["1","2"]
        });
        assert(requests.length===0)
    });
});
