const mongoose = require('mongoose')

const temperatureSchema = new mongoose.Schema({
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    date: { type: String, required: true },
  });

const Temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = Temperature;
  