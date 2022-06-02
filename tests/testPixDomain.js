const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixDomainQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const domains = await starkinfra.pixDomain.query({});
        for await (let domain of domains) {
            assert(typeof domain.name === 'string');
        }
    });
});
