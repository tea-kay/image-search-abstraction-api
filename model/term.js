const mongoose = require('mongoose')
const Schema = mongoose.Schema

const termSchema = new Schema({
  term: String,
}, { timestamps: true })

const ModelClass = mongoose.model('term', termSchema)
module.exports = ModelClass
