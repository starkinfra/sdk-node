const starkinfra = require('../../index.js');
const uniqueId = require("./uniqueId.js");
const endToEndId = require("./endToEndId.js");
const {bankCode} = require("./user.js");

exports.examplePixPullRequest = function (subscriptionId = "5656565656565656") {
    return new starkinfra.pixPullRequest.PixPullRequest({
        amount: 79562,
        attemptType: "default",
        description: "Monthly fare",
        due: new Date(Date.now() + 4 * 86400000).toISOString().replace("Z", "+00:00"),
        endToEndId: endToEndId.create(bankCode),
        receiverAccountNumber: "00000000",
        receiverAccountType: "payment",
        receiverBankCode: "32160637",
        reconciliationId: uniqueId.create(),
        subscriptionId: subscriptionId,
        tags: ["test", "pix-pull"],
    });
}