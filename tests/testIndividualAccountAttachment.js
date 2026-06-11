const fs = require('fs');
const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExampleIndividualAccountRequest} = require('./utils/individualAccountRequest');

starkinfra.user = require("./utils/user").exampleProject;


describe("TestIndividualAccountAttachmentPost", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountRequest.create([generateExampleIndividualAccountRequest()]);
        for await (let request of requests) {
            let image = fs.readFileSync('tests/utils/identity/identity-front-face.png');
            let attachments = await starkinfra.individualAccountAttachment.create([
                new starkinfra.IndividualAccountAttachment({
                    content: image,
                    contentType: "image/png",
                    type: "identity-back",
                    accountRequestId: request.id,
                })
            ]);
            assert(typeof attachments[0].id == 'string');
        }
    });
});

describe("TestIndividualAccountAttachmentGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const requests = await starkinfra.individualAccountAttachment.query({limit: 10});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            i += 1;
        }
        assert(i === 10);
    });
});

describe("TestIndividualAccountAttachmentInfoGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountAttachment.query({limit: 3});
        for await (let request of requests) {
            assert(typeof request.id == "string");
            request = await starkinfra.individualAccountAttachment.get(request.id);
            assert(typeof request.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let requests = await starkinfra.individualAccountAttachment.query({limit: 10});
        let requestsIdsExpected = [];
        for await (let request of requests) {
            requestsIdsExpected.push(request.id);
        }

        let requestsResult = await starkinfra.individualAccountAttachment.query({ids: requestsIdsExpected});
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

describe("TestIndividualAccountAttachmentGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.individualAccountAttachment.page({ limit: 5, cursor: cursor });
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

describe("TestIndividualAccountAttachmentQueryParams", function() {
    this.timeout(10000);
    it("test_success", async () => {
        const requests = await starkinfra.individualAccountAttachment.query({
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

describe("TestIndividualAccountAttachmentPageParams", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.individualAccountAttachment.page({
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

describe("TestIndividualAccountAttachmentDelete", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountRequest.create([generateExampleIndividualAccountRequest()]);
        for await (let request of requests) {
            let image = fs.readFileSync('tests/utils/identity/identity-front-face.png');
            let attachments = await starkinfra.individualAccountAttachment.create([
                new starkinfra.IndividualAccountAttachment({
                    content: image,
                    contentType: "image/png",
                    type: "identity-back",
                    accountRequestId: request.id,
                })
            ]);
            assert(typeof attachments[0].id == 'string');
            let attachment = await starkinfra.individualAccountAttachment.delete(attachments[0].id);
            assert(typeof attachment.id == 'string');
        }
    });
});
