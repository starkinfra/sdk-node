const rest = require('./rest.js');


// The AI routes answer under keys starkcore cannot derive from the resource name (it reads the last word of
// the name, and 'speeches' is not 'speechs'), and some creates answer with a list, so the AI resources read
// the responses themselves through these helpers.

exports.parserOf = function (resource) {
    return json => Object.assign(new resource(json), json);
};

exports.dropNulls = function (payload) {
    // starkcore's removeNullKeys also walks into nested objects, which would rewrite the caller's
    // metadataSchema; only the top-level names belong to the SDK
    const kept = {};
    for (let [key, value] of Object.entries(payload)) {
        if (value !== undefined && value !== null) {
            kept[key] = value;
        }
    }
    return kept;
};

exports.createOne = async function (parse, path, key, payload, user, query = {}) {
    const response = await rest.postRaw(path, payload, null, true, user, query);
    return parse(response.json()[key]);
};

exports.getOne = async function (parse, path, key, id, user, query = {}) {
    // a leading slash would make the url /v2//path
    const response = await rest.getRaw(path + '/' + id, query, null, true, user);
    return parse(response.json()[key]);
};

exports.patchOne = async function (parse, path, key, id, payload, user) {
    const response = await rest.patchRaw(path + '/' + id, payload, null, true, user);
    return parse(response.json()[key]);
};

exports.listAll = async function (parse, path, key, user, query = {}) {
    const response = await rest.getRaw(path, query, null, true, user);
    return stream(parse, response.json()[key]);
};

exports.deleteMany = async function (parse, path, key, ids, user) {
    // the ids travel in the query string; the API takes no body on delete
    const response = await rest.deleteRaw(path, null, null, true, user, { ids: ids });
    return response.json()[key].map(parse);
};

async function* stream(parse, entities) {
    for (let entity of entities) {
        yield parse(entity);
    }
}
