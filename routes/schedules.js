const express = require ('express');
const router = express.Router();
const Game = require('../models/game');
const Employee = require('../models/employee');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

router.get('/autoAssign', async (req, res, next) => {
    try{
        const games = await Game.find({})
        const employees = await Employee.find({first_name: "Siman"})
        console.log(employees)
        
        
    }catch(err){
        console.log(err)
    }
    // console.log("games", gs)

});


module.exports = router;