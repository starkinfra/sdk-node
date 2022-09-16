const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestMerchantCountryGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let countries = await starkinfra.merchantCountry.query({
            search: 'Brazil'
        });
        for await (let country of countries) {
            assert.notEqual(country.name, null);
        }
    });
});
