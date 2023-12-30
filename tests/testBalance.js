const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBalanceGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let balances = await starkinfra.pixBalance.get();
        for await (let balance of balances) {
            assert(typeof balance.amount == 'number');
        }
    });
});
