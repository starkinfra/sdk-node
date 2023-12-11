const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingTokenQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let tokens = await starkinfra.issuingToken.query({'limit': 5});
        for await (let token of tokens) {
            assert(typeof token.id == 'string');
        }
    });
}); 

describe('TestIssuingTokenPage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.issuingToken.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
    });
});

describe('TestIssuingTokenGet', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let tokens = await starkinfra.issuingToken.query({'limit': 1});
        for await (let token of tokens) {
            assert(typeof token.id == 'string');
            token = await starkinfra.issuingToken.get(token.id);
            assert(typeof token.id == 'string');
        }
    });
});

describe('TestIssuingTokenPatch', function(){
    this.timeout(10000); 
    it('test_success', async () => {
        let tokens = await starkinfra.issuingToken.query({'limit': 1, 'status': 'active'});
        for await (let token of tokens) {
            assert(token.status === 'active');
            let updatedIssuingToken = await starkinfra.issuingToken.update(token.id, {'status': 'blocked'} );
            assert(typeof updatedIssuingToken.id == 'string');
        }
    });
});

const CONTENT = `{\"deviceName\": \"My phone\", \"methodCode\": \"manual\", \"walletName\": \"Google Pay\", \"activationCode\": \"\", \"deviceSerialNumber\": \"2F6D63\", \"deviceImei\": \"352099001761481\", \"deviceType\": \"Phone\", \"walletInstanceId\": \"1b24f24a24ba98e27d43e345b532a245e4723d7a9c4f624e\", \"deviceOsVersion\": \"4.4.4\", \"cardId\": \"5189831499972623\", \"deviceOsName\": \"Android\", \"merchantId\": \"12345678901\", \"walletId\": \"google\"}`;
const VALID_SIGNATURE = 'MEYCIQC4XbhjxEp9VhowLeg9JbSOo94FCRWE9GI7l7OuHh0bUwIhAJBuLDl5DAT9L4iMI0qYQ+PVmBIG5scxxvkWSsoWmwi4';
const INVALID_SIGNATURE = 'MEUCIQDOpo1j+V40DNZK2URL2786UQK/8mDXon9ayEd8U0/l7AIgYXtIZJBTs8zCRR3vmted6Ehz/qfw1GRut/eYyvf1yOk';


describe('TestIssuingTokenParseRight', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let authorization = await starkinfra.issuingToken.parse(CONTENT, VALID_SIGNATURE)
    });
});

describe('TestIssuingTokenParseWrong', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let authorization = await starkinfra.issuingToken.parse(CONTENT, INVALID_SIGNATURE)
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});

describe('TestIssuingTokenParseMalformed', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let error = false;
        try {
            let authorization = await starkinfra.issuingToken.parse(CONTENT, 'something is definitely wrong')
        } catch (e) {
            error = true;
        }
        assert(error);
    });
});

describe('TestIssuingTokenResponseAuthorization', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const token = await starkinfra.issuingToken.responseAuthorization({
            'status': 'approved',
            'activationMethods': [
                {
                    'type': 'app',
                    'value': 'com.subissuer.android'
                },
                {
                    'type': 'text',
                    'value': '** *****-5678'
                }
            ],
            'design': '4584031664472031'
        });
        assert(typeof token === 'string');
    });
});

describe('TestIssuingTokenResponseActivation', function() {
    this.timeout(10000);
    it('test_success', async () => {
        const token = await starkinfra.issuingToken.responseActivation({
            'status': 'approved'
        });
        assert(typeof token === 'string');
    });
});
