const express = require('express');

const router = express.Router();

// const router = express.Router();

router.post('/refresh', async (req, res) => {
    console.log('in refresh')

    console.table(req.cookies);

    const user = await User.findOne({_id : req.body.userid});

    if (!user)  return res.status(401).json('Auth failed - userid not valid');

    savedToken = getSavedToken(user);


    if (!savedToken || savedToken != req.cookies.refreshtoken) return res.status(401).json('Auth failed - token not found or matched');

    // here we have a matching refresh token create a new JWT and return.

    const newAccesstoken = createJWT(user);
    const newRefreshToken = createRefreshToken(user);

    await setRefreshCookie(user, res, newRefreshToken);

    res.status(201).json({
        accessToken: newAccesstoken,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    });
    console.log('refresh success');

})

const createRefreshToken = (user) => {
    return 'testagain';
}

const getSavedToken = (user) => {
    return 'testagain';
}

module.exports = router;
