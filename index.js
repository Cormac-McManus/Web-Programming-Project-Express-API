const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const https = require('https')
const fs = require('fs');
const port = 3000;
const cors = require('cors');
const home = require('./Routes/home');
const auth = require('./Routes/auth');
const cars = require('./Routes/cars');
const users = require('./Routes/users');
const refresh = require('./Routes/refresh');
const app = express();

const corsOptions= {
  origin: 'https://localhost:4200',
  credentials: true
}

app.use(cors(corsOptions))
//require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/carsDB', {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
});




const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('DB Connected!')
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/cars', cars)
app.use('/auth', auth)
app.use('/users',users)
app.use('/refresh', refresh)

const serverOptions = {
  key: fs.readFileSync("ssl/58114444_carsdb.key"),
  cert: fs.readFileSync("ssl/58114444_carsdb.cert")
};

https.createServer(serverOptions,app).listen(8080,() =>
  console.log(`listening on 8080, don't forget the https`));

//app.listen(port, () => console.log(`App listening on port ${port}`));