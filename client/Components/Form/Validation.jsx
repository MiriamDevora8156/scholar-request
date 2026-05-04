export const nameValid = (value) => {
    if (value.length == 0)
        return 'Value is required'
    const regex = /^[a-zA-Zא-ת\s]+$/;
    if (!regex.test(value))
        return 'Letters only'
    if (value.length < 2)
        return 'Name is too short'
    return ''
}
export const idValid = (value) => {
    if (value.length == 0)
        return 'Value is required'
    if (value.length !== 9 || isNaN(value))
        return 'Too short'
    else {
        let sum = 0, incNum;
        for (let i = 0; i < value.length; i++) {
            incNum = Number(value[i]) * ((i % 2) + 1);
            sum += (incNum > 9) ? incNum - 9 : incNum;
        }
        if (sum % 10 !== 0)
            return 'Invalid ID'
        return ''
    }
}
export const numberValid = (value, minLen, maxLen, minValue, maxValue) => {
    if (value.length == 0)
        return 'Value is required'
    const regex = /^[0-9]+$/
    if (!regex.test(value))
        return 'Numbers only'
    if (value.length < minLen)
        return 'Too short'
    if (value.length > maxLen)
        return 'Too long'
    if (value < minValue)
        return 'Too small'
    if (value > maxValue)
        return 'Too large'
    return ''
}

export const fileValid = (file) => {
    if (!file) return 'Required: Please upload a document';
    return '';
}
