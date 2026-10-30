const check = require('starkcore').check;
const SubResource = require('starkcore').SubResource;

class Statistics extends SubResource {
    /**
     * PixUser.Statistics object
     *
     * The PixUser.Statistics object stores fraud statistics data of a Pix user.
     *
     * Attributes (return-only):
     * @param value [integer]: aggregated value of the statistic. ex: 3
     * @param type [string]: type of the statistic; the valid values depend on the source. Options: "registered", "unique" (pix-key); "settled" (pix-request); "identity", "mule", "scam", "other", "unknown", "amount", "unique" (pix-fraud); "open", "denied", "unique" (pix-infraction). ex: "registered"
     * @param source [string]: source of the statistic. Options: "pix-key", "pix-fraud", "pix-request", "pix-infraction". ex: "pix-key"
     * @param after [string]: start datetime considered for the statistic aggregation, in ISO format. ex: "2020-04-23T23:00:00.000000+00:00"
     * @param updated [string]: latest update datetime for the statistic, in ISO format. ex: "2020-04-23T23:00:00.000000+00:00"
     */
    constructor({ value = null, type = null, source = null, after = null, updated = null }) {
        super();
        this.value = value;
        this.type = type;
        this.source = source;
        this.after = check.datetime(after);
        this.updated = check.datetime(updated);
    }
}

exports.Statistics = Statistics;
exports.subResource = {'class': exports.Statistics, 'name': 'Statistics'};
