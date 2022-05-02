const starkinfra = require('../../index.js');

exports.generateExampleRulesJson = function (n = 1) {
    let rules = [];

    let intervals = ['day', 'week', 'month', 'instant'];
    let currencies = ['BRL', 'USD'];

    for (let i = 0; i < n; i++) {
        let rule = new starkinfra.IssuingRule({
            'name': 'Example Rule',
            'interval': intervals[Math.floor(Math.random() * intervals.length)],
            'amount': Math.floor(Math.random() * (Math.floor(100000) - Math.ceil(1000) + 1)) + Math.ceil(1),
            'currencyCode': currencies[Math.floor(Math.random() * currencies.length)],
        });
        rules.push(new starkinfra.IssuingRule(rule));
    }
    return rules;
};
