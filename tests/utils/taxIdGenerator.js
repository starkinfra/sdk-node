function taxId(chance=0.5){
    return chance > Math.random() ? cpf() : cnpj();
}

function cpf() {
    const first = ("" + random()).padStart(3, '0');
    const second = ("" + random()).padStart(3, '0');
    const third = ("" + random()).padStart(3, '0');

    const firstDigit = calculateCpfDigits(first, second, third);
    const secondDigit = calculateCpfDigits(first, second, third, firstDigit);

    return `${first}.${second}.${third}-${firstDigit}${secondDigit}`;
}

function calculateCpfDigits(first, second, third, fourth) {
    const nums = first.split("").concat(second.split(""), third.split(""));
    if (fourth !== undefined) {
        nums[9] = fourth;
    }

    let x = 0;
    for (let i = (fourth !== undefined ? 11 : 10), j = 0; i >= 2; i--, j++) {
        x += parseInt(nums[j]) * i;
    }

    return (x % 11) < 2 ? 0 : 11 - (x % 11);
}

function cnpj(){
    list = []
    
    for (let i = 0; i < 8; i++)
        list.push(random(digits=9))

    for (let i = 0; i < 3; i++)
        list.push(0)

    list.push(1)
    list.push(calculateCnpjDigits(list))
    list.push(calculateCnpjDigits(list, 1))

    return list.join("").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

function calculateCnpjDigits(numbers){
    let sum = 0
    let salt = 9

    for (let i = numbers.length - 1; i >= 0; i--) {
        sum += numbers[i] * salt--
        if (salt < 2)
            salt = 9
    }

    let digit = sum % 11;

    if (digit >= 10)
        return 0

    return digit
}

function random(digits=999) {
    return Math.floor(Math.random() * digits);
}

module.exports = {
    TaxIdGenerator: {
        cpf,
        cnpj,
        taxId
    }
}
