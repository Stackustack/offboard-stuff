const express = require('express');
const router = express.Router();
const {
    fetchFreshServiceUserId,
    getUserAssets
} = require('./../src/freshServiceUtils.js')


router.get('/', async (req, res, next) => {
    const freshServiceUserId = await fetchFreshServiceUserId(req.session.user.email)
    const userAssets = await getUserAssets(freshServiceUserId)

    res.render('assets', {
        userAssets
    });
});

module.exports = router;