const SubResource = require('starkcore').SubResource;


class TemplateReplacements extends SubResource {
    /**
     *
     * CreditNote.TemplateReplacements object
     *
     * @description The CreditNote.TemplateReplacements object carries the custom values used to fill the placeholders
     * of the contract template of a CreditNote. Its attributes are free: they depend on the template.
     *
     * Parameters (optional):
     * @param properties [object]: placeholder name and its value. The keys are sent exactly as written, so use the camelCase name of the placeholder. Keys with null or undefined values are not sent. ex: {guarantorName: 'Jon Snow'}
     *
     */
    constructor(properties = {}) {
        super();

        Object.assign(this, properties);
    }
}

exports.TemplateReplacements = TemplateReplacements;
