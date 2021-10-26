const { json } = require('express');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Car, validate } = require('../models/cars');

router.post('/', async (req, res) => {

})

module.exports = router;