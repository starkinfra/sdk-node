const rest = require('../utils/rest.js');
const aiApi = require('../utils/aiApi.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AiMessage extends Resource {
    /**
     *
     * AiMessage object
     *
     * @description An AiMessage is a single turn of an AiChat. You post what the user said and the same call returns
     * the user's message and the agent's answer.
     * When you initialize an AiMessage, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the user's message and the agent's answer.
     *
     * Parameters (required):
     * @param chatId [string]: id of the AiChat to post to. ex: '5656565656565656'
     * @param text [string]: content of the user's message. Between 1 and 50000 characters. ex: 'What is the status of my order?'
     *
     * Parameters (optional):
     * @param model [string, default null]: AI model to use for this turn only. Options: 'bender-1.0', 'prime-1.0'. The API defaults to the agent's own model.
     *
     * Attributes (return-only):
     * @param id [string]: unique id of the AiMessage. ex: '5656565656565656'
     * @param sender [string]: who wrote the message. Options: 'user', 'system'. The agent's answers are sent by 'system'.
     * @param speech [string]: version of the text written to be heard rather than read, ready to be sent to AiSpeech. Only filled when the agent has a voice.
     * @param metadata [object]: structured data the agent extracted, shaped by the agent's metadataSchema. The keys are the agent's, exactly as it declared them.
     * @param chatName [string]: title of the chat. Only present when create is called with expand: ['chatName'].
     * @param created [string]: creation datetime for the AiMessage. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    chatId, text, model = null, id = null, sender = null, speech = null, metadata = null,
                    chatName = null, created = null
                }) {
        super(id);

        this.chatId = chatId;
        this.text = text;
        this.model = model;
        this.sender = sender;
        this.speech = speech;
        this.metadata = metadata;
        this.chatName = chatName;
        this.created = check.datetime(created);
    }
}

exports.AiMessage = AiMessage;

const parse = aiApi.parserOf(AiMessage);
const path = 'ai-message';

exports.create = async function (message, { expand, user } = {}) {
    /**
     *
     * Create an AiMessage
     *
     * @description Post the user's message to an AiChat. The call waits for the agent, which takes a few seconds,
     * and returns both messages.
     *
     * Parameters (required):
     * @param message [AiMessage object]: AiMessage object with chatId and text, to be created in the API.
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'chatName', which returns the chat title on every message, useful on the first turn, when the title is generated.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list with the user's AiMessage and the agent's AiMessage
     *
     */
    const payload = aiApi.dropNulls({ chatId: message.chatId, text: message.text, model: message.model });
    const response = await rest.postRaw(path, payload, null, true, user, { expand: expand });
    const content = response.json();
    return content.messages.map(entity => {
        const created = parse(entity);
        created.chatName = content.chatName === undefined ? null : content.chatName;
        return created;
    });
};

exports.query = async function (chatId, { limit, user } = {}) {
    /**
     *
     * Retrieve AiMessages
     *
     * @description Receive a generator of the AiMessage objects of an AiChat, following the cursor until the history ends.
     *
     * Parameters (required):
     * @param chatId [string]: id of the AiChat whose messages you want. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiMessage objects with updated attributes
     *
     */
    return stream(chatId, limit, user);
};

exports.page = async function (chatId, { cursor, limit, user } = {}) {
    /**
     *
     * Retrieve paged AiMessages
     *
     * @description Receive a list of up to 100 AiMessage objects of an AiChat and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (required):
     * @param chatId [string]: id of the AiChat whose messages you want. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max = 100. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of AiMessage objects with updated attributes and cursor to retrieve the next page of AiMessage objects
     *
     */
    if (!chatId) {
        throw new Error('chatId is required to retrieve AiMessages');
    }
    const response = await rest.getRaw(path, { chatId: chatId, limit: limit, cursor: cursor }, null, true, user);
    const content = response.json();
    return [content.messages.map(parse), content.cursor];
};

async function* stream(chatId, limit, user) {
    let cursor = null;
    let remaining = limit;
    do {
        const pageSize = remaining === undefined || remaining === null ? 100 : Math.min(100, remaining);
        const [messages, nextCursor] = await exports.page(chatId, { cursor: cursor, limit: pageSize, user: user });
        for (let message of messages) {
            yield message;
        }
        cursor = nextCursor;
        if (remaining) {
            remaining -= messages.length;
        }
    } while (cursor && !(limit && remaining <= 0));
}
