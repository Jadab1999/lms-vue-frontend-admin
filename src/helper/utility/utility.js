export const formatDate = (date, type) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        time = d.toLocaleTimeString();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if(type === 'withDate'){
        return [year, month, day].join('-') + " " + time;
    } else if (type === 'usTimeDate') {
        return [month, day, year].join('-') + " " + time;
    } else {
        return [year, month, day].join('-');
    }
}

export const capitalizeCase = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const upperCase = (string) => {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

export const usFormatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

export const numberFormating = (number) => { // Formating with comma
    let num = number.toString();
    let lastThree = num.substring(num.length-3);
    let otherNumbers = num.substring(0,num.length-3);
    if(otherNumbers != '')
        lastThree = ',' + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
}

export const kFormating = (num) => { // Formating like 100k
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

export const underscoreTostring = (text) => { // Underscore to Normal String
    let transformToNormal = text.split('_').join(" ");
    let capitalize = transformToNormal.charAt(0).toUpperCase() + transformToNormal.slice(1)
    return capitalize;
}

export const isUrlValid = (userInput) => { // URL Validation
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}
export const camelToWords = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}