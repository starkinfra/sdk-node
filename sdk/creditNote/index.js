const creditNote = require('./creditNote.js');

exports.log = require('./log');
exports.create = creditNote.create;
exports.query = creditNote.query;
exports.get = creditNote.get;
exports.page = creditNote.page;
exports.parse = creditNote.parse;
exports.CreditNote = creditNote.CreditNote;
