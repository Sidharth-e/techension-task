const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(201)
        .send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create the user in the database
    user = await new User({ ...req.body, password: hashPassword }).save();

    // Generate token after saving the user
    const token = user.generateAuthToken();

    res.status(200).header('Authorization', `Bearer ${token}`).send({token:token,message: "User created successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await User.find();
    res.status(200).send({ data: records, message: "Records" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
