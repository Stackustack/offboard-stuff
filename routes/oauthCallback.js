const express = require('express');
const router = express.Router();

const {
    getGoogleAccountFromCode
} = require('./../src/google-utils')

router.get('/', async (req, res, next) => {
    const code = req.query.code
    const user = await getGoogleAccountFromCode(code)

    req.session.user = user
    res.redirect('/assets')
});


module.exports = router;