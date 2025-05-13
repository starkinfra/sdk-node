const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user.js').exampleProject;

describe('TestPixUserGet', function() {
    this.timeout(10000);
    it('test_tax_id_sent', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 5 });
        for await (let key of keys) {
            const sanitizedTaxId = key.taxId.replace(/[.\-\/]/g, '');
            user = await starkinfra.pixUser.get(sanitizedTaxId);
            assert.strictEqual(user.id, sanitizedTaxId);
        }
    });

    it('test_tax_id_not_sent', async () => {
        try {
            const user = await starkinfra.pixUser.get();
            assert.fail('Missing taxId did not return API error');
        } catch (error) {
            if (!(error instanceof TypeError && error.message.includes("Cannot destructure property 'id' of 'undefined' as it is undefined"))) {
                assert.fail('Unexpected error: ' + error.message);
            }
        }
    });

    it('test_key_id_cpf', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 5, 'type': 'cpf'});
        for await (let key of keys) {
            const sanitizedTaxId = key.taxId.replace(/[.\-\/]/g, '');
            user = await starkinfra.pixUser.get(sanitizedTaxId, key.id);
            assert.strictEqual(user.id, sanitizedTaxId);
        }
    });

    it('test_key_id_cnpj', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 5, 'type': 'cnpj'});
        for await (let key of keys) {
            const sanitizedTaxId = key.taxId.replace(/[.\-\/]/g, '');
            user = await starkinfra.pixUser.get(sanitizedTaxId, key.id);
            assert.strictEqual(user.id, sanitizedTaxId);
        }
    });
    
    it('test_key_id_phone', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 1, 'type': 'phone'});
        for await (let key of keys) {
            const sanitizedTaxId = key.taxId.replace(/[.\-\/]/g, '');
            user = await starkinfra.pixUser.get(sanitizedTaxId, key.id);
            assert.strictEqual(user.id, sanitizedTaxId);
        }
    });

    it('test_key_id_email', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 5, 'type': 'email'});
        for await (let key of keys) {
            const sanitizedTaxId = key.taxId.replace(/[.\-\/]/g, '');
            user = await starkinfra.pixUser.get(sanitizedTaxId, key.id);
            assert.strictEqual(user.id, sanitizedTaxId);
        }
    });

    it('test_key_id_evp', async () => {
        let keys = await starkinfra.pixKey.query({'limit': 5, 'type': 'evp'});
        for await (let key of keys) {
            const sanitizedTaxId = key.taxId.replace(/[.\-\/]/g, '');
            user = await starkinfra.pixUser.get(sanitizedTaxId, key.id);
            assert.strictEqual(user.id, sanitizedTaxId);
        }
    });
});
