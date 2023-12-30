const rest = require('../utils/rest.js');
const SubResource = require('core-node').SubResource;


class PixDirector extends SubResource {
    /**
     *
     * PixDirector object
     *
     * @description Mandatory data that must be registered within the Central Bank for emergency contact purposes.
     * When you initialize a PixDirector, the entity will not be automatically
     * created in the Stark Infra API. The 'create' function sends the objects
     * to the Stark Infra API and returns the list of created objects.
     *
     * Parameters (required):
     * @param name [string]: name of the PixDirector. ex: 'Edward Stark'.
     * @param taxId [string]: tax ID (CPF/CNPJ) of the PixDirector. ex: '03.300.300/0001-00'
     * @param phone [string]: phone of the PixDirector. ex: '+551198989898'
     * @param email [string]: email of the PixDirector. ex: 'ned.stark@starkbank.com'
     * @param password [string]: password of the PixDirector. ex: '12345678'
     * @param teamEmail [string]: team email. ex: 'pix.team@company.com'
     * @param teamPhones [list of strings]: list of phones of the team. ex: ['+5511988889999', '+5511988889998']
     *
     * Attributes (return-only):
     * @param status [string]: current PixDirector status. ex: 'success'
     */
    constructor({ 
                    name, taxId, phone, email, password, teamEmail, teamPhones, 
                    status = null 
                }) {
        super();

        this.email = email;
        this.name = name;
        this.password = password;
        this.phone = phone;
        this.taxId = taxId;
        this.teamEmail = teamEmail;
        this.teamPhones = teamPhones;
        this.status = status;
    }
}

exports.PixDirector = PixDirector;
let subResource = {'class': exports.PixDirector, 'name': 'PixDirector'};

exports.create = async function (statement, {user} = {}) {
    /**
     *
     * Create a PixDirector Object
     *
     * @description Send a PixDirector object for creation in the Stark Infra API
     *
     * Parameters (required):
     * @param director [list of PixDirector Object]: list of PixDirector objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns PixDirector objects with updated attributes
     *
     */
    return rest.postSingle(subResource, statement, user);
};
