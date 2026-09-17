const starkinfra = require('../../index.js');


exports.getPixInfractionToPatch = async function () {
    const pixInfractions = [];
    let infractions = null;
    let cursor = null;
    while (pixInfractions.length < 1) {
        [infractions, cursor] = await starkinfra.pixInfraction.page({
            status: 'delivered',
            limit: 5,
            cursor: cursor
        })
        for await (let infraction of infractions) {
            if (infraction.flow === 'in') {
                pixInfractions.push(infraction);
            }
        }
        if (!cursor) {
            break;
        }
    }
    if (pixInfractions.length === 0) {
        return null;
    }
    return pixInfractions[Math.floor(Math.random()*pixInfractions.length)];
};
