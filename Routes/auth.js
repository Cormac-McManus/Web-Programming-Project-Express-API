const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken')



const ACCESS_TOKEN_SECRET="rIijqCcMlgtxSAJ2h91SFbyVs6GJrgoOsdAMiarfFyDzQqzoH1Om2eciKZipa1ztFHFOPcJDaohHWWvhGIn6h94jUOQnFBb7Cf7NlS8gV8OFdemJoBOI2mjG7avUoF9M" // This should be placed in a .env file

const { User } = require('../models/user');


const secret = ACCESS_TOKEN_SECRET;

router.post('/',  async (req, res) => {


    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).json({ errors: errors.join(',') });
        }
    } else {
        return res.status(400).json({ errors: 'Missing email and password fields' });
    }


    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send('Invalid email or password');


    let passwordFields = user.password.split('$');
    let salt = passwordFields[0];


    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    if (hash !== passwordFields[1]) {
        return res.status(400).send({ errors: ['Invalid e-mail or password'] });
    }

        let payload = {};
        payload._id = user._id;
        payload.email = user.email;
        payload.firstName = user.firstName;
        payload.lastName = user.lastName;


        let token = jwt.sign(payload, secret, { expiresIn: 60 });
        setRefreshCookie(user, res);
        res.status(201).json({ 
        accessToken: token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email });
        console.log('login success');
}
);


const setRefreshCookie =  (user, res) =>  {

    let refreshToken = createRefreshToken(user);

    res.cookie('refreshtoken', refreshToken, {
     httpOnly: true,
     sameSite: 'none',
     secure : true,

    maxAge: 7 * 24 * 60 * 60 * 1000  // 7D
    })

}

const createRefreshToken = (user) => {
    return 'test4';
}

module.exports = router;