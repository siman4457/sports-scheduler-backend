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
    const gameStartDate = new Date(req.body.start).toDateString();
    const gameEndDate = new Date(req.body.end).toDateString();

    console.log('game start raw: ', req.body.start);
    await Employee.find({}, function(err, employees){
        try{
            employees.forEach(employee => {
                let availability = employee.availability.map(x => (
                    x.toDateString()
                ));
                
                if(availability.includes(gameStartDate)){
                    //TODO: Check if game has already been assigned for the given time slot.
                    // Also check if employee has enough time to set up or travel to the given location
                    // if the location is not the same

                    // employee.games.forEach(game => {
                    //     console.log('game datetime: ', game.datetime)
                    // })
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

router.post('/scheduleGame', async(req, res, next) => {
    //******TODO: make sure you dont save duplicates*****
    try{
        const gameId = req.body.gameId;
        const employeeId = req.body.employeeId;

        await Game.updateOne({_id: gameId}, {employeeId: employeeId}, function(err, result){
            if(err){
                res.status(424).json({
                    message: "Request to /scheduleGame failed.",
                    err: err
                })
            }
        })

        await Employee.updateOne({_id: employeeId}, { $addToSet: { games: gameId } }, function(err, result){
            if(!err){
                res.status(201).json({
                    message: "Request to /scheduleGame was successful."
                })
            }
            else{
                res.status(424).json({
                        message: "Request to /scheduleGame failed.",
                        err: err
                    })
                }
        })
    }
    catch(err){
        if(err){
            res.status(424).json({
                    message: "Request to /scheduleGame failed.",
                    err: err
                })
            }
    }

})


module.exports = router;