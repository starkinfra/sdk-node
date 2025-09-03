const { randomUUID } = require('crypto');

const exampleCreditNote = {
    externalId: randomUUID(),
    invoices: [{
        amount: 200000,
        due: "2049-06-16"
    }],
    name: "Jamie Lannister",
    nominalAmount: 200000,
    rebateAmount: 0,
    scheduled: "2049-06-07",
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

exports.exampleCreditNote = exampleCreditNote;
