const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: {
    type: String,
    required: [true, 'The employee first name field is required']
  },
  last_name: {
    type: String,
    required: [true, 'The employee last name field is required']
  },
  age: {
    type: Number
  },
  address: {
    type: String,
    required: [true, 'An address is required']
  },
  phoneNumber: {
    type: Number,
    require: [true, 'A phone number is required']
  },
  canSetUp: {
    type: Boolean,
    required: [true, 'canSetUp is required']
  },
  needsTraining: {
    type: Boolean,
    required: [true, 'needsTraining is required']
  },
  canFilmSoccer: {
    type: Boolean,
    required: [true, 'canFilmSoccer is required']
  },
  canFilmFootball: {
    type: Boolean,
    required: [true, 'canFilmFootball is required']
  },
  canLiveStream: {
    type: Boolean,
    required: [true, 'canLiveStream is required']
  },
  canVeo: {
    type: Boolean,
    required: [true, 'canVeo is required']
  },
  canManualRecord: {
    type: Boolean,
    required: [true, 'canManualRecord is required']
  },
  //Array of dates the employee is available. Remove dates as games are assigned.
  availability: {
    type: [Date],
  },
  games: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

//create model for Employee
const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;