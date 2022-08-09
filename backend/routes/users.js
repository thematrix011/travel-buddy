const router = require("express").Router();
const user = require("../models/user");
const bcrypt = require("bcrypt");

// register a user
router.post("/register", async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save the new user
    const myuser = await newUser.save();
    res
      .status(200)
      .json({ user: myuser._id, mail: myuser.email, id: myuser._id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// login
router.post("/login", async(req,res) => {
    try{
        // get user
        const myuser = await user.findOne({username: req.body.username});
        if(!myuser){
            res.status(400).json("Wrong username or password");
            return;
        } 

        // authenticate password
        const validPassword = await bcrypt.compare(
            req.body.password,
            myuser.password,
        );
        if(!validPassword){
            res.status(400).json("Wrong username or password");
            return;
        } 

        // send success response 
        res.status(200).json({_id:myuser._id, username: myuser.username});
    }
    catch (err){
        res.status(500).json(err);
    }
});


module.exports = router;
