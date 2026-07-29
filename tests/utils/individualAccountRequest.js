exports.generateExampleIndividualAccountRequest = function () {
    return {
        name: "John Doe",
        taxId: "101.813.665-76",
        address: {
            street: "R. Pamplona",
            number: "123",
            neighborhood: "Jardim Paulista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01405030",
            complement: "Apt 10"
        },
        income: 100000,
        birthDate: "2012-03-06",
        tags: ["savings"]
    };
};

exports.generateExampleIndividualAccountRequestToUpdate = function () {
    return {
        name: "Tony Stark",
        taxId: "674.840.260-34",
        address: {
            street: "R. Pamplona",
            number: "4321",
            neighborhood: "Jardim Paulista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01405030",
            complement: "Apt 20"
        },
        income: 50000
    };
};
