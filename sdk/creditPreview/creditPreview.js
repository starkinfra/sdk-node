const rest = require('../utils/rest.js');
const SubResource = require('core-node').SubResource;
const {CreditNotePreview} = require('./creditNotePreview.js');
const creditNotePreviewResource = require('./creditNotePreview.js').subResource;


class CreditPreview extends SubResource {
    /**
     * 
     * CreditPreview object
     * 
     * @description A CreditPreview is used to get information from a credit before taking it.
     * This resource can be used to preview credit notes
     * 
     * Parameters (required):
     * @param credit [CreditNotePreview]: Information preview of the informed credit.
     * @param type [string]: Credit type. ex: "credit-note"
     */
    constructor({
                    credit, type
                }) {
        super();
        
        let parsedObject = parseCredit(credit, type);
        this.credit = parsedObject['credit'];
        this.type = parsedObject['type'];
    }
}

parseCredit = function (credit, type) {
    if (credit === null) {
        return { 'credit': null, 'type': type };
    } else if (credit.constructor === Object) {
        if (type){
            const creditResource = {
                'credit-note': creditNotePreviewResource
            }[type];
            return { 'credit': Object.assign(new creditResource['class'](credit), credit), 'type': type };
        }
        throw 'if credit is a dictionary, type must be' +
            'credit-note';
    }

    if (credit instanceof CreditNotePreview)
        return { 'credit': credit, 'type': 'credit-note' };

    throw new Error('credit must be either ' +
        'a dictionary' +
        ', a starkinfra.creditPreview.CreditPreview' +
        ', but not a ' + typeof (credit)
    );
}

exports.CreditPreview = CreditPreview;
let resource = {'class': exports.CreditPreview, 'name': 'CreditPreview'};

exports.create = async function(previews, {user}={}) {
    /**
     * 
     * Create CreditPreviews
     * 
     * @description Send a list of CreditPreview objects for creation at the Stark Infra API
     *
     * Parameters (required):
     * @param previews [list of CreditPreview objects]: list of CreditPreview objects to be created in the API
     *
     * Parameters (optional):
     * @param user [Organization/Project object, default null]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @param list of CreditPreview objects with updated attributes
     */
    return rest.post(resource, previews, user);
}
