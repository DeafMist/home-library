const isNullOrEmpty = (value) => value == null || value === '';

const isString = (value) => typeof value === 'string';

const isBoolean = (value) => typeof value === 'boolean' || value === 'true' || value === 'false';

const isDate = (value) => value instanceof Date || !isNaN(Date.parse(value));

const isInteger = (value) => !isNaN(parseInt(value));

const isDateBeforeToday = (date) =>
    new Date(date.toDateString()) < new Date(new Date().toDateString());

const toBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (isBoolean(value)) return value === 'true';
    return null;
};

const toInteger = (value) => {
    if (typeof value === 'number') return value;
    return parseInt(value);
};

const checkReturnDate = (value, res) => !isDate(value) || isDateBeforeToday(new Date(value))
    ? res.status(400).send({ error: "returnDate is empty, in invalid format or before today" })
    : null;

const checkRequiredString = (value, res, prop) => !isString(value) || isNullOrEmpty(value)
    ? res.status(400).send({ error: `${prop} is not string or empty` })
    : null;

const checkRequiredInteger = (value, res, prop) => !isInteger(value)
    ? res.status(400).send({ error: `${prop} is not integer or empty` })
    : null;

module.exports = {
    isNullOrEmpty,
    isString,
    isBoolean,
    isDate,
    isInteger,
    toBoolean,
    isDateBeforeToday,
    checkReturnDate,
    checkRequiredString,
    checkRequiredInteger,
    toInteger,
};
