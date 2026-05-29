const assert = require("assert");
const starkinfra = require("../index.js");
const {generateExampleIndividualAccountRequest} = require('./utils/individualAccountRequest');
const {generateExampleIndividualAccountAttachment, exampleImageContent} = require('./utils/individualAccountAttachment');

starkinfra.user = require("./utils/user").exampleProject;

async function freshAccountRequestId() {
    let requests = await starkinfra.individualAccountRequest.create([
        new starkinfra.IndividualAccountRequest(generateExampleIndividualAccountRequest())
    ]);
    return requests[0].id;
}


describe("TestIndividualAccountAttachmentExposure", function() {
    this.timeout(10000);
    it("test_success", async () => {
        assert(typeof starkinfra.individualAccountAttachment === "object");
        assert(typeof starkinfra.IndividualAccountAttachment === "function");
        assert(typeof starkinfra.individualAccountAttachment.create === "function");
        assert(typeof starkinfra.individualAccountAttachment.get === "function");
        assert(typeof starkinfra.individualAccountAttachment.query === "function");
        assert(typeof starkinfra.individualAccountAttachment.page === "function");
        assert(typeof starkinfra.individualAccountAttachment.cancel === "function");
        assert(starkinfra.accountRequestAttachment === undefined);
        assert(starkinfra.AccountRequestAttachment === undefined);
    });
});

describe("TestIndividualAccountAttachmentDataUrlEncoding", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let raw = exampleImageContent();
        let attachment = new starkinfra.IndividualAccountAttachment({
            type: "identity-front",
            content: raw,
            contentType: "image/png",
            accountRequestId: "5189530608992256"
        });
        assert(typeof attachment.content === "string");
        assert(attachment.content.startsWith("data:image/png;base64,"));
        assert(attachment.content === "data:image/png;base64," + raw.toString("base64"));
    });
});

describe("TestIndividualAccountAttachmentContentTypeInputOnly", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let attachment = new starkinfra.IndividualAccountAttachment({
            type: "identity-front",
            content: exampleImageContent(),
            contentType: "image/png",
            accountRequestId: "5189530608992256"
        });
        assert(attachment.contentType === null);
    });
});

describe("TestIndividualAccountAttachmentPost", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountRequest.create([generateExampleIndividualAccountRequest()]);
        for await (let request of requests) {
            let attachments = await starkinfra.individualAccountAttachment.create([
                new starkinfra.IndividualAccountAttachment(generateExampleIndividualAccountAttachment(request.id))
            ]);
            for (let attachment of attachments) {
                assert(typeof attachment.id == "string");
            }
        }
    });
});

describe("TestIndividualAccountAttachmentTypeEnum", function() {
    this.timeout(10000);
    it("test_success", async () => {
        const allowed = ["drivers-license-front", "drivers-license-back", "identity-front", "identity-back"];
        for (let t of allowed) {
            let attachment = new starkinfra.IndividualAccountAttachment({
                type: t,
                content: exampleImageContent(),
                contentType: "image/png",
                accountRequestId: "5189530608992256"
            });
            assert(attachment.type === t);
        }
    });
});

describe("TestIndividualAccountAttachmentGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const attachments = await starkinfra.individualAccountAttachment.query({limit: 10});
        for await (let attachment of attachments) {
            assert(typeof attachment.id == "string");
            i += 1;
        }
        assert(i === 10);
    });
});

describe("TestIndividualAccountAttachmentInfoGet", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let attachments = await starkinfra.individualAccountAttachment.query({limit: 3});
        for await (let attachment of attachments) {
            assert(typeof attachment.id == "string");
            attachment = await starkinfra.individualAccountAttachment.get(attachment.id);
            assert(typeof attachment.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let attachments = await starkinfra.individualAccountAttachment.query({limit: 10});
        let idsExpected = [];
        for await (let attachment of attachments) {
            idsExpected.push(attachment.id);
        }

        let attachmentsResult = await starkinfra.individualAccountAttachment.query({ids: idsExpected});
        let idsResult = [];
        for await (let attachment of attachmentsResult){
            idsResult.push(attachment.id);
        }

        idsExpected.sort();
        idsResult.sort();
        assert(idsExpected.length === idsResult.length);
        for (let i=0; i<idsExpected.length; i++){
            assert(idsExpected[i] === idsResult[i]);
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
        const attachments = await starkinfra.individualAccountAttachment.query({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "created",
            tags: ["food","drink"],
            ids: ["1","2"]
        });
        assert(attachments.length===undefined)
    });
});

