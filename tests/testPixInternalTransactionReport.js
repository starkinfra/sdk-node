const assert = require("assert");
const starkinfra = require("../index.js");
const reportUtils = require("./utils/pixInternalTransactionReport.js");

starkinfra.user = require("./utils/user").exampleProject;


describe("TestPixInternalTransactionReportPost", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let reports = [];
        reports.push(reportUtils.generateExamplePixInternalTransactionReportRequest());
        reports = await starkinfra.pixInternalTransactionReport.create(reports);
        for (let report of reports) {
            assert(typeof report.id == "string");
            assert(report.status != null);
            assert(report.created != null);
            assert(report.updated != null);
        }
    });

    it("test_success_reversal", async () => {
        let reports = [];
        reports.push(reportUtils.generateExamplePixInternalTransactionReportReversal());
        reports = await starkinfra.pixInternalTransactionReport.create(reports);
        for (let report of reports) {
            assert(typeof report.id == "string");
            assert(report.referenceType === "reversal");
            assert(report.returnId != null);
        }
    });
});


describe("TestPixInternalTransactionReportGet", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let i = 0;
        const reports = await starkinfra.pixInternalTransactionReport.query({limit: 5});
        for await (let report of reports) {
            assert(typeof report.id == "string");
            i += 1;
        }
        assert(i === 5);
    });
});


describe("TestPixInternalTransactionReportInfoGet", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let reports = await starkinfra.pixInternalTransactionReport.query({limit: 3});
        for await (let report of reports) {
            assert(typeof report.id == "string");
            report = await starkinfra.pixInternalTransactionReport.get(report.id);
            assert(typeof report.id == "string");
        }
    });

    it("test_success_ids", async () => {
        let reports = await starkinfra.pixInternalTransactionReport.query({limit: 10});
        let reportsIdsExpected = [];
        for await (let report of reports) {
            reportsIdsExpected.push(report.id);
        }

        let reportsResult = await starkinfra.pixInternalTransactionReport.query({ids: reportsIdsExpected});
        let reportsIdsResult = [];
        for await (let report of reportsResult) {
            reportsIdsResult.push(report.id);
        }

        reportsIdsExpected.sort();
        reportsIdsResult.sort();
        assert(reportsIdsExpected.length === reportsIdsResult.length);
        for (let i = 0; i < reportsIdsExpected.length; i++) {
            assert(reportsIdsExpected[i] === reportsIdsResult[i]);
        }
    });
});


describe("TestPixInternalTransactionReportGetPage", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let [page, cursor] = await starkinfra.pixInternalTransactionReport.page({limit: 5});
        for (let entity of page) {
            assert(typeof entity.id == "string");
        }
        assert(page.length > 0);
        assert(cursor != null);
    });
});


describe("TestPixInternalTransactionReportQueryParams", function () {
    this.timeout(10000);
    it("test_success", async () => {
        const reports = await starkinfra.pixInternalTransactionReport.query({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "success",
            ids: ["1", "2"],
        });
        assert(reports.length === undefined);
    });
});


describe("TestPixInternalTransactionReportPageParams", function () {
    this.timeout(10000);
    it("test_success", async () => {
        let cursor = null;
        let reports = null;
        [reports, cursor] = await starkinfra.pixInternalTransactionReport.page({
            limit: 2,
            after: "2020-04-01",
            before: "2021-04-30",
            status: "success",
            ids: ["1", "2"],
        });
        assert(reports.length === 0);
    });
});
