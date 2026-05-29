const starkinfra = require('../../index.js');

exports.generateExampleIndividualAccountRequest = function () {
    return {
        name: "John Doe",
        taxId: "012.345.678-90",
        address: {
            street: "Rua do Estilo Barroco",
            number: "648",
            neighborhood: "Santo Amaro",
            city: "Sao Paulo",
            state: "SP",
            zipCode: "05724005"
        },
        income: 100000,
        tags: ["savings"]
    };
};

exports.generateExampleIndividualAccountRequestToUpdate = function () {
    return {
        name: "Tony Stark",
        taxId: "634.906.770-30",
        address: {
            street: "Av. Faria Lima",
            number: "4321",
            neighborhood: "Itaim Bibi",
            city: "Sao Paulo",
            state: "SP",
            zipCode: "04538133"
        },
        income: 50000
    };
};
