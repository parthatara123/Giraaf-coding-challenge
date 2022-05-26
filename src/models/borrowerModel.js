const mongoose = require("mongoose");

const borrowerSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    DOB: { type: Date, require: true },
    City: { type: String, require: true },
    creditScore: { type: Number, min: 0, max: 900 },
    loanAmount: { type: Number, min: 50000, max: 500000 },
  },
  { timestamps: true }
);

module.exports = mongoose.Model("Borrower", borrowerSchema);
