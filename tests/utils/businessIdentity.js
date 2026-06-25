const { BusinessIdentity } = require("../../sdk/businessIdentity");

exports.generateExampleBusinessIdentityJson = () => {
    return new BusinessIdentity({
        taxId: "20.018.183/0001-80",
        tags: ["test", "testing"]
    })
};
