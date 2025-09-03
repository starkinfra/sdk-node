const assert = require('assert');
const starkinfra = require('../index.js');
const {templateId} = require('./utils/user.js');
const {bacenId} = require('../index');
const {exampleCreditNote} = require('./utils/creditNote')

starkinfra.user = require('./utils/user.js').exampleProject;

describe('TestCreditSignerResendToken', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let notes = await starkinfra.creditNote.create([exampleCreditNote]);
        for await (let note of notes) {
            assert(typeof note.id == 'string');
            let signature = await starkinfra.creditSigner.resendToken(note.signers[0].id);
            assert(signature.isSent == false);
        }
    });
});
