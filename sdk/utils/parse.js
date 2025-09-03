const parse = require('starkcore').parse;
const starkInfra = require('../../index.js');
const starkHost = require('starkcore').starkHost;

const apiVersion = starkInfra.apiVersion
const sdkVersion = starkInfra.version
const host = starkHost.infra;
const timeout = starkInfra.timeout

exports.parseObjects = function (objects, resource, resourceClass) {
    return parse.parseObjects (
        objects,
        resource,
        resourceClass
    );
}

exports.parseAndVerify = async function (resource, content, signature, user = starkInfra.user) {
    return parse.parseAndVerify (
        resource,
        content,
        signature,
        sdkVersion,
        apiVersion,
        host,
        user,
        language = starkInfra.language,
        timeout
    );
}

exports.verify = async function (content, signature, user = starkInfra.user) {
    return parse.verify (
        content,
        signature,
        sdkVersion,
        apiVersion,
        host,
        user,
        language = starkInfra.language,
        timeout
    );
}
