const { CreditHolmes } = require("../../sdk/creditHolmes");
const random = require("./random");


const generateCompetence = () => {
    const today = new Date();
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const previousMonthEnd = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 0);
    const competence = random.randomDatetimeBetween(previousMonthEnd, previousMonthEnd - 365 * 24 * 60 * 60 * 1000).split("T")[0];
    
    var date = new Date(competence);
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Adding 1 to get month in the range of 1-12

    // Pad the month value with leading zero if it is a single digit
    if (month < 10) {
        month = '0' + month;
    }

    return year + '-' + month;
}

exports.generateExampleCreditHolmesJson = (n = 1) => {
    const creditHolmes = [];

    for (let i = 0; i < n; i++) {
        const holmes = new CreditHolmes({
            taxId: "012.345.678-90",
            competence: generateCompetence()
        });
        creditHolmes.push(holmes);
    }

    return creditHolmes;
};