describe("TestIndividualAccountAttachmentPageParams", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let attachments = null;
        [attachments, cursor] = await starkinfra.individualAccountAttachment.page({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "created",
            tags: ["food","drink"],
            ids: ["1","2"]
        });
        assert(attachments.length===0)
    });
});

describe("TestIndividualAccountAttachmentPostAndCancel", function() {
    this.timeout(10000);
    it("test_success", async () => {
        let requests = await starkinfra.individualAccountRequest.create([generateExampleIndividualAccountRequest()]);
        for await (let request of requests) {
            let attachments = await starkinfra.individualAccountAttachment.create([
                new starkinfra.IndividualAccountAttachment(generateExampleIndividualAccountAttachment(request.id))
            ]);
            for (let attachment of attachments) {
                let deleted = await starkinfra.individualAccountAttachment.cancel(attachment.id);
                assert(deleted.status === "deleted");
            }
        }
    });
});

describe("TestIndividualAccountAttachmentDatetimeParsing", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const attachments = await starkinfra.individualAccountAttachment.query({ limit: 1 });
        for await (let attachment of attachments) {
            assert(typeof attachment.created === 'string');
        }
    });
});

describe("TestIndividualAccountAttachmentInvalidType", function () {
    this.timeout(10000);
    it("test_invalid_type", async () => {
        let ok = false;
        let accountRequestId = await freshAccountRequestId();
        let params = generateExampleIndividualAccountAttachment(accountRequestId);
        params.type = "not-a-real-type";
        try {
            await starkinfra.individualAccountAttachment.create([new starkinfra.IndividualAccountAttachment(params)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountAttachmentInvalidContent", function () {
    this.timeout(10000);
    it("test_invalid_content", async () => {
        let ok = false;
        let accountRequestId = await freshAccountRequestId();
        let params = generateExampleIndividualAccountAttachment(accountRequestId);
        params.content = "";
        delete params.contentType;
        try {
            await starkinfra.individualAccountAttachment.create([new starkinfra.IndividualAccountAttachment(params)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountAttachmentInvalidContentType", function () {
    this.timeout(10000);
    it("test_invalid_content_type", async () => {
        let ok = false;
        let accountRequestId = await freshAccountRequestId();
        let params = generateExampleIndividualAccountAttachment(accountRequestId);
        delete params.contentType;
        try {
            await starkinfra.individualAccountAttachment.create([new starkinfra.IndividualAccountAttachment(params)]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountAttachmentAccountRequestNotFound", function () {
    this.timeout(10000);
    it("test_account_request_not_found", async () => {
        let ok = false;
        let attachment = new starkinfra.IndividualAccountAttachment(generateExampleIndividualAccountAttachment("0"));
        try {
            await starkinfra.individualAccountAttachment.create([attachment]);
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});

describe("TestIndividualAccountAttachmentCancelIdempotent", function () {
    this.timeout(10000);
    it("test_second_cancel_succeeds", async () => {
        let requests = await starkinfra.individualAccountRequest.create([generateExampleIndividualAccountRequest()]);
        for await (let request of requests) {
            let attachments = await starkinfra.individualAccountAttachment.create([
                new starkinfra.IndividualAccountAttachment(generateExampleIndividualAccountAttachment(request.id))
            ]);
            for (let attachment of attachments) {
                let firstCancel = await starkinfra.individualAccountAttachment.cancel(attachment.id);
                assert(firstCancel.status === "deleted");
                let secondCancel = await starkinfra.individualAccountAttachment.cancel(attachment.id);
                assert(secondCancel.status === "deleted");
            }
        }
    });
});

describe("TestIndividualAccountAttachmentNotFound", function () {
    this.timeout(10000);
    it("test_not_found", async () => {
        let ok = false;
        try {
            await starkinfra.individualAccountAttachment.get("0");
        } catch (e) {
            if (!(e instanceof starkinfra.error.InputErrors))
                throw e;
            ok = true;
        }
        assert(ok);
    });
});
