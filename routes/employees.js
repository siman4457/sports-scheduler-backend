const express = require ('express');
const router = express.Router();
const Employee = require('../models/employee');
const mongoose = require('mongoose');
const { response } = require('express');

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
        })
    }
    });
});

router.get('/getEmployee',(req, res) => {
    Employee.find({_id:req.body._id}, function(err, employee){
        if(!err){
            res.status(200).json({
                message: "GET request to getEmployee succeeded",
                employee: employee
            })
        }
        else{
            res.status(424).json({
                message: "GET request to getEmployee failed"
            })
        }
    })
})

router.post('/createEmployee', async(req, res, next) => {
    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
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
        canManualRecord: req.body.canManualFilm
    })
    try{
        //Validate request
        await Employee.validate(employee);
        
        employee.save().then(result=>{
            // console.log(result)
            res.status(201).json({
                message: "POST request to /createEmployee succeeded",
                createdEmployee: employee
            });
        })
        
    }
    catch(err){
        err instanceof mongoose.Error.ValidationError;
        Object.keys(err.errors)
        
        // console.log(err)
        res.status(424).json({
            message: "POST request to /createEmployee failed"
        })
    }
    
});

router.get('/getAvailability',(req, res, next) => {
    Employee.find({}, function(err, employees){
        if(!err){
            response = []
            employees.forEach(employee => {
                let name = eployee.first_name + employee.last_name
                response.push({[name]: employee.availability})
            })
            res.status(200).json({
                message: "GET request to /getAvailability succeeded", 
                availability: response
            })
        }
        else{
            res.status(424).json({
                message: "GET request to /getAvailability failed."
            })
        }
    })
})

router.delete('/employees/:id', (req, res, next) => {
    Employee.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
});

module.exports = router;