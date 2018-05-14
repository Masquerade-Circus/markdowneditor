const formats = {
    password: {
        regexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g,
        message: 'password'
    },
    date: {
        regexp: /^\d{1,4}\W?\w{1,3}\W?\d{1,4}$/g,
        message: 'date'
    },
    time: {
        regexp: /^[am|pm]*\s*([0-2]?[0-9]):([0-5][0-9])\s*[am|pm]*$/gi,
        message: 'time'
    },
    uri: {
        regexp: /^http[s]*\:\/\/[\w|\d|\\|-|\.]+\.(\w){2,7}(\S*)?$/g,
        message: 'uri'
    },
    number: {
        regexp: /^\d+$/g,
        message: 'number'
    },
    currency: {
        regexp: /^(\$)?\s?(\d{1,3}(\,\d{3})*|\d+)(\.\d{2,})?$/g,
        message: 'currency'
    },
    tel: {
        regexp: /^(\()?\d{3}(\))?-?\s?\d{3}-?\s?\d{4}$/g,
        message: 'tel'
    },
    telOnlyNumbers: {
        regexp: /^\d{10}$/g,
        message: 'telOnlyNumbers'
    },
    rfc: {
        regexp: /^[\sA-Z&]{3,4}([0-9]{2})(1[0-2]|0[1-9])([0-3][0-9])([ -]?)([A-Z0-9]{3,4})$/g,
        message: 'rfc'
    },
    email: {
        regexp: /^([a-zA-Z0-9]{3,}[\.|\-|\_]?[a-zA-Z0-9]*)+@([a-zA-Z0-9]{3,}[\.|\-|\_]?)+(\.[a-z]{2,7})$/g,
        message: 'email'
    },
    objectid: {
        regexp: /^[a-f\d]{24}$/i,
        message: 'objectid'
    }
},
dateFormat = 'DD/MM/YYYY',
messages = {
    string: "shall be a string",
    null: "shall be null",
    minLength: "shall have length at least %d",
    maxLength: "shall have length no more than %d",
    pattern: "shall match pattern %s",
    integer: "shall be an integer",
    multipleOf: "shall be multiple of %d",
    number: "shall be a number",
    minimum: "shall be >= %d",
    "minimum.exclusive": "shall be > %d",
    maximum: "shall be <= %d",
    "maximum.exclusive": "shall be < %d",
    boolean: "shall be boolean",
    object: "shall be object",
    additionalProperties: "shall not have additional properties",
    minProperties: "shall have at least %d properties",
    maxProperties: "shall have no more than %d properties",
    array: "shall be array",
    additionalItems: "shall not have additional items",
    minItems: "shall have at least %d items",
    maxItems: "shall have no more %d items",
    uniqueItems: "shall have unique items",
    enum: "shall be one of values %s",
    required: "is required",
    dependency: "does not meet additional requirements for %s",
    not: "does not meet 'not' requirement",
    oneOf: "does not meet exactly one requirement",
    "oneOf.zero": "does not meet any requirement",
    allOf: "does not meet all requirements",
    anyOf: "does not meet any requirement",
    custom: "is not valid",
    equalsTo: 'equalsTo',
    objectid: 'objectid',
    required: 'required',
    boolean: 'boolean'
};

module.exports = {
    formats,
    dateFormat,
    messages
};
