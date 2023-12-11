const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


const CONTENT = `{\"activationMethod\": {\"type\": \"text\", \"value\": \"** *****-5678\"}, \"tokenId\": \"5585821789122165\", \"tags\": [\"token\", \"user/1234\"], \"cardId\": \"5189831499972623\"}`;
const VALID_SIGNATURE = 'MEUCIAxn0FmsPWI4r3Y7Nq8xFNQHYZgo0QAGDQ4/7CajKoVuAiEA09kXWrPMhsw4JbgC3pmNccCWr+hidfop/KsSNqza0yE=';
const INVALID_SIGNATURE = 'MEUCIQDOpo1j+V40DNZK2URL2786UQK/8mDXon9ayEd8U0/l7AIgYXtIZJBTs8zCRR3vmted6Ehz/qfw1GRut/eYyvf1yOk=';


describe('TestIssuingTokenActivationParseRight', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let authorization = await starkinfra.issuingTokenActivation.parse(CONTENT, VALID_SIGNATURE)
    });
});


describe('TestIssuingTokenActivationParseWrong', function() {
    this.timeout(10000)
    it('test_success', async () => {
        let error = false;
        try {
            let authorization = await starkinfra.issuingTokenActivation.parse(CONTENT, INVALID_SIGNATURE)
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});

describe('TestIssuingTokenActivationParseMalformed', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let authorization = await starkinfra.issuingTokenActivation.parse(CONTENT, 'something is definitely wrong')
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});