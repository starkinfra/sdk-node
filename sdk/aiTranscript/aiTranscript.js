const rest = require('../utils/rest.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AiTranscript extends Resource {
    /**
     *
     * AiTranscript object
     *
     * @description An AiTranscript is the text of an audio file you upload, from any speaker, cloned or not.
     * When you initialize an AiTranscript, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param audio [string]: base64-encoded audio to transcribe. Up to 10000000 characters. The format is read from the file's own header.
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the AiTranscript is created. ex: '5656565656565656'
     * @param text [string]: transcribed text.
     * @param status [string]: current status of the transcript. Options: 'processing', 'success', 'failed'
     * @param errors [list of strings]: reasons the transcription failed. Empty when it worked.
     * @param created [string]: creation datetime for the AiTranscript. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the AiTranscript. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    audio = null, id = null, text = null, status = null, errors = null, created = null,
                    updated = null
                } = {}) {
        super(id);

        this.audio = audio;
        this.text = text;
        this.status = status;
        this.errors = errors;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.AiTranscript = AiTranscript;
const resource = {'class': AiTranscript, 'name': 'AiTranscript'};

exports.create = async function (transcript, { user } = {}) {
    /**
     *
     * Create an AiTranscript
     *
     * @description Send an AiTranscript object for creation at the Stark Infra API. The audio is transcribed during the call.
     *
     * Parameters (required):
     * @param transcript [AiTranscript object]: AiTranscript object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiTranscript object with updated attributes.
     *
     */
    return rest.postSingle(resource, transcript, user);
};

exports.query = async function ({ limit, user } = {}) {
    /**
     *
     * Retrieve AiTranscripts
     *
     * @description Receive a generator of AiTranscript objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiTranscript objects with updated attributes
     *
     */
    return rest.getList(resource, { limit: limit }, user);
};

exports.page = async function ({ cursor, limit, user } = {}) {
    /**
     *
     * Retrieve paged AiTranscripts
     *
     * @description Receive a list of up to 100 AiTranscript objects previously created in the Stark Infra API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call.
     * @param limit [integer, default 100]: maximum number of objects to be retrieved. Max 100. ex: 35
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of AiTranscript objects with updated attributes and cursor to retrieve the next page of AiTranscript objects
     *
     */
    return rest.getPage(resource, { cursor: cursor, limit: limit }, user);
};
