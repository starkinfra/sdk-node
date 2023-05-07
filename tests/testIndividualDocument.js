const fs = require('fs');
const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleIndividualIdentityJson} = require('./utils/individualIdentity');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIndividualDocumentPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = [generateExampleIndividualIdentityJson()];
        identities = await starkinfra.individualIdentity.create(identities);
        assert(typeof identities[0].id == 'string');
        assert(identities.length == 1);
        
        let image = fs.readFileSync('tests/utils/identity/identity-front-face.png');
        let documents = await starkinfra.individualDocument.create([
            new starkinfra.IndividualDocument({
                content: image,
                contentType: "image/png",
                type: "identity-front",
                identityId: identities[0].id,
            }) 
        ]);

        assert(typeof documents[0].id == 'string');

        image = fs.readFileSync('tests/utils/identity/identity-back-face.png');
        documents = await starkinfra.individualDocument.create([
            new starkinfra.IndividualDocument({
                content: image,
                contentType: "image/png",
                type: "identity-back",
                identityId: identities[0].id,
            }) 
        ]);

        assert(typeof documents[0].id == 'string');

        image = fs.readFileSync('tests/utils/identity/walter-white.png');
        documents = await starkinfra.individualDocument.create([
            new starkinfra.IndividualDocument({
                content: image,
                contentType: "image/png",
                type: "selfie",
                identityId: identities[0].id,
            }) 
        ]);

        assert(typeof documents[0].id == 'string');

        let individual = await starkinfra.individualIdentity.update(
            identities[0].id,
            {
                status: "processing",
            }
        )
        assert(individual.status == 'processing');
    });
});

describe('TestIndividualDocumentQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let documents = await starkinfra.individualDocument.query({'limit': 10});
        for await (let document of documents) {
            assert(typeof document.id == 'string');
        }
    });
});

describe('TestIndividualDocumentPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.individualDocument.page({ limit: 5, cursor: cursor });
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

describe('TestIndividualDocumentGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let documents = await starkinfra.individualDocument.query({'limit': 1});
        for await (let document of documents) {
            assert(typeof document.id == 'string');
            document = await starkinfra.individualDocument.get(document.id);
            assert(typeof document.id == 'string');
        }
    });
});
