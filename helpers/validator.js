const isValidMobileNumber = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

const validateTemplateParameters = (parameters) => {
    // Add template validation logic here
    if (!parameters || Object.keys(parameters).length === 0) {
        return false;
    }
    return true;
};

module.exports = {
    isValidMobileNumber,
    validateTemplateParameters
};