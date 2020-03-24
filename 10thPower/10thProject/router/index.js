const express = require("express");
const indexCtrl = require("../controller/index.js");
const userCtrl = require("../controller/user.js");
const { check, validationResult } = require("express-validator/check");

const router = express.Router();

router
  .get("/", indexCtrl.showIndex)
  .get("/login", indexCtrl.showLogin)
  .post(
    "/signup",
    [check("username").isEmail(), check("password").isLength({ min: 5 })],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(500).join({ errors: errors.array() });
      }
      next();
    },
    indexCtrl.signup
  )
  .get("/captcha", indexCtrl.captcha)
  .get("/users/check", userCtrl.check)
  .get("/captcha/check", indexCtrl.captchaCheck);

module.exports = router;
