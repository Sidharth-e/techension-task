const router = require("express").Router();
const { Claim,validate } = require("../models/claims");
const Joi = require("joi");

router.post("/", async (req, res) => {
    try {
      const { error } = validate(req.body);
      const userId = req.user._id; 
      if (error)
        return res.status(400).send({ message: error.details[0].message });
  
      // Create the user in the database
      user = await new Claim({ userId, ...req.body}).save();
  
      res.status(200).send({message: "claim created successfully" });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).send({ message: "Internal Server Error" });
    }
  });


  router.get("/", async (req, res) => {
    try {
      const userId = req.user._id;
      const claims = await Claim.find({
      userId: userId
      });
    
      if (!claims || claims.length === 0) {
      return res.status(200).send({ claims:[],message: "No claims data found " });
      }
    
      res.status(200).send({ claims });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
    });

    router.delete("/:id", async (req, res) => {
      try {
        const userId = req.user._id;
        const entryId = req.params.id;
      
        const deletedEntry = await Claim.findOneAndDelete({
        _id: entryId,
        userId: userId,
        });
      
        if (!deletedEntry) {
        return res.status(404).send({ message: "Claims entry not found" });
        }
      
        res.status(200).send({ message: "Claims entry deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
      }
      });
    


module.exports = router;