const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleBusinessIdentityJson} = require('./utils/businessIdentity');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBusinessIdentityQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = await starkinfra.businessIdentity.query({'limit': 10});
        for await (let identity of identities) {
            assert(typeof identity.id == 'string');
        }
    });
});

describe('TestBusinessIdentityPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.businessIdentity.page({ limit: 5, cursor: cursor });
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

describe('TestBusinessIdentityGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identities = await starkinfra.businessIdentity.query({'limit': 1});
        for await (let identity of identities) {
            assert(typeof identity.id == 'string');
            identity = await starkinfra.businessIdentity.get(identity.id);
            assert(typeof identity.id == 'string');
        }
    });
});

describe('TestBusinessIdentityPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identity = (await starkinfra.businessIdentity.create([generateExampleBusinessIdentityJson()]))[0];
        assert(typeof identity.id == 'string');
        let businessId = identity.id;
        identity = await starkinfra.businessIdentity.cancel(businessId);
        assert(typeof identity.id == 'string');
    });
});

describe('TestBusinessIdentityUpdate', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let identity = (await starkinfra.businessIdentity.create([generateExampleBusinessIdentityJson()]))[0];
        assert(typeof identity.id == 'string');
        identity = await starkinfra.businessIdentity.update(
            identity.id,
            {
                tags: ['testing'],
            }
        );
        assert(typeof identity.id == 'string');
    });
});
