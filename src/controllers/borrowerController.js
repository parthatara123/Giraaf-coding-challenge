const mongoose = require("mongoose");
const Validator = require("../utilities/validator");
const moment = require("moment");

const loanRequest = async function (req, res) {
  try {
    let { name, DOB, city, creditScore, loanAmount } = req.body;

    const tier1Cities = [
      "Bengaluru",
      "Mumbai",
      "Delhi",
      "Chennai",
      "Hyderabad",
    ];

    const tier2Cities = ["Mysore", "Hubli", "Dharwad", "Belgaum", "Shimoga"];
    const allCities = [...tier1Cities, ...tier2Cities];


    //if no input data is given
    if (Validator.isValidInputData(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Borrower detail is required" });
    }

    //validating input fields
    if (!Validator.isValidInput(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }

    if (!Validator.isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Valid borrower name is required" });
    }

    if (!Validator.isValidInput(city)) {
      return res
        .status(400)
        .send({ status: false, message: "City is required" });
    }

    if (!Validator.isValidName(city)) {
      return res
        .status(400)
        .send({ status: false, message: "Valid city name is required" });
    }

    if (!Validator.isValidInput(DOB)) {
      return res
        .status(400)
        .send({ status: false, message: "Date of is required" });
    }

    // input date should be in 'YYYY-MM-DD' format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(DOB)) {
      return res
        .status(400)
        .send({ status: false, message: "DOB should be in yyyy-mm-dd format" });
    }

    // using moment for date validation and checking DOB must not be greater than today's date
    if (
      !moment(new Date(DOB)).isValid() ||
      moment().isBefore(new Date(DOB)) === true
    ) {
      return res
        .status(400)
        .send({ status: false, message: " Enter a valid date" });
    }

    // calculating age of user
    const age = moment().diff(DOB, "months") / 12;
    //Validating credit score

    if (!Validator.isValidCreditScore(creditScore)) {
      return res.status(400).send({
        status: false,
        message:
          "Credit score is required and must be an integer between 0 to 900",
      });
    }

    // if age is less than 18 or more than 59 then rejecting loan
    if (age < 18 || age > 59) {
      return res
        .status(200)
        .send({
          status: true,
          message: `Loan-Rejected : User age is ${age}, does not fulfilling the criteria`,
        });
    }

    //Validating loan amount
    if (!Validator.isValidLoanAmount(loanAmount)) {
      return res.status(400).send({
        status: false,
        message:
          "Loan amount is required and must be between 50,000 to 5,00,000 in multiple of 10000",
      });
    }

    let ROI 
    if (!allCities.includes(city)) {
      return res.status(200).send({
        status: false,
        message: "Sorry, we do not provide loan to this city",
      });
    }

    if (tier1Cities.includes(city)) {
      if (creditScore < 300) {
        return res.status(200).send({
          status: false,
          message:
            "Sorry, we can not offer you a loan because of less credit score",
        });
      } else if (creditScore >= 300 && creditScore <= 500) {
        ROI = 14;
      } else if (creditScore >= 501 && creditScore <= 800) {
        ROI = 12;
      } else if (creditScore >= 801 && creditScore <= 900) {
        ROI = 10;
      }
    } else {
      if (creditScore < 500) {
        return res
          .status(200)
          .send({ status: true, message: "Loan-Rejected : poor credit score" });
      } else if (creditScore <= 800 && creditScore > 500) {
        ROI = 13;
      } else if (creditScore <= 900 && creditScore > 800) {
        ROI = 11;
      }
    }

    const todaysDate = new Date().getDate();
    const todaysMonth = new Date().getMonth();
    const todaysYear = new Date().getFullYear();

    let emiStartDate;

    if (todaysDate === 1) {
      emiStartDate = moment();
    } else {
      emiStartDate = moment([todaysYear, todaysMonth, 01]).add(1, "month");
    }

    // loan tenure is fixed i.e. 12Months
    const tenure = 12;

    const principleComponent = Math.floor(loanAmount / tenure);
    // tenure is multiplied by 100 as ROI in %
    const interestComponent = Math.floor((ROI * loanAmount) / (tenure * 100));
    console.log(interestComponent)
    let EMIData = [
      {
        Principal: principleComponent,
        Interest: interestComponent,
        EMIDate: emiStartDate.format("DD-MM-YYYY"),
      },
    ];

    for (let i = 1; i <= 11; i++) {
      nextEMIDate = moment(emiStartDate).add(i, "month").format("DD-MM-YYYY");
      EMIData.push({
        Principal: principleComponent,
        Interest: interestComponent,
        EMIDate: nextEMIDate,
      });
    }
    return res
      .status(201)
      .send({ status: true, Interest: ROI, message: "Approve", data: EMIData });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.loanRequest = loanRequest;
