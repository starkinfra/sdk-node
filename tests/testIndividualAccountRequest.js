const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExampleIndividualAccountRequest, generateExampleIndividualAccountRequestToUpdate} = require('./utils/individualAccountRequest');

starkinfra.user = require("./utils/user").exampleProject;


describe("TestIndividualAccountRequestPost", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = [];
        requests.push(new starkinfra.IndividualAccountRequest(generateExampleIndividualAccountRequest()));
        requests = await starkinfra.individualAccountRequest.create(requests);
        for (let request of requests) {
            assert(typeof request.id == "string");
        }
    });
});

describe("TestIndividualAccountRequestGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const requests = await starkinfra.individualAccountRequest.query({limit: 10});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            i += 1;
        }
        assert(i === 10);
    });
});

describe("TestIndividualAccountRequestInfoGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountRequest.query({limit: 3});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            request = await starkinfra.individualAccountRequest.get(request.id);
            assert(typeof request.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let requests = await starkinfra.individualAccountRequest.query({limit: 10});
        let requestsIdsExpected = [];
        for await (let request of requests) {
            requestsIdsExpected.push(request.id);
        }

        let requestsResult = await starkinfra.individualAccountRequest.query({ids: requestsIdsExpected});
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

describe("TestIndividualAccountRequestGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.individualAccountRequest.page({ limit: 5, cursor: cursor });
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

describe("TestIndividualAccountRequestQueryParams", function() {
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.individualAccountRequest.query({
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

describe("TestIndividualAccountRequestPageParams", function(){
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.individualAccountRequest.page({
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

describe("TestIndividualAccountRequestPatch", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountRequest.query({ limit: 1 });
        const patchData = generateExampleIndividualAccountRequestToUpdate();
        for await (let request of requests) {
            assert(typeof request.id == "string");
            const updatedRequest = await starkinfra.individualAccountRequest.update(request.id, patchData);
            
            for (let key in patchData) {
                assert.deepStrictEqual(updatedRequest[key], patchData[key]);
            }
        }
    });
});

describe("TestIndividualAccountRequestBirthDate", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let example = generateExampleIndividualAccountRequest();
        example.birthDate = "1990-05-15";
        let requests = await starkinfra.individualAccountRequest.create([example]);
        for (let request of requests) {
            assert(typeof request.id == "string");
            assert.strictEqual(request.birthDate, "1990-05-15");
        }
    });
});
