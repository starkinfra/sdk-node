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
        let brcodes = await starkinfra.staticBrcode.query({limit: 5});
        let brcodesList = [];
        for await (let brcode of brcodes) {
            assert(typeof brcode.uuid == 'string');
            brcode = await starkinfra.staticBrcode.get(brcode.uuid);
            assert(typeof brcode.uuid == 'string');
            brcodesList.push(brcode);
        }
        assert(brcodesList.length === 5);
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
            for (let brcode of page) {
                assert(!uuids.includes(brcode.uuid));
                uuids.push(brcode.uuid);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(uuids.length === 10);
    });
});
