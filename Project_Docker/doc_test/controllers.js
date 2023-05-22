// controllers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, UserDetails } = require('./models');

async function signup(req, res) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function signin(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ email: user.email }, 'secret');

    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addTopic(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'secret');
    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newUserDetails = new UserDetails({
      user: user._id,
      topic: req.body.topic,
      description: req.body.description
      });
  
     
      await newUserDetails.save();
  
      
      res.status(200).json({ message: 'Topic added' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  module.exports = { signup,signin,addTopic}
