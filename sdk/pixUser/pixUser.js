const { key } = require('../../index.js');
const rest = require('../utils/rest.js');
const Resource = require('starkcore').Resource;


class PixUser extends Resource {
    /**
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
    return rest.getId(resource, id, user, {"keyId": keyId});
};
