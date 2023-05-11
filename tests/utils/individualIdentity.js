const { IndividualIdentity } = require("../../sdk/individualIdentity");

exports.generateExampleIndividualIdentityJson = () => {
    return new IndividualIdentity({
        name: "Jamie Lannister",
        taxId: "012.345.678-90",
        tags: ["test", "testing"]
    })
};
