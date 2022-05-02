const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingWithdrawalQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let withdrawals = await starkinfra.issuingWithdrawal.query({'limit': 10});
        for await (let withdrawal of withdrawals) {
            assert(typeof withdrawal.id == 'string');
        }
    });
});

describe('TestIssuingWithdrawalGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let withdrawals = await starkinfra.issuingWithdrawal.query({'limit': 1});
        for await (let withdrawal of withdrawals) {
            assert(typeof withdrawal.id == 'string');
            withdrawal = await starkinfra.issuingWithdrawal.get(withdrawal.id);
            assert(typeof withdrawal.id == 'string');
        }
    });
});
