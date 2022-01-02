const express = require("express");
const userControllers =require('../controllers/userControllers')
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "" });
  });
router.post('/signup',userControllers.signup)
router.post('/login',userControllers.login)
router.post('/apply-form',userControllers.applyForm)

module.exports = router;