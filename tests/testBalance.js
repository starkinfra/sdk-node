const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBalanceGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let balance = await starkinfra.pixBalance.get();
        assert(typeof balance.amount == 'number');
    });
});
