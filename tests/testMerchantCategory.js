const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestMerchantCategoryGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let categories = await starkinfra.merchantCategory.query({
            search: 'food'
        });
        for await (let category of categories) {
            assert.notEqual(category.name, null);
        }
    });
});
