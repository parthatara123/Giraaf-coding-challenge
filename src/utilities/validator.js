const moment = require("moment");

const isValidInputData = function (object) {
  return Object.keys(object) === 0;
};

//validation of required fields
const isValidInput = function (value) {
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

const isValidName = function (value) {
  if (
    typeof value === "string" &&
    value.trim().length > 0 &&
    /^[A-Za-z]+$/.test(value) === true
  )
    return true;
  return false;
};

// Date validation using moment npm

const isValidDateFormat = function (value) {
  const date = moment(value).format("DD-MM-YYYY");
  if (moment(date).isValid()) return true;
  return false;
};

const isFutureDate = (date) => {
  const today = moment();
  return today.diff(date, "year") < 0;
};

const isValidCreditScore = function (value) {
  if (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 900
  )
    return true;
  return false;
};

const isValidLoanAmount = function (value) {
  if (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 50000 &&
    value <= 500000 &&
    value % 10000 === 0
  )
    return true;
  return false;
};

module.exports = {
  isValidInputData,
  isValidInput,
  isValidName,
  isFutureDate,
  isValidCreditScore,
  isValidLoanAmount,
};
