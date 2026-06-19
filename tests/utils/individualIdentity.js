const { IndividualIdentity } = require("../../sdk/individualIdentity");

exports.generateExampleIndividualIdentityJson = () => {
    return new IndividualIdentity({
        name: "Jamie Lannister",
        taxId: "012.345.678-90",
        birthDate: "2012-03-06",
        tags: ["test", "testing"]
    })
};
