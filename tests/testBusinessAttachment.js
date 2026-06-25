const fs = require('fs');
const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleBusinessIdentityJson} = require('./utils/businessIdentity');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBusinessAttachmentPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = [generateExampleBusinessIdentityJson()];
        identities = await starkinfra.businessIdentity.create(identities);
        assert(typeof identities[0].id == 'string');
        assert(identities.length == 1);

        let file = fs.readFileSync('tests/utils/identity/identity-front-face.png');
        let attachments = await starkinfra.businessAttachment.create([
            new starkinfra.BusinessAttachment({
                name: "contrato-social.png",
                content: file,
                contentType: "image/png",
                businessIdentityId: identities[0].id,
                tags: ["doc-principal"]
            })
        ]);

        assert(typeof attachments[0].id == 'string');
        assert(typeof attachments[0].businessIdentityId == 'string');
    });
});

describe('TestBusinessAttachmentQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let attachments = await starkinfra.businessAttachment.query({'limit': 10});
        for await (let attachment of attachments) {
            assert(typeof attachment.id == 'string');
        }
    });
});

describe('TestBusinessAttachmentPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.businessAttachment.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
    });
});

describe('TestBusinessAttachmentGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let attachments = await starkinfra.businessAttachment.query({'limit': 1});
        for await (let attachment of attachments) {
            assert(typeof attachment.id == 'string');
            attachment = await starkinfra.businessAttachment.get(attachment.id, {expand: ["content"]});
            assert(typeof attachment.id == 'string');
        }
    });
});

describe('TestBusinessAttachmentCancel', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = await starkinfra.businessIdentity.create([generateExampleBusinessIdentityJson()]);
        assert(typeof identities[0].id == 'string');

        let file = fs.readFileSync('tests/utils/identity/identity-front-face.png');
        let attachments = await starkinfra.businessAttachment.create([
            new starkinfra.BusinessAttachment({
                name: "contrato-social.png",
                content: file,
                contentType: "image/png",
                businessIdentityId: identities[0].id,
                tags: ["doc-principal"]
            })
        ]);
        assert(typeof attachments[0].id == 'string');

        let attachment = await starkinfra.businessAttachment.cancel(attachments[0].id);
        assert(typeof attachment.id == 'string');
    });
});
