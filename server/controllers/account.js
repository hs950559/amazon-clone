const JWT = require('jsonwebtoken');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

signToken = user => {
    var token = jwt.sign({
        user: user
      }, JWT_SECRET, {
        expiresIn: '7d'
      });

    return token;
//   return JWT.sign({
//     iss: 'Hemant',
//     sub: user.id,
//     username: user.local.email,
//     admin: user.local.admin,
//     iat: new Date().getTime(), // current time
//     exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
//   }, JWT_SECRET);
}

module.exports = {
  index: async (req, res, next ) => {
    const users = await User.find({});
    res.status(200).json(users);
  },

  signUp: async (req, res, next) => {
    const { name, email, password, isSeller } = req.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "email": email });
    console.log('Herere', foundUser)

    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }

    // Create a new user
    const newUser = new User({ 
        name: name,
        email: email,
        password: password,
        isSeller: isSeller,
        picture: User.gravatar()
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Respond with token
    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;
    
        if (!user) {
          res.json({
            success: false,
            message: 'Authenticated failed, User not found'
          });
        } else if (user) {
    
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password'
            });
          } else {
            var token = signToken(user);
    
            res.json({
              success: true,
              mesage: "Enjoy your token",
              token: token
            });
          }
        }
    
      });
  },

  secret: async (req, res, next) => {
    console.log('I managed to get here!');
    res.json({ secret: "resource" });
  }
}