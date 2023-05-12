import mongoose from 'mongoose'

const HabitSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  days: String,
  desc: String,
  active: Boolean,
})

module.exports = mongoose.models.HabitModel || mongoose.model('HabitModel', HabitSchema)