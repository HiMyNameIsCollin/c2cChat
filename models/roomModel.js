const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
	name: String,
	text: String,
	time: String
})


const RoomSchema = new Schema({
	name: String,
	users: Array,
	messages: Array
})

const MessageModel = mongoose.model('message', MessageSchema)
const RoomModel = mongoose.model('room', RoomSchema)


module.exports = {
	RoomModel: RoomModel,
	MessageModel: MessageModel
}