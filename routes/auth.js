const express = require("express");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const JWT_SECRET = "iampriyan@webdeveloper";

// ROUTE 1:create a user using :POST "/api/auth/createuser" . nologin required

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash((req.body.password).toString(), salt);

    // Create a new user
    console.log(req.body.name, req.body.email,secPass);
    user = await User.create({
      name: (req.body.name).toString(),
      password: secPass,
      email: (req.body.email).toString(),
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
// ROUTE 2:Authenticate  a user using :POST "/api/auth/login" . no login required
// router.post(
//   "/login",
//   [
//     body("email", "enter a valid email").isEmail(),
//     body("password", "password cannot be blank").exists(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { email, password } = req.body;
//     try {
//       let user = await User.findOne({ email });
//       if (!user) {
//         return res
//           .status(400)
//           .json({ error: "please login with correct credentials" });
//       }
//       const passwordCompare = await  bcrypt.compare(password, user.password);
      
//       if (!passwordCompare) {
//         return res
//           .status(400)
//           .json({ error: "please login with correct credentials" });
//       }
//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       const authToken = jwt.sign(data, JWT_SECRET);
//       console.log(authToken);
//       res.json({ authToken });
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).send("internal server error");
//     }
//   }
// );

router.post('/login',[ body("email", "enter a valid email").isEmail(),
body("password", "password cannot be blank").exists()], async (req,res) => {
  let success=false;
    const { error} = validationResult(req.body);
  // const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send({success,message:'Invalid Email or Password.'})
  const pass=(req.body.password).toString();
  console.log(pass)
  const validPassword = await bcrypt.compare(pass, user.password);
  if (!validPassword) return res.status(400).send({success,message:'Invalid Email or Password.'})

  const data = {
    user: {
      id: user.id,
    },
  };
  success=true;
  const authToken = jwt.sign(data, JWT_SECRET);
  console.log(authToken);
  res.json({success, authToken });
});
// ROUTE 3:get loged in  user details using :POST "/api/auth/getuser" .  login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log({ userId });
    const user = await User.findById(userId).select("-password");

    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
