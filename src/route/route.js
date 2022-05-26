const { Router } = require("express");
const router = Router();
const BorrowerController = require("../controllers/borrowerController");

//test API
router.get("/test-me", (req, res) => res.send("test API is working"));

//post API for money lending
router.post("/money-lending", BorrowerController.loanRequest);

module.exports = router;
