const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/carsDB', {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
});

const cars = require('./Routes/cars');
const home = require('./Routes/home');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('DB Connected!')
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/cars', cars)

app.get('/routes/1', (req,res) => 
    res.send('GET request for /routes/1 successful!'));

app.listen(port, () => console.log(`App listening on port ${port}`));