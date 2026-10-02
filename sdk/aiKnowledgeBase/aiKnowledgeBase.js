const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const api = require('starkcore').api;
const Resource = require('starkcore').Resource;


class AiKnowledgeBase extends Resource {
    /**
     *
     * AiKnowledgeBase object
     *
     * @description An AiKnowledgeBase turns a website into material an AiAgent can read. You give it a root URL;
     * Stark Infra crawls the page, follows its links, converts everything to Markdown and indexes it for retrieval.
     * When you initialize an AiKnowledgeBase, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param name [string]: name of the knowledge base. Between 1 and 100 characters. ex: 'Product Documentation'
     * @param rootUrl [string]: absolute http or https URL the crawl starts from. ex: 'https://docs.starkinfra.com'
     *
     * Parameters (optional):
     * @param isRecursive [bool, default null]: whether the crawl may follow links into other subdomains of the root URL's registered domain. The API defaults to true. ex: false
     * @param tags [list of strings, default null]: list of up to 100 strings for reference when searching for AiKnowledgeBases. ex: ['support', 'public']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the AiKnowledgeBase is created. ex: '5656565656565656'
     * @param status [string]: current status of the knowledge base. Options: 'processing', 'success', 'failed'. An agent retrieves from a base only once it reaches 'success'.
     * @param created [string]: creation datetime for the AiKnowledgeBase. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the AiKnowledgeBase. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    name, rootUrl, isRecursive = null, tags = null, id = null, status = null, created = null,
                    updated = null
                }) {
        super(id);

        this.name = name;
        this.rootUrl = rootUrl;
        this.isRecursive = isRecursive;
        this.tags = tags;
        this.status = status;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.AiKnowledgeBase = AiKnowledgeBase;

const path = 'ai-knowledge-base';

function parse(json) {
    return Object.assign(new AiKnowledgeBase(json), json);
}

function payloadOf(attributes) {
    const payload = Object.assign({}, attributes);
    api.removeNullKeys(payload);
    return payload;
}

async function* stream(entities) {
    for (let entity of entities) {
        yield parse(entity);
    }
}

exports.create = async function (knowledgeBase, { user } = {}) {
    /**
     *
     * Create an AiKnowledgeBase object
     *
     * @description Send an AiKnowledgeBase object for creation at the Stark Infra API and start crawling it.
     * The call returns immediately with the knowledge base in 'processing' status.
     *
     * Parameters (required):
     * @param knowledgeBase [AiKnowledgeBase object]: AiKnowledgeBase object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiKnowledgeBase object with updated attributes.
     *
     */
    const payload = payloadOf({
        name: knowledgeBase.name,
        rootUrl: knowledgeBase.rootUrl,
        isRecursive: knowledgeBase.isRecursive,
        tags: knowledgeBase.tags
    });
    const response = await rest.postRaw(path, payload, null, true, user);
    return parse(response.json().knowledgeBase);
};

exports.get = async function (id, { user } = {}) {
    /**
     *
     * Retrieve a specific AiKnowledgeBase
     *
     * @description Receive a single AiKnowledgeBase object previously created in the Stark Infra API by its id.
     * This is the call to poll while the crawl runs.
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiKnowledgeBase object with updated attributes.
     *
     */
    const response = await rest.getRaw(path + '/' + id, {}, null, true, user);
    return parse(response.json().knowledgeBase);
};

exports.query = async function ({ ids, name, status, user } = {}) {
    /**
     *
     * Retrieve AiKnowledgeBases
     *
     * @description Receive a generator of AiKnowledgeBase objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param ids [list of strings, default null]: list of ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param name [string, default null]: case-insensitive substring of the name to filter retrieved objects. ex: 'docs'
     * @param status [string, default null]: filter for status of retrieved objects. Options: 'processing', 'success', 'failed'
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiKnowledgeBase objects with updated attributes
     *
     */
    const response = await rest.getRaw(path, { ids: ids, name: name, status: status }, null, true, user);
    return stream(response.json().knowledgeBases);
};

exports.update = async function (id, { name, isRecursive, tags, user } = {}) {
    /**
     *
     * Update AiKnowledgeBase entity
     *
     * @description Rename a knowledge base, retag it or change whether its crawl is recursive. The root URL cannot be changed.
     *
     * Parameters (required):
     * @param id [string]: AiKnowledgeBase unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param name [string, default null]: new name of the knowledge base. Between 1 and 100 characters.
     * @param isRecursive [bool, default null]: whether the next crawl may follow links into other subdomains of the root URL's registered domain.
     * @param tags [list of strings, default null]: new list of up to 100 strings. Replaces the current list.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiKnowledgeBase with updated attributes
     *
     */
    const payload = payloadOf({ name: name, isRecursive: isRecursive, tags: tags });
    const response = await rest.patchRaw(path + '/' + id, payload, null, true, user);
    return parse(response.json().knowledgeBase);
};

exports.hosts = async function (id, { user } = {}) {
    /**
     *
     * List the pages of an AiKnowledgeBase
     *
     * @description Receive every page the crawler has seen, grouped by host. While a crawl is running this is the live picture,
     * merged with the last finished one.
     *
     * Parameters (required):
     * @param id [string]: AiKnowledgeBase unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns object mapping each host to its list of pages. Each page has originalUrl, storageUrl and status ('pending', 'success' or 'failed')
     *
     */
    const response = await rest.getRaw(path + '/' + id + '/hosts', {}, null, true, user);
    return response.json().hosts;
};

exports.delete = async function (ids, { user } = {}) {
    /**
     *
     * Delete AiKnowledgeBases
     *
     * @description Delete up to 100 AiKnowledgeBases at once. Agents still referencing a deleted base simply retrieve nothing from it.
     *
     * Parameters (required):
     * @param ids [list of strings]: ids of the AiKnowledgeBases to be deleted. Up to 100 ids. ex: ['5656565656565656', '4545454545454545']
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of deleted AiKnowledgeBase objects
     *
     */
    const response = await rest.deleteRaw(path, null, null, true, user, { ids: ids });
    return response.json().knowledgeBases.map(parse);
};
