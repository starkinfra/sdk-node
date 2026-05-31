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

describe("TestIndividualAccountRequestAddressObject", function() {
    this.timeout(10000);
    it("test_address_is_nested_object", async () => {
        let example = generateExampleIndividualAccountRequest();
        let request = new starkinfra.IndividualAccountRequest(example);

        assert(typeof request.address === "object" && request.address !== null);
        assert(typeof request.address !== "string");

        assert(request.address.street === "Rua do Estilo Barroco");
        assert(request.address.number === "648");
        assert(request.address.neighborhood === "Santo Amaro");
        assert(request.address.city === "Sao Paulo");
        assert(request.address.state === "SP");
        assert(request.address.zipCode === "05724005");

        assert(request.addressStreet === undefined);
        assert(request.addressCity === undefined);
        assert(request.addressZipCode === undefined);
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
            assert(updatedRequest.address.street === patchData.address.street);
            assert(updatedRequest.address.zipCode === patchData.address.zipCode);
            assert(updatedRequest.name === patchData.name);
        }
    });
});

describe("TestIndividualAccountRequestStatusEnum", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const allowed = ["approved", "created", "denied", "processing", "updated"];
        const requests = await starkinfra.individualAccountRequest.query({ limit: 10 });
        for await (let request of requests) {
            assert(allowed.includes(request.status));
        }
    });
});

describe("TestIndividualAccountRequestDatetimeParsing", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.individualAccountRequest.query({ limit: 1 });
        for await (let request of requests) {
            assert(typeof request.created === 'string');
            assert(typeof request.updated === 'string');
        }
    });
});

describe("TestIndividualAccountRequestOutputOnlyFields", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let example = generateExampleIndividualAccountRequest();
        example.id = "5189530608992256";
        example.status = "processing";
        example.accountType = "individual";
        let request = new starkinfra.IndividualAccountRequest(example);
        assert(request.id === "5189530608992256");
        assert(request.status === "processing");
        assert(request.accountType === "individual");
    });
});

describe("TestIndividualAccountRequestInvalidName", function () {
    this.timeout(10000);
    it("test_invalid_name", async () => {
        let ok = false;
        let example = generateExampleIndividualAccountRequest();
        example.name = "";
        try {
            await starkinfra.individualAccountRequest.create([new starkinfra.IndividualAccountRequest(example)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountRequestInvalidTaxId", function () {
    this.timeout(10000);
    it("test_invalid_tax_id", async () => {
        let ok = false;
        let example = generateExampleIndividualAccountRequest();
        example.taxId = "000.000.000-00";
        try {
            await starkinfra.individualAccountRequest.create([new starkinfra.IndividualAccountRequest(example)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountRequestInvalidAddress", function () {
    this.timeout(10000);
    it("test_invalid_address", async () => {
        let ok = false;
        let example = generateExampleIndividualAccountRequest();
        example.address = { street: "Rua do Estilo Barroco" };
        try {
            await starkinfra.individualAccountRequest.create([new starkinfra.IndividualAccountRequest(example)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountRequestInvalidIncome", function () {
    this.timeout(10000);
    it("test_invalid_income", async () => {
        let ok = false;
        let example = generateExampleIndividualAccountRequest();
        example.income = -1;
        try {
            await starkinfra.individualAccountRequest.create([new starkinfra.IndividualAccountRequest(example)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountRequestInvalidStatus", function () {
    this.timeout(10000);
    it("test_invalid_status", async () => {
        let ok = false;
        let request = (await starkinfra.individualAccountRequest.create([
            new starkinfra.IndividualAccountRequest(generateExampleIndividualAccountRequest())
        ]))[0];
        try {
            await starkinfra.individualAccountRequest.update(request.id, {status: "not-a-real-status"});
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountRequestNotFound", function () {
    this.timeout(10000);
    it("test_not_found", async () => {
        let ok = false;
        try {
            await starkinfra.individualAccountRequest.get("0");
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});
