const fs = require('fs');
const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleCreditHolmesJson} = require('./utils/creditHolmes.js');

starkinfra.user = require('./utils/user.js').exampleProject;


describe('TestCreditHolmesPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holmes = generateExampleCreditHolmesJson();
        holmes = await starkinfra.creditHolmes.create(holmes);
        assert(typeof holmes[0].id == 'string');
        assert(holmes.length == 1);
    });
});

describe('TestCreditHolmesQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holmes = await starkinfra.creditHolmes.query({'limit': 10});
        for await (let sherlock of holmes) {
            assert(typeof sherlock.id == 'string');
        }
    });
});

describe('TestCreditHolmesPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.creditHolmes.page({ limit: 5, cursor: cursor });
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

describe('TestCreditHolmesGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let holmes = await starkinfra.creditHolmes.query({'limit': 1});
        for await (let sherlock of holmes) {
            assert(typeof sherlock.id == 'string');
            sherlock = await starkinfra.creditHolmes.get(sherlock.id);
            assert(typeof sherlock.id == 'string');
        }
    });
});
