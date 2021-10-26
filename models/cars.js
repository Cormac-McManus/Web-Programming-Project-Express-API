const Joi = require('joi');
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    fuel: String,
    engine_size: Number,
    transmission: String,
    drivetrain: String,
    body: String,
    tags: [String]
})

const Car = mongoose.model('Car', carSchema);

function validateCar(car) {
    const Schema = Joi.object({
        make: Joi.string(),
        model: Joi.string(),
        // Year of car must be at least 1880
        year: Joi.number().integer().min(1880),
        // Fuel type string must be at least 2 letters (Diesel, Petrol, EV, Hybrid)
        fuel: Joi.string().min(2),
        engine_size: Joi.number().min(0),
        transmission: Joi.string(),
        // Must be 3 characters e.g. FWD, RWD, AWD, 4WD etc...
        drivetrain: Joi.string().min(3).max(3),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string())
    })
    return Schema.validate(car);
}

exports.Car = Car;
exports.validate = validateCar;