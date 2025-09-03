const starkHost = require('starkcore').starkHost;
const rest = require('starkcore').rest;
const starkInfra = require('../../index')

const apiVersion = starkInfra.apiVersion
const sdkVersion = starkInfra.version
const host = starkHost.infra;
const timeout = starkInfra.timeout

exports.getList = async function* (resource, query, user = starkInfra.user) {
    yield* rest.getList(
        sdkVersion,
        host,
        apiVersion,
        resource,
        user,
        language = starkInfra.language,
        timeout,
        query
    );
};

exports.post = async function (resource, entities, user = starkInfra.user, { ...query } = {}) {
    return rest.post( 
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        entities,
        language = starkInfra.language,
        timeout,
        query
    );
};

exports.getId = async function (resource, id, user = starkInfra.user, { ...query } = {}) {
    return rest.getId(
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        id,
        language = starkInfra.language,
        timeout,
        query
    );
};

exports.getPublicKey = async function (user = starkInfra.user) {
    return rest.getPublicKey(
        sdkVersion,
        host,
        apiVersion,
        user,
        language = starkInfra.language,
        timeout
    );
};

exports.getContent = async function (resource, id, user = starkInfra.user, query = {}, subResource){
    return rest.getContent(
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        id,
        subResource,
        language = starkInfra.language,
        timeout,
        query
    );
};

exports.deleteId = async function (resource, id, user = starkInfra.user) {
    return rest.deleteId(
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        id,
        language = starkInfra.language,
        timeout,
    );
};

exports.postSingle = async function (resource, query, user = starkInfra.user) {
    return rest.postSingle(
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        language = starkInfra.language,
        timeout,
        query
    );
};

exports.patchId = async function (resource, id, payload, user = starkInfra.user) {
    return rest.patchId(
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        id,
        payload,
        language = starkInfra.language,
        timeout
    );
};

exports.getSubResource = async function (resource, id, subResource, user = starkInfra.user ) {
    return rest.getSubResource(
        sdkVersion,
        host,
        apiVersion,
        user,
        resource,
        id,
        subResource,
        language = starkInfra.language,
        timeout
    );
};

exports.getPage = async function (resource, query = {}, user = starkInfra.user ) {
    return rest.getPage(
        sdkVersion,
        host,
        apiVersion,
        resource,
        user,
        language = starkInfra.language,
        timeout,
        query
    );
};

exports.postRaw = async function (path, payload, prefix = null, throwError = true, user = starkInfra.user, { ...query } = {}) {
    return rest.postRaw(
        sdkVersion,
        host,
        apiVersion,
        path,
        payload,
        user,
        language = starkInfra.language,
        timeout,
        query,
        prefix,
        throwError
    );
};

exports.getRaw = async function (path, query = {}, prefix = null, throwError = true, user = starkInfra.user ) {
    return rest.getRaw(
        sdkVersion,
        host,
        apiVersion,
        path,
        user,
        language = starkInfra.language,
        timeout,
        query,
        prefix,
        throwError
    )
}

exports.patchRaw = async function (path, payload, prefix = null, throwError = true, user = starkInfra.user, { ...query } = {}) {
    return rest.patchRaw(
        sdkVersion,
        host,
        apiVersion,
        path,
        payload,
        user,
        language = starkInfra.language,
        timeout,
        query,
        prefix,
        throwError
    );
};

exports.putRaw = async function (path, payload, prefix = null, throwError = true, user = starkInfra.user, { ...query } = {}) {
    return rest.putRaw(
        sdkVersion,
        host,
        apiVersion,
        path,
        payload,
        user,
        language = starkInfra.language,
        timeout,
        query,
        prefix,
        throwError
    );
};

exports.deleteRaw = async function (path, payload, prefix = null, throwError = true, user = starkInfra.user, { ...query } = {}) {
    return rest.deleteRaw(
        sdkVersion,
        host,
        apiVersion,
        path,
        payload,
        user,
        language = starkInfra.language,
        timeout,
        query,
        prefix,
        throwError
    );
};
