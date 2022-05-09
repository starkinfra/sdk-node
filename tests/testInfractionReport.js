const assert = require('assert');
const starkinfra = require('../index.js');
const endToEndId = require('./utils/endToEndId.js');
const {getInfractionReportToPatch} = require("./utils/infractionReport");

starkinfra.user = require('./utils/user').exampleProject;


describe('TestInfractionReportPostAndDelete', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let reports = [];
        for (let i = 0; i < 2; i++) {
            let report = new starkinfra.InfractionReport(await generateExampleInfractionReportJson());
            report = await starkinfra.infractionReport.create(report);
            console.log(reports);
            reports.push(report);
        }
        assert(reports.length === 2)
        for (let report of reports) {
            let deletedInfractionReport = await starkinfra.infractionReport.delete(report.id);
            assert(deletedInfractionReport.status === 'canceled');
            console.log(report.id);
        }
    });
});

describe('TestInfractionReportQuery', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const reports = await starkinfra.infractionReport.query({
            limit: 2,
        });

        const ids=[];
        for await(const report of reports) ids.push(report.id);
        assert(ids.length===2)
    });
});


describe('TestInfractionReportGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.infractionReport.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length === 10);
    });
});

describe('TestInfractionReportGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const reports = await starkinfra.infractionReport.query({limit: 1});
        const reportId = (await reports.next()).value.id;
        const report = await starkinfra.infractionReport.get(reportId);
        assert(typeof report.id == 'string');
    });
});

describe('TestInfractionReportInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let reports = await starkinfra.infractionReport.query({limit: 3});
        for await (let report of reports) {
            assert(typeof report.id == 'string');
            report = await starkinfra.infractionReport.get(report.id);
            assert(typeof report.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let reports = await starkinfra.infractionReport.query({limit: 10});
        let reportsIdsExpected = [];
        for await (let report of reports) {
            reportsIdsExpected.push(report.id);
        }

        let reportsResult = await starkinfra.infractionReport.query({ids: reportsIdsExpected});
        let reportsIdsResult = [];
        for await (let report of reportsResult){
            reportsIdsResult.push(report.id);
        }

        reportsIdsExpected.sort();
        reportsIdsResult.sort();
        assert(reportsIdsExpected.length === reportsIdsResult.length);
        for (let i=0; i<reportsIdsExpected.length; i++){
            assert(reportsIdsExpected[i] === reportsIdsResult[i]);
        }
    });
});

describe('TestInfractionReportPatch', function() {  // TODO: {"errors":[{"code":"invalidReport","message":"This infraction report cannot be closed"}]}
    this.timeout(10000);
    it('test_success', async () => {
        let infractionReport = await getInfractionReportToPatch();
        assert(infractionReport.status === 'created');
        console.log(infractionReport);
        infractionReport = await starkinfra.infractionReport.update(infractionReport.id, "agreed")
        assert(infractionReport.status === "agreed");
    });
});

generateExampleInfractionReportJson = async function() {
    let id = await endToEndId.get();
    console.log(id)
    return {
        referenceId: id[0],
        type: "fraud",
    }
}
