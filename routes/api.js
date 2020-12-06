const express = require ('express');
const router = express.Router();
const Employee = require('../models/employee');

router.get('/employees', (req, res, next) => {
    Employee.find({}, 'first_name')
    .then(data => res.json(data))
    .catch(next)
});

router.post('/employees', (req, res, next) => {
    if(req.body.first_name){
        Employee.create(req.body)
        .then(res.json(data))
        .catch(next)
    }
    else{
        res.json({err: "The input field is empty"});
    }
});

router.delete('/employees/:id', (req, res, next) => {
    Employee.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)

});

module.exports = router;