const { IssuingStockRule } = require("../../sdk/issuingStockRule");
const starkinfra = require('../../index.js');

exports.generateExampleIssuingStockRuleJson = async (n = 1, stockId = null) => {

    const issuingStockRules = [];

    if (stockId == null) {
        const stocks = await starkinfra.issuingStock.query({
            limit: 1
        });

        for await (let stock of stocks) {
            stockId = stock.id;
        }
    }

    for (let i = 0; i < n; i++) {
        issuingStockRules.push(
            new IssuingStockRule({
            'minimumBalance': 10000,
            'stockId': stockId,
            'tags': ['card', 'corporate'],
            'emails': ['john.doe@enterprise.com'],
            'phones': ['+5511912345678']
        }));
    }

    return issuingStockRules;
};
