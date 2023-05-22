// server.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/project1?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas Connected')) 
  .catch(err => console.log(err));

// Load API routes
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
module.exports=app;