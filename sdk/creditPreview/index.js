const creditPreview = require('./creditPreview.js');

exports.create = creditPreview.create;
exports.CreditNotePreview = require('./creditNotePreview.js').CreditNotePreview;
exports.CreditPreview = creditPreview.CreditPreview;
