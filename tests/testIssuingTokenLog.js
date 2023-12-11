const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingTokenLogQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingToken.log.query({'tokenIds': '5715151567192064'});
        for await (let log of logs) {
            console.log(log);
            assert(typeof log.id == 'string');
        }
    });
});

describe('TestIssuingTokenLogPageParams', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let requests = null;
        [requests, cursor] = await starkinfra.issuingToken.log.page({
            limit: 2,
        });
        assert(requests.length===0)
    });
});

describe('TestIssuingTokenLogGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let logs = await starkinfra.issuingToken.log.query({'limit': 1});
        for await (let log of logs) {
            assert(typeof log.id == 'string');
            log = await starkinfra.issuingToken.log.get(log.id);
            assert(typeof log.id == 'string');
        }
    });
});
