const starkinfra = require('../../index.js');


exports.getPixInfractionToPatch = async function () {
    const pixInfractions = [];
    let infractions = null;
    let cursor = null;
    while (pixInfractions < 1) {
        [infractions, cursor] = await starkinfra.pixInfraction.page({
            status: 'created',
            limit: 5,
            cursor: cursor
        })
        for await (let infraction of infractions) {
            console.log(infraction)
            if (infraction.agent !== 'reported') {
                pixInfractions.push(infraction);
            }
        }
        if (!cursor) {
            break;
        }
    }
    return pixInfractions[Math.floor(Math.random()*pixInfractions.length)];
};
