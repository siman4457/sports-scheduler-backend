const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, 'The game title field is required']
  },
  datetime: {
      type: Date,
      required: [true, 'The game date and time field is required']
  },
  ageGroup:{
      type: String,
  },
  filmType:{
      type: String,
  },
  location:{
      type: String
  },
  fieldNumber:{
      type: String
  },
  address:{
      type: String,
      required: [true, 'The game address field is required']
  },
  employeeId:{
      type: mongoose.Schema.Types.ObjectId,
  }
});

//create model for Game
const Game = mongoose.model('game', GameSchema);

module.exports = Game;