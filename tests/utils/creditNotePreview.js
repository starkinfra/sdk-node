const starkinfra = require('../../index.js');
const random = require('./random');
const { TaxIdGenerator } = require('./taxIdGenerator.js');

const generatorsByType = {
    'sac': generateSacPreview,
    'price': generatePricePreview,
    'american': generateAmericanPreview,
    'bullet': generateBulletPreview,
    'custom': generateCustomPreview,
}

function choice(options=[]){
    return options[random.randomInt(0, options.length - 1)]
}

function _choiceBetween(option, chance=0.5){
    return Math.random() > chance ? option : undefined
}

exports.generateInvoices = (days = random.randomInt(1, 90), amount=100) => {
    return new starkinfra.creditNote.Invoice({
        amount: amount,
        due: random.futureDate(days)
    })
}

exports.generateInvoicePreview = (n=1, amount=random.randomInt(1, 100000)) => {
    return [...Array(n)].map((item, index) => generateInvoices(days=(index + 1) * 30, Math.round(amount / n)))
}

function generateSacPreview() {
    return new starkinfra.creditPreview.CreditNotePreview({
        taxId: TaxIdGenerator.taxId(),
        type: "sac",
        nominalAmount: random.randomInt(1, 100000),
        rebateAmount: _choiceBetween(random.randomInt(1, 1000)),
        nominalInterest: random.randomFloat(0, 4.99),
        scheduled: random.futureDate(days=random.randomInt(11, 20)),
        initialDue: random.futureDate(days=random.randomInt(30, 40)),
        initialAmount: random.randomInt(1, 9999),
        interval: _choiceBetween(choice(["month", "year"]))
    })
}

function generatePricePreview() {
    return new starkinfra.creditPreview.CreditNotePreview({
        taxId: TaxIdGenerator.taxId(),
        type: "price",
        nominalAmount: random.randomInt(1, 100000),
        rebateAmount: _choiceBetween(random.randomInt(1, 1000)),
        nominalInterest: random.randomFloat(0, 4.99),
        scheduled: random.futureDate(days=random.randomInt(11, 20)),
        initialDue: random.futureDate(days=random.randomInt(30, 40)),
        initialAmount: random.randomInt(1, 9999),
        interval: _choiceBetween(choice(["month", "year"]))
    })
}

function generateAmericanPreview() {
    return new starkinfra.creditPreview.CreditNotePreview({
        taxId: TaxIdGenerator.taxId(),
        type: "american",
        nominalAmount: random.randomInt(1, 100000),
        rebateAmount: _choiceBetween(random.randomInt(1, 1000)),
        nominalInterest: random.randomFloat(0, 4.99),
        scheduled: random.futureDate(days=random.randomInt(11, 20)),
        initialDue: random.futureDate(days=random.randomInt(30, 40)),
        count: random.randomInt(1, 100),
        interval: _choiceBetween(choice(["month", "year"]))
    })
}

function generateBulletPreview() {
    return new starkinfra.creditPreview.CreditNotePreview({
        taxId: TaxIdGenerator.taxId(),
        type: "bullet",
        nominalAmount: random.randomInt(1, 100000),
        rebateAmount: _choiceBetween(random.randomInt(1, 1000)),
        nominalInterest: random.randomFloat(0.1, 4.99),
        scheduled: random.futureDate(days=random.randomInt(11, 20)),
        initialDue: random.futureDate(days=random.randomInt(30, 40))
    })
}

function generateCustomPreview() {
    var amount = random.randomInt(1, 100000)
    return new starkinfra.creditPreview.CreditNotePreview({
        taxId: TaxIdGenerator.taxId(),
        type: "custom",
        nominalAmount: amount,
        scheduled: random.futureDate(days=random.randomInt(11, 20)),
        rebateAmount: _choiceBetween(random.randomInt(1, 1000)),
        invoices: generateInvoicePreview(n=random.randomInt(1, 10), amount)
    })
}

function generateRandomPreview() {
    return choice([
        generateSacPreview,
        generatePricePreview,
        generateAmericanPreview,
        generateBulletPreview,
        generateCustomPreview
    ]).call()
}

exports.getCreditNotePreviewExample = (type) => {
    return type ? generatorsByType[type].call() : generateRandomPreview()
}

exports.getPreviewExamples = (n=10, type) => {
    return type ? [...Array(n)].map(() => getPreviewExample(type)) : [...Array(n)].map(() => getPreviewExample())
}
