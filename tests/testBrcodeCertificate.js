const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBrcodeCertificateQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const certificates = await starkinfra.brcodeCertificate.query({});
        for await (let certificate of certificates) {
            assert(typeof certificate.content === "string");
        }
    });
});
