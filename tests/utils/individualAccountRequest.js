const starkinfra = require('../../index.js');

exports.generateExampleIndividualAccountRequest = function () {
    return {
        name: "John Doe",
        taxId: "012.345.678-90",
        address: {
            street: "R. Pamplona",
            number: "123",
            neighborhood: "Jardim Paulista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01405030"
        },
        income: 100000,
        tags: ["savings"]
    };
};

exports.generateExampleIndividualAccountRequestToUpdate = function () {
    return {
        name: "Tony Stark",
        taxId: "987.654.321-00",
        address: {
            street: "R. Pamplona",
            number: "4321",
            neighborhood: "Jardim Paulista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01405030"
        },
        income: 50000
    };
};
