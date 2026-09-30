const aiApi = require('../utils/aiApi.js');
const check = require('starkcore').check;
const Resource = require('starkcore').Resource;


class AiVoice extends Resource {
    /**
     *
     * AiVoice object
     *
     * @description An AiVoice is a voice cloned from a recording you upload. Once cloned, it can read any text out loud
     * through an AiSpeech, and it can be attached to an AiAgent so every reply carries a speech ready to be synthesized.
     * Cloning is asynchronous: the voice is created in 'processing' status and moves to 'success' when it is ready
     * to speak, or to 'failed' when the recording could not be cloned.
     * When you initialize an AiVoice, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the object
     * to the Stark Infra API and returns the created object.
     *
     * Parameters (required):
     * @param audio [string]: base64-encoded recording of the speaker. MP3, WAV, OGG, FLAC and WebM are accepted. Up to 10000000 characters.
     *
     * Parameters (optional):
     * @param name [string, default null]: name of the voice. Up to 100 characters. Defaults to the voice's own id. ex: 'Helena'
     * @param description [string, default null]: free-text description of the voice. Up to 1000 characters.
     * @param language [string, default null]: language the voice speaks. Options: 'portuguese', 'english'. The API defaults to 'portuguese'.
     * @param gender [string, default null]: gender of the voice. Options: 'male', 'female', 'neutral'
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the AiVoice is created. This is the voiceId you send to other AI resources. ex: '5656565656565656'
     * @param status [string]: current status of the voice. Options: 'processing', 'success', 'failed'. Only a voice in 'success' can speak.
     * @param errors [list of strings]: reasons the cloning failed. Empty while the voice is healthy.
     * @param created [string]: creation datetime for the AiVoice. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the AiVoice. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
                    audio = null, name = null, description = null, language = null, gender = null, id = null,
                    status = null, errors = null, created = null, updated = null
                } = {}) {
        super(id);

        this.audio = audio;
        this.name = name;
        this.description = description;
        this.language = language;
        this.gender = gender;
        this.status = status;
        this.errors = errors;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.AiVoice = AiVoice;

const parse = aiApi.parserOf(AiVoice);
const path = 'ai-voice';
const key = 'voice';

exports.create = async function (voice, { user } = {}) {
    /**
     *
     * Create an AiVoice
     *
     * @description Send an AiVoice object for creation at the Stark Infra API and start cloning it.
     * The call returns immediately with the voice in 'processing' status.
     *
     * Parameters (required):
     * @param voice [AiVoice object]: AiVoice object to be created in the API.
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns AiVoice object with updated attributes.
     *
     */
    // the API answers 400 to any parameter it does not know, so only the creatable fields are sent
    const payload = aiApi.dropNulls({
        audio: voice.audio,
        name: voice.name,
        description: voice.description,
        language: voice.language,
        gender: voice.gender
    });
    return aiApi.createOne(parse, path, key, payload, user);
};

exports.query = async function ({ user } = {}) {
    /**
     *
     * Retrieve AiVoices
     *
     * @description Receive a generator of AiVoice objects previously created in the Stark Infra API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns generator of AiVoice objects with updated attributes
     *
     */
    // this route is not paginated and takes no filters
    return aiApi.listAll(parse, path, 'voices', user);
};

exports.delete = async function (ids, { user } = {}) {
    /**
     *
     * Delete AiVoices
     *
     * @description Delete up to 100 AiVoices at once.
     *
     * Parameters (required):
     * @param ids [list of strings]: ids of the AiVoices to be deleted. Up to 100 ids. ex: ['5656565656565656', '4545454545454545']
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of deleted AiVoice objects
     *
     */
    return aiApi.deleteMany(parse, path, 'voices', ids, user);
};
