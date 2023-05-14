import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: String,
  image: String,
  todo: [{ title: String, done: Boolean }],
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)