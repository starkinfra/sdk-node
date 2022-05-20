const starkinfra = require('../../index.js');

exports.bankCode = process.env.SANDBOX_BANK_CODE
exports.templateId = process.env.SANDBOX_TEMPLATE_ID

exports.exampleProject = new starkinfra.Project(
    {
        environment: 'sandbox',
        id: process.env.SANDBOX_ID, // '5656565656565656',
        privateKey: process.env.SANDBOX_PRIVATE_KEY // '-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIMCwW74H6egQkTiz87WDvLNm7fK/cA+ctA2vg/bbHx3woAcGBSuBBAAK\noUQDQgAE0iaeEHEgr3oTbCfh8U2L+r7zoaeOX964xaAnND5jATGpD/tHec6Oe9U1\nIF16ZoTVt1FzZ8WkYQ3XomRD4HS13A==\n-----END EC PRIVATE KEY-----'
    }
);

exports.exampleOrganization = new starkinfra.Organization(
    {
        environment: 'sandbox',
        id: process.env.SANDBOX_ORGANIZATION_ID, // '5656565656565656',
        privateKey: process.env.SANDBOX_ORGANIZATION_PRIVATE_KEY // '-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIMCwW74H6egQkTiz87WDvLNm7fK/cA+ctA2vg/bbHx3woAcGBSuBBAAK\noUQDQgAE0iaeEHEgr3oTbCfh8U2L+r7zoaeOX964xaAnND5jATGpD/tHec6Oe9U1\nIF16ZoTVt1FzZ8WkYQ3XomRD4HS13A==\n-----END EC PRIVATE KEY-----'
    }
);