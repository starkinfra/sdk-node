const rest = require('../utils/rest.js');
const api = require('starkcore').api;
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AiChat extends Resource {
    /**
     *
     * AiChat object
     *
     * @description An AiChat is one conversation thread with an AiAgent and holds the history. Each turn is an AiMessage.
     * When you initialize an AiChat, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param agentId [string]: id of the AiAgent that will answer in this chat. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param title [string, default null]: title of the conversation. Up to 100 characters. When omitted, the first message posted to the chat generates one.
     * @param tags [list of strings, default null]: list of up to 100 strings, each up to 100 characters and stored in lowercase, to find the chat later. ex: ['customer-123', 'whatsapp']
     * @param context [object, default null]: data about the person on the other side of the chat that the agent reads before every reply. Up to 16384 bytes, treated as reference data and never as instructions. Keys whose value is null are left out. ex: {name: 'Ana', balance: 1520.33}
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the AiChat is created. ex: '5656565656565656'
     * @param agentName [string]: name of the agent. Only present when requested with expand: ['agentName'].
     * @param updated [string]: latest update datetime for the AiChat. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ agentId, title = null, tags = null, context = null, id = null, agentName = null, updated = null }) {
        super(id);

        this.agentId = agentId;
        this.title = title;
        this.tags = tags;
        this.context = context;
        this.agentName = agentName;
        this.updated = check.datetime(updated);
    }
}

exports.AiChat = AiChat;
const resource = {'class': AiChat, 'name': 'AiChat'};

exports.create = async function (chat, { user } = {}) {
    /**
     *
     * Create an AiChat
     *
     * @description Send an AiChat object for creation at the Stark Infra API
     *
     * Parameters (required):
     * @param chat [AiChat object]: AiChat object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiChat object with updated attributes.
     *
     */
    return rest.postSingle(resource, chat, user);
};

exports.get = async function (id, { expand, user } = {}) {
    /**
     *
     * Retrieve a specific AiChat
     *
     * @description Receive a single AiChat object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'agentName'.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiChat object with updated attributes.
     *
     */
    return rest.getId(resource, id, user, { expand: expand });
};

exports.query = async function ({ expand, tags, limit, user } = {}) {
    /**
     *
     * Retrieve AiChats
     *
     * @description Receive a generator of AiChat objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'agentName'.
     * @param tags [list of strings, default null]: up to 30 tags. Retrieves the chats that have any of them. ex: ['customer-123']
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiChat objects with updated attributes
     *
     */
    return rest.getList(resource, { expand: expand, tags: tags, limit: limit }, user);
};

exports.update = async function (id, { title, agentId, tags, context, user } = {}) {
    /**
     *
     * Update AiChat entity
     *
     * @description Update an AiChat's parameters by passing its id. Only the parameters you give are changed.
     *
     * Parameters (required):
     * @param id [string]: AiChat unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param title [string, default null]: new title for the conversation. Up to 100 characters.
     * @param agentId [string, default null]: id of the AiAgent that should answer from now on.
     * @param tags [list of strings, default null]: new list of up to 100 strings. Replaces the current list as a whole; an empty list removes them.
     * @param context [object, default null]: new data about the person on the other side of the chat. Replaces the current object as a whole and is used from the next message on; an empty object removes it. Keys whose value is null are left out.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiChat with updated attributes
     *
     */
    return rest.patchId(resource, id, new exports.AiChat({ title, agentId, tags, context }), user);
};

exports.delete = async function (ids, { user } = {}) {
    /**
     *
     * Delete AiChats
     *
     * @description Delete up to 100 AiChats at once, with their messages.
     *
     * Parameters (required):
     * @param ids [list of strings]: ids of the AiChats to be deleted. Up to 100 ids. ex: ['5656565656565656', '4545454545454545']
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of deleted AiChat objects
     *
     */
    let response = await rest.deleteRaw(api.endpoint(resource.name), null, null, true, user, { ids: ids });
    let json = response.json();
    let entities = json[api.lastNamePlural(resource.name)];
    return entities.map(entity => Object.assign(new exports.AiChat(entity), entity));
};
