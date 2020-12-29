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


});

router.post('/assignGame', async (req, res, next) => {
    const game = req.body.game;
    const employee = req.body.employee;
    
    //Check if employee is available the same day as the game

    //Check if the employee is able to film that type of game

    //Check if the employee will be able to make it to the game on time

})

router.post('/findAvailableEmployees', async(req, res, next) => {
    const availableEmployees = []
    const gameStart = new Date(req.body.start).toDateString();
    const gameEnd = new Date(req.body.end).toDateString();
    await Employee.find({}, function(err, employees){
        try{
            employees.forEach(employee => {
                let availability = employee.availability.map(x => (
                    x.toDateString()
                ));
                
                if(availability.includes(gameStart)){
                    availableEmployees.push(employee)
                }
            })

            res.status(200).json({
                message: "Request to /findAvailableEmployees was successful.",
                availableEmployees: availableEmployees
            })
        }
        catch{
            res.status(424).json({
                message: "Request to /findAvailableEmployees failed.",
                err: err
            })
        }
    })
    
})


module.exports = router;