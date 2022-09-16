const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestCardMethodGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let methods = await starkinfra.cardMethod.query({
            search: 'token'
        });
        for await (let method of methods) {
            assert.notEqual(method.name, null);
        }
    });
});
