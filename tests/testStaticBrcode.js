const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleStaticBrcodeJson} = require('./utils/staticBrcode');

starkinfra.user = require('./utils/user').exampleProject;

describe('TestStaticBrcodePost', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let brcodes = [];
        brcodes.push(new starkinfra.StaticBrcode(generateExampleStaticBrcodeJson()));
        brcodes = await starkinfra.staticBrcode.create(brcodes);
        for (let brcode of brcodes) {
            assert(typeof brcode.uuid == 'string');
        }
    });
});

describe('TestStaticBrcodeQueryGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const brcodes = await starkinfra.staticBrcode.query({limit: 5});
        for await (let brcode of brcodes) {
            assert(typeof brcode.uuid == 'string');
            brcode = await starkinfra.staticBrcode.get(brcode.uuid);
            assert(typeof brcode.uuid == 'string');
            i += 1;
        }
        assert(i === 5);
    });
});

describe('TestStaticBrcodeGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let uuids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.staticBrcode.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!uuids.includes(entity.uuid));
                uuids.push(entity.uuid);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(uuids.length === 10);
    });
});
