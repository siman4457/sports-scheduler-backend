const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for todo
const EmployeeSchema = new Schema({
  first_name: {
    type: String,
    required: [true, 'The employee first name field is required']
  }
});

//create model for todo
const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;