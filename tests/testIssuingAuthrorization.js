const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;

const CONTENT = '{"acquirerId": "236090", "amount": 100, "cardId": "5671893688385536", "cardTags": [], "endToEndId": "2fa7ef9f-b889-4bae-ac02-16749c04a3b6", "holderId": "5917814565109760", "holderTags": [], "isPartialAllowed": false, "issuerAmount": 100, "issuerCurrencyCode": "BRL", "merchantAmount": 100, "merchantCategoryCode": "bookStores", "merchantCountryCode": "BRA", "merchantCurrencyCode": "BRL", "merchantFee": 0, "merchantId": "204933612653639", "merchantName": "COMPANY 123", "methodCode": "token", "purpose": "purchase", "score": null, "tax": 0, "walletId": ""}';
const VALID_SIGNATURE = "MEUCIBxymWEpit50lDqFKFHYOgyyqvE5kiHERi0ZM6cJpcvmAiEA2wwIkxcsuexh9BjcyAbZxprpRUyjcZJ2vBAjdd7o28Q=";
const INVALID_SIGNATURE = "MEUCIQDOpo1j+V40DNZK2URL2786UQK/8mDXon9ayEd8U0/l7AIgYXtIZJBTs8zCRR3vmted6Ehz/qfw1GRut/eYyvf1yOk=";


describe('TestIssuingAuthorizationParseRight', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let authorization = await starkinfra.issuingAuthorization.parse({content: CONTENT, signature: VALID_SIGNATURE})
    });
});


describe('TestIssuingAuthorizationParseWrong', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let authorization = await starkinfra.issuingAuthorization.parse({content: CONTENT, signature: INVALID_SIGNATURE})
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});

describe('TestIssuingAuthorizationParseMalformed', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let authorization = await starkinfra.issuingAuthorization.parse({content: CONTENT, signature: "something is definitely wrong"})
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});
