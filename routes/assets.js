const express = require('express');
const router = express.Router();
const {
    fetchFreshServiceUserId,
    getUserAssets,
    updateWithMacbookData
} = require('../src/fresh-service-utils.js')

router.get('/', async (req, res, next) => {
    const freshServiceUserId    = await fetchFreshServiceUserId(req.session.user.email)
    const fetchedAssets         = await getUserAssets(freshServiceUserId)
    const updatedAssets         = await updateWithMacbookData(fetchedAssets)

    res.render('assets', {
        updatedAssets
    });
});

module.exports = router;