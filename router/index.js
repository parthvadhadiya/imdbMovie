'use strict';
var express = require('express');
var router = express.Router();
const handler = require('../handler/mainHenadler');
const Handler = new handler();
router.get('/', function (req, res) {
    res.send('connection success...!')
});

// Following are all routes of API with their respective functions
router.get('/alive', Handler.alive);
router.get('/api/searchMovie/:name', Handler.searchMovie)
router.post('/api/updateMovie/:name', Handler.updateMovie)
router.get('/api/searchid/', Handler.searchId)
router.get('/api/searchyear/', Handler.searchYear)
router.all('*', (req,res) =>{ 
    res.status(502).send('BAD_GATEWAY')
})
module.exports = router;