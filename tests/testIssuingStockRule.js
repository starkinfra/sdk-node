const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleIssuingStockRuleJson} = require('./utils/issuingStockRule');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestIssuingStockRuleQuery', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let rules = await starkinfra.issuingStockRule.query({'limit': 10});
        for await (let rule of rules) {
            assert(typeof rule.id == 'string');
        }
    });
});

describe('TestIssuingStockRulePage', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let [page, cursor] = await starkinfra.issuingStockRule.page({ limit: 3 });
        for (let entity of page) {
            assert(typeof entity.id == 'string');
        }
        assert(cursor !== undefined);
    });
});

describe('TestIssuingStockRulePostUpdateAndCancel', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let stockId = null;
        let stocks = await starkinfra.issuingStock.query({limit: 1});
        for await (let stock of stocks) {
            stockId = stock.id;
        }
        assert(typeof stockId == 'string');

        let activeRules = await starkinfra.issuingStockRule.query({
            stockIds: [stockId],
            status: ['active']
        });
        for await (let activeRule of activeRules) {
            await starkinfra.issuingStockRule.cancel(activeRule.id);
        }

        let rules = await starkinfra.issuingStockRule.create(await generateExampleIssuingStockRuleJson(1, stockId));
        let ruleId = null;
        for (let rule of rules) {
            ruleId = rule.id;
        }
        assert(typeof ruleId == 'string');
        assert(ruleId.length > 0);

        let updated = await starkinfra.issuingStockRule.update(ruleId, {'minimumBalance': 20000});
        assert(updated.minimumBalance === 20000);

        let canceled = await starkinfra.issuingStockRule.cancel(ruleId);
        assert(canceled.status === 'canceled');
    });
});
