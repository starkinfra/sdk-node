const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AiSpeech extends Resource {
    /**
     *
     * AiSpeech object
     *
     * @description An AiSpeech is one text read out loud by an AiVoice. The speech is synthesized when it is created
     * and comes back as a base64 MP3 in the audio attribute.
     * When you initialize an AiSpeech, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param voiceId [string]: id of the AiVoice that should read the text. Only a voice in 'success' can speak. ex: '5656565656565656'
     * @param text [string]: text to read out loud. Between 1 and 100000 characters. ex: 'Hello, how can I help you?'
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the AiSpeech is created. ex: '5656565656565656'
     * @param status [string]: current status of the speech. Options: 'processing', 'success', 'failed'
     * @param audio [string]: base64-encoded MP3 of the speech. Left out of query results; get returns it.
     * @param voiceName [string]: name of the voice. Only present when requested with expand: ['voiceName'].
     * @param errors [list of strings]: reasons the synthesis failed. Empty when it worked.
     * @param created [string]: creation datetime for the AiSpeech. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the AiSpeech. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    voiceId, text, id = null, status = null, audio = null, voiceName = null, errors = null,
                    created = null, updated = null
                }) {
        super(id);

        this.voiceId = voiceId;
        this.text = text;
        this.status = status;
        this.audio = audio;
        this.voiceName = voiceName;
        this.errors = errors;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.AiSpeech = AiSpeech;
const resource = {'class': AiSpeech, 'name': 'AiSpeech'};

exports.create = async function (speech, { user } = {}) {
    /**
     *
     * Create an AiSpeech
     *
     * @description Send an AiSpeech object for creation at the Stark Infra API. The audio is synthesized during the call.
     *
     * Parameters (required):
     * @param speech [AiSpeech object]: AiSpeech object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiSpeech object with updated attributes.
     *
     */
    return rest.postSingle(resource, speech, user);
};

exports.get = async function (id, { expand, user } = {}) {
    /**
     *
     * Retrieve a specific AiSpeech
     *
     * @description Receive a single AiSpeech object previously created in the Stark Infra API by its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'voiceName'.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiSpeech object with updated attributes.
     *
     */
    return rest.getId(resource, id, user, { expand: expand });
};

exports.query = async function ({ expand, limit, user } = {}) {
    /**
     *
     * Retrieve AiSpeeches
     *
     * @description Receive a generator of AiSpeech objects previously created in the Stark Infra API. The audio is left out of the results.
     *
     * Parameters (optional):
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'voiceName'.
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiSpeech objects with updated attributes
     *
     */
    return rest.getList(resource, { expand: expand, limit: limit }, user);
};

exports.page = async function ({ cursor, limit, expand, user } = {}) {
    /**
     *
     * Retrieve paged AiSpeeches
     *
     * @description Receive a list of up to 100 AiSpeech objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call.
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max 100. ex: 35
     * @param expand [list of strings, default null]: extra attributes to compute. Options: 'voiceName'.
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of AiSpeech objects with updated attributes and cursor to retrieve the next page of AiSpeech objects
     *
     */
    return rest.getPage(resource, { cursor: cursor, limit: limit, expand: expand }, user);
};
