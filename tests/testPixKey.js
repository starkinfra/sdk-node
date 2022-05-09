const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExamplePixKeyJson} = require("./utils/pixKey");

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixKeyPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const keys = []
        for (let i = 0; i < 2; i++) {
            let key = await starkinfra.pixKey.create(generateExamplePixKeyJson())
            keys.push(key);
        }
        assert(keys.length === 2)
    });
});

describe('TestPixKeyQuery', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 10});
        for await (let key of keys) {
            assert(typeof key.id == 'string');
        }
    });
});

describe('TestPixKeyPage', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixKey.page({ 'limit': 5, 'cursor': cursor });
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

describe('TestPixKeyGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 1});
        for await (let key of keys) {
            assert(typeof key.id == 'string');
            console.log(key);
            key = await starkinfra.pixKey.get(key.id, '012.345.678-90');
            assert(typeof key.id == 'string');
        }
    });
});

describe('TestPixKeyPatch', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 1, 'status': 'registered', 'type': 'phone'});
        for await (let key of keys) {
            console.log(key);
            assert(key.status === 'registered');
            let branchCode = String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000));
            let updatedPixKey = await starkinfra.pixKey.update(key.id, 'userRequested', {branchCode: branchCode});
            assert(updatedPixKey.branchCode === branchCode);
        }
    });
});
