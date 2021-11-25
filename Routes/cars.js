const { json } = require('express');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Model } = require('mongoose');
const { Car, validate } = require('../models/cars');


// Post a new car to the collection
router.post('/', async (req, res) => {
    let car = new Car(req.body);

    const result = validate(req.body)

    if (result.error)
    {
        res.status(400).json(result.error);
        return;
    }

    let carSaved = await car.save();

    res.location(`/${car._id}`)
    .status(201)
    .json(car);


    console.log(carSaved)
})

// Get list of cars
router.get('/', async (req, res) => {
    const { make, model, year, fuel, engine_size, transmission, drivetrain, body, limit} = req.query;

    let filter = {};


    /******* String property filters ********/

    //make
    if (make) {
        filter.make = { $regex: `${make}`, $options: 'i' } // $options: 'i' - This ignores case.
    }
    //model
    if (model) {
        filter.model = { $regex: `${model}`, $options: 'i' } // $options: 'i' - This ignores case.
    }
    //fuel
    if (fuel) {
        filter.fuel = { $regex: `${fuel}`, $options: 'i' } // $options: 'i' - This ignores case.
    }
    //transmission
    if (transmission) {
        filter.transmission = { $regex: `${transmission}`, $options: 'i' } // $options: 'i' - This ignores case.
    }
    //drivetrain
    if (drivetrain) {
        filter.drivetrain = { $regex: `${drivetrain}`, $options: 'i' } // $options: 'i' - This ignores case.
    }
    //body
    if (body) {
        filter.body = { $regex: `${body}`, $options: 'i' } // $options: 'i' - This ignores case.
    }
    /****************************************/


    /************ Filter by year ************/
    const yearNumber = parseInt(year)


    if (!isNaN(year)) {
        Number.isInteger(year)
        filter.year = yearNumber
    }
    /*****************************************/



    /************ Limit results ************/
    let limitNumber = parseInt(limit)
    if (isNaN(limitNumber)) {
        limitNumber = 1
    }
    filter.limit = limitNumber;
    /***************************************/


    /************ APPLY FILTERS ************/
    console.table(filter);
    
        const cars = await Car.find(filter)
        //.limit(limitNumber)
        .sort({ year: "ascending", make : 1})
        //.select("make");
        res.json(cars);
    /***************************************/
})

router.get('/:id', async (req,res) => {
    const id = req.params.id;

    const car = await Car.findById(id)
    .catch((error) => 
    res.status(404).send({ message: 'not found (' + error + ')'}));
    

    if (!car) {
        res.status(404);
        res.json({ error: 'not found'});
        return
    }

    

    res.json(car);
    return;
})

router.delete('/:id', async (req,res) => {
    const id = req.params.id;
    const car = await Car.findByIdAndDelete(id)
    .catch((error)  => 
    res.status(404).send({ message: 'not found' + error})
    );
    const cars = await Car.find();

    if (!car) {
        res.status(404).json(`book with that ID ${id} was not found`);
        return;
    }

    res.json(cars)
})

router.put('/:id', async (req,res) => {
    const id = req.params.id.toString();
    const result = validate(req.body);

    const car = await Car.findById(id)
    .catch((error) => 
    res.status(404).send({ message: 'not found (' + error + ')'}));
    

    if (result.error)
    {
        res.status(400).json(result.error);
        console.log("BAD REQUEST!" + result.error)
        return;
    }


    Car.findByIdAndUpdate({_id: id}, {...req.body}).
    then((result) => {
        if (result) {
            res.status(200).send({ message: 'updated'})
        }
        else {
            res.status(404).send({ message: 'not found'})
        }
    })
    .catch((error)  => 
    res.status(404).send({ message: 'not found' + error})
    );
    

    if (!car) {
        res.status(404).json(`car with the ID {req.params.id} was not found`);
        return;
    }
    return;
})
module.exports = router;