export const validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.length > 0){
        return {
            lValidation: true,
            eValidation: re.test(email)
        }
    } else {
        return {
            lValidation: false,
            eValidation: re.test(email)
        }
    }
}

export const validateMobile = function (mobile) {
    const re = /^([0|[0-9]{1,5})?([7-9][0-9]{9})$/;
    if(mobile.length > 0){
        return {
            lValidation: true,
            mValidation: re.test(mobile)
        }
    } else {
        return {
            lValidation: false,
            mValidation: re.test(mobile)
        }
    }
}

export const validatePassword = function (password) {
    if(password.length > 0){
        return {
            lValidation: true,
        }
    } else {
        return {
            lValidation: false
        }
    }
}

export const matchPassword = function (password, confPassword) {
    if(password.length > 0 && confPassword.length > 0) {
        return password === confPassword;
    }
}