const { key } = require('../../index.js');
const rest = require('../utils/rest.js');
const Resource = require('starkcore').Resource;


class PixUser extends Resource {
    /**
     *
     * PixUser object
     *
     * @description PixUser holds aggregated DICT statistics for a tax ID.
     *
     * Parameters (return-only):
     * @param id [string]: tax ID (CPF/CNPJ) queried.
     * @param statistics [list of objects]: {value, type, source, after, updated} entries; type depends on source ('registered'/'unique' for pix-key, 'settled' for pix-request, 'identity'/'mule'/'scam'/'other'/'unknown'/'amount'/'unique' for pix-fraud, 'open'/'denied'/'unique' for pix-infraction); source Options: 'pix-key', 'pix-fraud', 'pix-request', 'pix-infraction'.
     *
     * Check out our API Documentation at https://starkinfra.com/docs/api#pix-user
     */
    constructor({ 
                    id, statistics = null
                }) {
        super(id);
        this.statistics = statistics;
    }
}

exports.PixUser = PixUser;
let resource = {'class': exports.PixUser, 'name': 'PixUser'};

exports.get = async function (id, keyId = null, { user } = {}) {
    /**
     *
     * Retrieve a PixUser object
     *
     * @description Retrieve a PixUser's aggregated Pix statistics by tax ID.
     *
     * Parameters (required):
     * @param id [string]: CPF or CNPJ of the user to query.
     *
     * Parameters (optional):
     * @param keyId [string, default null]: Pix key to scope the statistics to; when provided, returns key statistics instead of owner statistics.
     *
     * Return:
     * @returns PixUser object with updated attributes
     *
     */
    return rest.getId(resource, id, user, {"keyId": keyId});
};
