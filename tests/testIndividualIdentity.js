const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleIndividualIdentityJson} = require('./utils/individualIdentity');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIndividualIdentityQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = await starkinfra.individualIdentity.query({'limit': 10});
        for await (let identity of identities) {
            assert(typeof identity.id == 'string');
        }
    });
});

describe('TestIndividualIdentityPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.individualIdentity.page({ limit: 5, cursor: cursor });
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

describe('TestIndividualIdentityGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = await starkinfra.individualIdentity.query({'limit': 1});
        for await (let identity of identities) {
            assert(typeof identity.id == 'string');
            identity = await starkinfra.individualIdentity.get(identity.id);
            assert(typeof identity.id == 'string');
        }
    });
});

describe('TestIndividualIdentityPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identity = (await starkinfra.individualIdentity.create([generateExampleIndividualIdentityJson()]))[0];
        assert(typeof identity.id == 'string');
        let individualId = identity.id;
        identity = await starkinfra.individualIdentity.cancel(individualId);
        assert(typeof identity.id == 'string');
    });
});
