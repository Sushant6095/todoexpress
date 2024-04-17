const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()





// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Define User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  course: String,
  graduationYear: String,
  status: String // alumni or current
});

const User = mongoose.model('User', UserSchema);

// Register endpoint
app.post('/register', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    course: req.body.course,
    graduationYear: req.body.graduationYear,
    status: req.body.status
  });

  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json(err));
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, password })
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => res.status(400).json(err));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
