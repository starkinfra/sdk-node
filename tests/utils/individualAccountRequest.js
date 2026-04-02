const starkinfra = require('../../index.js');

exports.generateExampleIndividualAccountRequest = function () {
    return {
        name: "John Doe",
        taxId: "012.345.678-90",
        address: "R. pamplona, 123",
        income: 100000,
        tags: ["savings"]
    };
};

exports.generateExampleIndividualAccountRequestToUpdate = function () {
    return {
        name: "Tony Stark",
        taxId: "634.906.770-30",
        address: "R. pamplona, 4321",
        income: 50000
    };
};
