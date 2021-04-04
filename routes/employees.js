const express = require ('express');
const router = express.Router();
const Employee = require('../models/employee');
const mongoose = require('mongoose');
const { response } = require('express');
const Game = require('../models/game');

router.get('/getEmployees', (req, res, next) => {
    Employee.find({}, function(err,employees){
        if(!err){
        res.status(200).json({
            message: "GET request to /getEmployees succeeded",
            employees: employees
        });
    }
    else{
        res.status(424).json({
            message: "GET request to /getEmployees failed"
        });
    }
    });
});

router.get('/getEmployee/:id',(req, res) => {
    Employee.findById(req.params.id, function(err, employee){
        if(!err && employee !== null){
            res.status(200).json({
                message: "GET request to getEmployee succeeded",
                employee: employee
            });
        }
        else if(!err && employee === null){
            res.status(404).json({
                message: "404: Employee not found"
            });
        }
        else{
            res.status(424).json({
                message: "GET request to getEmployee failed"
            });
        }
    });
});

router.post('/createEmployee', async(req, res) => {
    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber.replace(/\s/g,''),
        canSetUp: req.body.canSetUp,
        needsTraining: req.body.needsTraining,
        canFilmSoccer: req.body.canFilmSoccer,
        canFilmFootball: req.body.canFilmFootball,
        canLiveStream: req.body.canLiveStream,
        canVeo: req.body.canVeo,
        canManualRecord: req.body.canManualRecord
    });

    try{
        //Validate request
        // await Employee.validate(employee);
        
        employee.save().then(()=>{
            res.status(201).json({
                message: "POST request to /createEmployee succeeded",
                createdEmployee: employee
            });
        });
        
    }
    catch(err){
        err instanceof mongoose.Error.ValidationError;
        Object.keys(err.errors);
        res.status(424).json({
            message: "POST request to /createEmployee failed"
        });
    }
    
});

router.get('/getAvailability',(req, res, next) => {
    Employee.find({}, function(err, employees){
        if(!err){
            let response = [];
            employees.forEach(employee => {
                let name = employee.first_name + employee.last_name;
                response.push({[name]: employee.availability});
            });
            res.status(200).json({
                message: "GET request to /getAvailability succeeded", 
                availability: response
            });
        }
        else{
            res.status(424).json({
                message: "GET request to /getAvailability failed."
            });
        }
    });
});

router.post('/createAvailability', async (req, res) => {
    Employee.findById({_id: req.body.employee._id}, function(err, employee){
        if(!err){
            let new_availability = req.body.new_availability;
            if(!employee.availability.includes(new_availability)){
                employee.availability.push(new_availability);
                employee.save().then( () => {
                    res.status(201).json({
                        message: "POST request to /createAvailability succeeded",
                        availability: employee.availability
                    });
                });
                }
            else{
                res.sendStatus(424).json({
                    message: "POST request to /createAvailability failed. Duplicate date was found.",
                });
            }
        }
        else{
            console.log(err);
            res.status(424).json({
                message: "POST request to /createAvailability failed",
                err: err
            });
        }
    });
    
});

router.post('/removeAvailability', (req, res) => {
    const availabilityToRemove = req.body.availability;
    const result = Employee.updateOne({_id: req.body.employee._id}, {$pullAll:{availability:[availabilityToRemove]}}, function(err, result){
        if(!err){
            res.status(201).json({
                message: "POST request to /removeAvailability succeeded.",
                
            });
        }
        else{
            res.status(400).json({
                message: "POST request to /removeAvailability failed.",
                err: err
                
            });
        }
    });
});

router.post("/updateEmployee", async (req, res) => {
    try{
        await Employee.updateOne(
            { _id: req.body._id},
            { $set: {
                first_name: req.body.first_name,    
                last_name: req.body.last_name,
                age: req.body.age,
                address: req.body.address,
                canSetUp: req.body.canSetUp,
                needsTraining: req.body.needsTraining,
                canFilmSoccer: req.body.canFilmSoccer,
                canFilmFootball: req.body.canFilmFootball,
                canLiveStream: req.body.canLiveStream,
                canVeo: req.body.canVeo,
                canManualRecord: req.body.canManualRecord,
                phoneNumber: req.body.phoneNumber
                }
            }
        );

        res.status(200).json({
                message: "Sucessfully updated"
            });
    }
    catch(err){
        console.log("Error: ", err);
        res.status(424).json({
            message: "POST request to /updateEmployee failed",
            err: err
        });

    }
});

router.delete('/deleteEmployee/:id', async (req, res) => {
    try{
        //First, free up games currently assigned to this emplpoyee
        let employee = await Employee.findById({"_id": req.params.id});
        let game_ids = employee.games;

        await Game.updateMany(
            {_id: { $in: game_ids}},
            {$unset: {
                employeeId: ""
            }}
        );

        //Second, delete this employee
        await Employee.findOneAndDelete({"_id": req.params.id}, function(err){
            if(!err){
                res.status(200).json({
                    message: "Sucessfully deleted",
                    games_freed: employee.games,
                });
            }
            else{
                console.log("ERROR: ", err);
                res.status(424).json({
                    message: "POST request to /createAvailability failed",
                    err: err
                });
            }
        });
    }
    catch(err){
        console.log("ERROR: ", err);
        res.status(424).json({
            message: "POST request to /createAvailability failed",
            err: err
        });
    }
    
});


router.get('/getGamesByEmployee/:id', async (req, res) => {
    try{
        let employee = await Employee.findById({"_id": req.params.id});
        let game_ids = employee.games;
        let games = await Game.find({ _id: { $in: game_ids }});
        res.status(200).json(
            {games: games}
        );
    }
    catch(err){
        console.log("ERROR:", err);
        res.status(424).json({
            message:"GET request to /getGamesByEmployee failed",
            err: err
        });
    }
});

module.exports = router;