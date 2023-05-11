const { IssuingRestock } = require("../../sdk/issuingRestock");
const starkinfra = require('../../index.js');

exports.generateExampleIssuingRestockJson = async (n = 1) => {

    const issuingRestocks = [];
    const stocks = await starkinfra.issuingStock.query({
        limit: 1
    });

    let stockId = null;

    for await (let stock of stocks) {
        stockId = await stock.id;
    }

    for (let i = 0; i < n; i++) {
        issuingRestocks.push(
            new IssuingRestock({
            'count': Math.floor(Math.random() * Math.floor(1000)) + Math.ceil(100),
            'stockId': stockId
        }));
    }
    
    return issuingRestocks;
};
