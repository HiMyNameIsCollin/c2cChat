const mongoose = require('mongoose')
const Schema = mongoose.Schema


const RoomSchema = new Schema({
	name: String,
	users: Array,
	messages: []
})

const RoomModel = mongoose.model('room', RoomSchema)


module.exports = RoomModel