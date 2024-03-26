const mongoose = require("mongoose");
const Joi = require("joi");

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  referenceID: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  accidentVenu: {
    type: String,
    required: true,
  }, 
  accidentDate: {
    type: String,
    required: true,
  },
  visitDate: {
    type: String,
    required: false,
  },
  totalCost: {
    type: String,
    required: true,
  },
});


const Claim = mongoose.model("claim", claimSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    referenceID: Joi.string(),
    dob:Joi.string(),
    gender: Joi.string(),
    contact: Joi.string(),
    country: Joi.string(),
    accidentVenu: Joi.string(),
    accidentDate: Joi.string(),
    visitDate: Joi.string(),
    totalCost: Joi.string(),
  });
  return schema.validate(data);
};


module.exports = { Claim, validate  };