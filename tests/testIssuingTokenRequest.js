const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleIssuingTokenRequestJson} = require('./utils/issuingTokenRequest.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingTokenRequestPost', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let requests = [];
        let cards = await starkinfra.issuingToken.query({'limit': 1, 'status': 'active'});
        for await(let card of cards) {
            requests = await starkinfra.issuingTokenRequest.create(generateExampleIssuingTokenRequestJson(card.id));
        }
        for (let request of requests) {
            assert(typeof request.id == 'string');
        }
    });
});