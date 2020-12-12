const express = require ('express');
const router = express.Router();
const Options = require('../models/option');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

router.get('/getAgeGroups', (req, res, next) => {
    Options.find({}, function(err,options){
        if(!err){
        res.status(200).json({
            message: "GET request to /getAgeGroups succeeded",
            options: options.find(x => x.type === "ageGroups").ageGroups
        });
    }
    else{
        res.status(424).json({
            message: "GET request to /getAgeGroups failed"
        })
    }
    });
});

module.exports = router;