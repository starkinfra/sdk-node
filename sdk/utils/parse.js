const starkinfra = require('../../index.js');
const Ellipticcurve = require('starkbank-ecdsa');
const rest = require('../utils/rest.js');
const error = require('../error.js');
const api = require('./api');


exports.parseObjects = function (objects, resource, resourceClass) {
    if (objects == null)
        return null;

    let parsedObjects = [];
    for (let object of objects) {
        if (object instanceof resourceClass) {
            parsedObjects.push(object);
            continue;
        }
        object = Object.assign(new resource['class'](object), object);
        parsedObjects.push(object);
    }
    return parsedObjects;
}

exports.parseAndVerify = async function (resource, content, signature, user = null) {

    let object = Object.assign(new resource['class'](api.lastName(resource['name'])), JSON.parse(content))
    if (resource['name'] === 'Event'){
        object = Object.assign(new resource['class'](), JSON.parse(content)['event']);
    }

    try {
        signature = Ellipticcurve.Signature.fromBase64(signature);
    } catch (e) {
        throw new error.InvalidSignatureError('The provided signature is not valid');
    }

    if (await verifySignature(content, signature, user)) {
        return object;
    }
    if (await verifySignature(content, signature, user, true)) {
        return object;
    }
    throw new error.InvalidSignatureError('Provided signature and content do not match Stark public key');
}

async function verifySignature(content, signature, user = null, refresh = false) {
    let publicKey = starkinfra.cache['stark-public-key'];
    if (!publicKey || refresh) {
        let pem = await rest.getPublicKey(user);
        publicKey = Ellipticcurve.PublicKey.fromPem(pem);
        starkinfra.cache['stark-public-key'] = publicKey;
    }
    return Ellipticcurve.Ecdsa.verify(content, signature, publicKey);
}
