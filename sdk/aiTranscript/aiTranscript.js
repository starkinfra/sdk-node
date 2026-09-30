const aiApi = require('../utils/aiApi.js');
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

const parse = aiApi.parserOf(AiTranscript);
const path = 'ai-transcript';
const key = 'transcript';

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
    return aiApi.createOne(parse, path, key, { audio: transcript.audio }, user);
};

exports.query = async function ({ user } = {}) {
    /**
     *
     * Retrieve AiTranscripts
     *
     * @description Receive a generator of AiTranscript objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiTranscript objects with updated attributes
     *
     */
    // this route is not paginated and takes no filters
    return aiApi.listAll(parse, path, 'transcripts', user);
};
