const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
	name: String,
	text: String,
	time: String,
})

const RoomSchema = new Schema({
	name: String,
	users: Array,
	messages: [MessageSchema]
})

const RoomModel = mongoose.model('room', RoomSchema)
const MessageModel = mongoose.model('messages', MessageSchema)

module.exports = {RoomModel, MessageModel}