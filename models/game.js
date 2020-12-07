const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for todo
const GameSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, 'The game title field is required']
  },
  date: {
      type: Date,
      required: [true, 'The game date field is required']
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
  address:{
      type: String,
      required: [true, 'The game address field is required']
  }
});

//create model for Game
const Game = mongoose.model('game', GameSchema);

module.exports = Game;