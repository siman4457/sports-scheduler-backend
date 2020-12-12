const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionsSchema = new Schema({
  type: {
    type: String,
    required: [true, "The name of the option(s) is required"]
  },

  ageGroups: {
    type: Array,
  },
});

//create model for Game
const Options = mongoose.model('option', OptionsSchema);

module.exports = Options;