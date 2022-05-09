const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class InfractionReport extends Resource {
    /**
     *
     * InfractionReport object
     *
     * @description Infraction reports are used to report transactions that are suspected of
     * fraud, to request a refund or to reverse a refund.
     * When you initialize a InfractionReport, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param referenceId [string]: endToEndId or returnId of the transaction being reported. ex: "E20018183202201201450u34sDGd19lz"
     * @param type [string]: type of infraction report. Options: "fraud", "reversal", "reversalChargeback"
     *
     * Parameters (optional):
     * @param description [string, default null]: description for any details that can help with the infraction investigation.
     * @param creditedBankCode [string, default null]: bankCode of the credited Pix participant in the reported transaction. ex: "20018183"
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the InfractionReport is created. ex: "5656565656565656"
     * @param agent [string]: Options: "reporter" if you created the InfractionReport, "reported" if you received the InfractionReport.
     * @param analysis [string]: analysis that led to the result.
     * @param bacenId [string]: central bank's unique UUID that identifies the infraction report.
     * @param debitedBankCode [string]: bankCode of the debited Pix participant in the reported transaction. ex: "20018183"
     * @param reportedBy [string]: agent that reported the InfractionReport. Options: "debited", "credited".
     * @param result [string]: result after the analysis of the InfractionReport by the receiving party. Options: "agreed", "disagreed"
     * @param status [string]: current InfractionReport status. Options: "created", "failed", "delivered", "closed", "canceled".
     * @param created [string]: creation datetime for the InfractionReport. ex: "2020-03-10 10:30:00.000"
     * @param updated [string]: latest update datetime for the InfractionReport. ex: "2020-03-10 10:30:00.000"
     *
     */
    constructor({
                    referenceId, type, id = null, description = null, creditedBankCode = null, agent = null,
                    analysis = null, bacenId = null, debitedBankCode = null, reportedBy = null,
                    result = null, status = null, created = null, updated = null
                }) {
        super(id);

        this.referenceId = referenceId;
        this.type = type;
        this.description = description;
        this.creditedBankCode = creditedBankCode;
        this.agent = agent;
        this.analysis = analysis;
        this.bacenId = bacenId;
        this.debitedBankCode = debitedBankCode;
        this.reportedBy = reportedBy;
        this.result = result;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.InfractionReport = InfractionReport;
let resource = {'class': exports.InfractionReport, 'name': 'InfractionReport'};

exports.create = async function (report, {user} = {}) {
    /**
     *
     * Create a InfractionReport object
     *
     * @description Create a InfractionReport in the Stark Infra API
     *
     * Parameters (required):
     * @param report [InfractionReport object]: InfractionReport object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns InfractionReport object with updated attributes.
     *
     */
    return rest.postSingle(resource, report, user);
};

exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a InfractionReport object
     *
     * @description Retrieve the InfractionReport object linked to your Workspace in the Stark Infra API using its id.
     *
     * Parameters (required):
     * @param id [string]: InfractionReport object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns InfractionReport object that corresponds to the given id.
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({ limit, after, before, status, ids, type, user } = {}) {
    /**
     *
     * Retrieve InfractionReports
     *
     * @description Receive a generator of InfractionReports objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: "created", "failed", "delivered", "closed", "canceled".
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param type [list of strings, default null]: filter for the type of retrieved InfractionReports. Options: "fraud", "reversal", "reversalChargeback"
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of InfractionReport objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
        type: type
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, status, ids, type, user } = {}) {
    /**
     *
     * Retrieve paged InfractionReports
     *
     * @description Receive a list of up to 100 InfractionReport objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param after [string, default null]: date filter for objects created after a specified date. ex: '2020-03-10'
     * @param before [string, default null]: date filter for objects created before a specified date. ex: '2020-03-10'
     * @param status [list of strings, default null]: filter for status of retrieved objects. Options: "created", "failed", "delivered", "closed", "canceled".
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ["5656565656565656", "4545454545454545"]
     * @param type [list of strings, default null]: filter for the type of retrieved InfractionReports. Options: "fraud", "reversal", "reversalChargeback"
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of InfractionReport objects with updated attributes and cursor to retrieve the next page of InfractionReport objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        status: status,
        ids: ids,
        type: type
    };
    return rest.getPage(resource, query, user);
};

exports.update = async function ( id, result, { analysis, user } = {}) {
    /**
     *
     * Update InfractionReport entity
     *
     * @description Update the InfractionReport information by its id.
     *
     * Parameters (required):
     * @param id [string]: InfractionReport id. ex: '5656565656565656'
     * @param result [string]: result after the analysis of the InfractionReport. Options: 'agreed', 'disagreed'
     *
     * Parameters (optional):
     * @param analysis [string, default null]: analysis that led to the result.
     *
     * Return:
     * @returns list of InfractionReport objects with updated attributes and cursor to retrieve the next page of InfractionReport objects
     *
     */
    let payload = {
        "result": result,
        "analysis": analysis,
    };
    return rest.patchId(resource, id, payload, user);
};

exports.delete = async function (id, {user} = {}) {
    /**
     *
     * Delete a InfractionReport entity
     *
     * @description Delete a InfractionReport entity previously created in the Stark Infra API
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns deleted InfractionReport object
     *
     */
    return rest.deleteId(resource, id, user);
};
