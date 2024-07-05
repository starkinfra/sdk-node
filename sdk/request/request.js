const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const prefix = require('../../index.js').requestMethodsPrefix

exports.get = async function (path, query, {user} = {}) {
    /**
     *
     * Retrieve any starkinfra resource
     *
     * @description Receive a json of resources previously created in starkinfra's API
     *
     * Parameters (required):
     * @param path [string]: starkinfra resource's route. ex: "/pix-request/"
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     * @param query [object, default null]: Query parameters. ex: {"limit": 1, "status": paid} 
     *
     * Return:
     * @returns a list of starkinfra objects with updated attributes
     *
     */
    return rest.getRaw(path, query, prefix, true, user);
};

exports.post = async function (path, body, {user} = {}) {
    /**
     *
     * Retrieve any starkinfra resource
     *
     * @description Receive a json of resources previously created in starkinfra's API
     *
     * Parameters (required):
     * @param path [string]: starkinfra resource's route. ex: "/pix-request/"
     * @param body [object]: request parameters. ex: {"requests": [{"amount": 100, "name": "Iron Bank S.A.", "taxId": "20.018.183/0001-80"}]}
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns a list of starkinfra objects with updated attributes
     *
     */
    return rest.postRaw(path, body, prefix, true, user);
};

exports.patch = async function (path, body, {user} = {}) {
        /**
     *
     * Retrieve any starkinfra resource
     *
     * @description Receive a json of resources previously created in starkinfra's API
     *
     * Parameters (required):
     * @param path [string]: starkinfra resource's route. ex: "/pix-request/"
     * @param body [object]: request parameters. ex: {"request": [{"amount": 100, "name": "Iron Bank S.A.", "taxId": "20.018.183/0001-80"}]}
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns a list of starkinfra objects with updated attributes
     *
     */
    return rest.patchRaw(path, body, prefix, true, user);
};

exports.put = async function (path, body, {user} = {}) {
    /**
     *
     * Retrieve any starkinfra resource
     *
     * @description Receive a json of resources previously created in starkinfra's API
     *
     * Parameters (required):
     * @param path [string]: starkinfra resource's route. ex: "/pix-request/"
     * @param body [object]: request parameters. ex: {"amount": 100}
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns a list of starkinfra objects with updated attributes
     *
     */
    return rest.putRaw(path, body, prefix, true, user);
};

exports.delete = async function (path, body, {user} = {}) {
    /**
     *
     * Retrieve any starkinfra resource
     *
     * @description Receive a json of resources previously created in starkinfra's API
     *
     * Parameters (required):
     * @param path [string]: starkinfra resource's route. ex: "/pix-request/"
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns a list of starkinfra objects with updated attributes
     *
     */
    return rest.deleteRaw(path, body, prefix, true, user);
};
