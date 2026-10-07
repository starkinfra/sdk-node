const rest = require('../utils/rest.js');
const api = require('starkcore').api;
const AiKnowledgeBase = require('../aiKnowledgeBase/aiKnowledgeBase.js').AiKnowledgeBase;
const knowledgeBaseResource = require('../aiKnowledgeBase/aiKnowledgeBase.js').resource;
const {parseObjects} = require('../utils/parse.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AiAgent extends Resource {
    /**
     *
     * AiAgent object
     *
     * @description An AiAgent is the configuration of an assistant: the model, the instructions, the knowledge it may
     * consult and the voice it speaks with. The agent never changes during a conversation; the conversation lives in
     * an AiChat and each turn is an AiMessage.
     * When you initialize an AiAgent, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param name [string]: name of the agent. Between 1 and 100 characters. ex: 'Support assistant'
     * @param model [string]: AI model the agent runs on. Options: 'bender-1.0' for everyday conversations, 'prime-1.0' for harder reasoning.
     *
     * Parameters (optional):
     * @param systemPrompt [string, default null]: instructions that define the agent's persona, tone and domain behavior. Up to 100000 characters. The API falls back to its default assistant prompt when omitted.
     * @param voiceId [string, default null]: id of the AiVoice the agent speaks with. When set, every reply also carries a speech string ready to be sent to AiSpeech. The API does not check that the voice exists. Leave it out, or send an empty string, for a text-only agent.
     * @param knowledgeBaseIds [list of strings, default null]: ids of up to 100 AiKnowledgeBases the agent retrieves from before answering. The API does not check that they exist.
     * @param metadataSchema [object, default null]: flat object whose keys are the fields the agent must extract on every reply. Each field takes a 'type' (string, integer, number, boolean or array), an optional 'description' of up to 2000 characters, an optional 'enum' of up to 20 strings for string fields. The keys are yours and are sent exactly as written; keys whose value is null are left out. ex: {order_id: {type: 'string', description: 'Order the customer mentions'}}
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the AiAgent is created. ex: '5656565656565656'
     * @param knowledgeBases [list of AiKnowledgeBase objects]: the knowledge bases themselves. Only present when requested with expand: ['knowledgeBases'].
     * @param created [string]: creation datetime for the AiAgent. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the AiAgent. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    name, model, systemPrompt = null, voiceId = null, knowledgeBaseIds = null, metadataSchema = null,
                    id = null, knowledgeBases = null, created = null, updated = null
                }) {
        super(id);

        this.name = name;
        this.model = model;
        this.systemPrompt = systemPrompt;
        this.voiceId = voiceId;
        this.knowledgeBaseIds = knowledgeBaseIds;
        this.metadataSchema = metadataSchema;
        this.knowledgeBases = parseObjects(knowledgeBases, knowledgeBaseResource, AiKnowledgeBase);
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.AiAgent = AiAgent;
let resource = {'class': exports.AiAgent, 'name': 'AiAgent'};

exports.create = async function (agent, { user } = {}) {
    /**
     *
     * Create an AiAgent
     *
     * @description Send an AiAgent object for creation at the Stark Infra API. Attributes that are null are not sent.
     *
     * Parameters (required):
     * @param agent [AiAgent object]: AiAgent object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiAgent object with updated attributes.
     *
     */
    return rest.postSingle(resource, agent, user);
};

exports.get = async function (id, { expand, user } = {}) {
    /**
     *
     * Retrieve a specific AiAgent
     *
     * @description Receive a single AiAgent object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'knowledgeBases'.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiAgent object with updated attributes.
     *
     */
    return rest.getId(resource, id, user, { expand: expand });
};

exports.query = async function ({ expand, limit, user } = {}) {
    /**
     *
     * Retrieve AiAgents
     *
     * @description Receive a generator of AiAgent objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'knowledgeBases'.
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiAgent objects with updated attributes
     *
     */
    return rest.getList(resource, { expand: expand, limit: limit }, user);
};

exports.update = async function (id, { name, model, systemPrompt, voiceId, knowledgeBaseIds, metadataSchema, user } = {}) {
    /**
     *
     * Update AiAgent entity
     *
     * @description Update an AiAgent's parameters by passing its id. Only the parameters you give are changed.
     * knowledgeBaseIds replaces the current list: leave it out to keep the list, or pass an empty list to detach every knowledge base.
     *
     * Parameters (required):
     * @param id [string]: AiAgent unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param name [string, default null]: new name for the agent. Between 1 and 100 characters.
     * @param model [string, default null]: new AI model. Options: 'bender-1.0', 'prime-1.0'
     * @param systemPrompt [string, default null]: new instructions for the agent. Up to 100000 characters. Send an empty string to remove them.
     * @param voiceId [string, default null]: new AiVoice id. Send an empty string to make the agent text-only.
     * @param knowledgeBaseIds [list of strings, default null]: the AiKnowledgeBase ids the agent should end up with. Replaces the current list. Leave it out to keep the list, or pass an empty list to detach every knowledge base.
     * @param metadataSchema [object, default null]: new schema of the structured data the agent must extract.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiAgent with updated attributes
     *
     */
    const agent = new exports.AiAgent({
        name: name,
        model: model,
        systemPrompt: systemPrompt,
        voiceId: voiceId,
        knowledgeBaseIds: knowledgeBaseIds,
        metadataSchema: metadataSchema
    });
    return rest.patchId(resource, id, agent, user);
};

exports.delete = async function (ids, { user } = {}) {
    /**
     *
     * Delete AiAgents
     *
     * @description Delete up to 100 AiAgents at once.
     *
     * Parameters (required):
     * @param ids [list of strings]: ids of the AiAgents to be deleted. Up to 100 ids. ex: ['5656565656565656', '4545454545454545']
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of deleted AiAgent objects
     *
     */
    let response = await rest.deleteRaw(api.endpoint(resource.name), null, null, true, user, { ids: ids });
    let json = response.json();
    let entities = json[api.lastNamePlural(resource.name)];
    return entities.map(entity => Object.assign(new exports.AiAgent(entity), entity));
};
