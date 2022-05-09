const starkinfra = require('../../index.js');


exports.getInfractionReportToPatch = async function () {
    const infractionReports = [];
    let reports = null;
    let cursor = null;
    while (infractionReports < 1) {
        [reports, cursor] = await starkinfra.infractionReport.page({
            status: 'created',
            limit: 5,
            cursor: cursor
        })
        for await (let report of reports) {
            console.log(report)
            if (report.agent !== 'reported') {
                infractionReports.push(report);
            }
        }
        if (!cursor) {
            break;
        }
    }
    return infractionReports[Math.floor(Math.random()*infractionReports.length)];
};
