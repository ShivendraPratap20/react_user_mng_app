const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.json({status:"FAILED", message:errors})
    return
  }

  next();
};

module.exports = validate;