const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	id: String,
	email: String,
	name: String,
	hash: String
})

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel