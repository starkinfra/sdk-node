exports.generateExampleBusinessAccountRequest = function () {
    return {
        name: "Stark Bank S.A.",
        taxId: "80.382.500/0001-74",
        address: {
            street: "Av. Faria Lima",
            number: "2000",
            neighborhood: "Itaim Bibi",
            city: "São Paulo",
            state: "SP",
            zipCode: "04538-132",
            complement: "Apt 10"
        },
        revenue: 100000000,
        owners: [
            {taxId: "012.345.678-90", name: "Jamie Lannister", role: "partner"},
            {taxId: "812.531.960-36", name: "Cersei Lannister", role: "representative"}
        ],
        tags: ["kyc-verification"]
    };
};
