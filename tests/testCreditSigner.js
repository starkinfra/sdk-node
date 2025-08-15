const assert = require('assert');
const starkinfra = require('../index.js');
const {templateId} = require('./utils/user.js');
const {bacenId} = require('../index');

starkinfra.user = require('./utils/user.js').exampleProject;

describe('TestCreditSignerResendToken', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let notes = await starkinfra.creditNote.query({limit: 1});
        for await (let note of notes) {
            assert(typeof note.id == 'string');
            let signature = await starkinfra.creditSigner.resendToken(note.id);
            assert(typeof signature.isSent == 'string');
        }
    });
});

let exampleCreditNote = {
    externalId: "my_unique_id_" + new Date().getTime(),
    invoices: [{
        amount: 23422413,
        due: "2024-06-16"
    }],
    name: "Jamie Lannister",
    rebateAmount: 0,
    scheduled: "2023-06-07",
    signers: [{
        contact: "https://b591-179-191-69-138.sa.ngrok.io",
        method: "server",
        name: "Jamie Lannister"
    }],
    taxId: "012.345.678-90",
    templateId: "5706627130851328",
    paymentType: "transfer",
    payment: {
        accountNumber: "5005482",
        bankCode: "60701190",
        branchCode: "7248",
        name: "Jamie Lannister",
        taxId: "594.739.480-42"
    },
    city: "São Paulo",
    stateCode: "SP",
    district: "Jardim Paulista",
    streetLine1: "Rua ABC",
    streetLine2: "Ap 123",
    zipCode: "01234-567"
}
