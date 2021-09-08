const express = require('express');

const router = express.Router();

const document = require('./document');
const wallet = require('./wallet');

router.use('/document', document);
router.use('/wallet', wallet);

module.exports = router;
