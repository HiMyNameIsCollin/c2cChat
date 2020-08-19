const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const socket = require('socket.io')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var bcrypt = require('bcryptjs')
const moment = require('moment')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const formatMessage = require('./utils/formatMessage')

const {RoomModel, MessageModel} = require('./models/roomModel')
const UserModel = require('./models/userModel')

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))

	app.get('*', (req, res) => {
    	res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}


const db = mongoose

/*CONNECT TO DATABASE*/


const connection = "mongodb+srv://Collin:collin1234@c2c-cluster.074h5.mongodb.net/c2c?retryWrites=true&w=majority";
db.connect(process.env.MONGODB_URI || connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));



/*###########################SOCKETS####################################*/
const onlineUsers = []


io.on('connection', socket => {
	console.log('User connected')


	socket.on('userConnected', message => {
		let chatRooms
		RoomModel.find().then((result)=> {
			chatRooms = result
			const user = onlineUsers.find(user => user.user === message)
			if(user){
				user.ID = socket.id
				io.sockets.emit('userConnected', {onlineUsers: onlineUsers, rooms: chatRooms})
			} else {
				onlineUsers.push({user: message, ID: socket.id})
				io.sockets.emit('userConnected', {onlineUsers: onlineUsers, rooms: chatRooms})
			}
		})
	})

	socket.on('joinRoom', message => {
		RoomModel.find({name: message.room}).then((result) => {
			if(result !== null) {
				if(result[0].messages.length > message.length){
					const newMessages = result[0].messages.slice(message.length, result[0].messages.length)
					io.sockets.emit('joinedRoom', newMessages)
				}else {
					io.sockets.emit('joinedRoom', {})
				}
			} else {
					io.sockets.emit('joinedRoom', {})
			}
		})
	})

	socket.on('joinTempRoom', message => {
		const {user1, user2} = message
		const room = 'tempRoom' + uuidv4()
		const tempRoom = {
			name: room,
			users: [user1, user2],
			messages: [{
				name: 'Robo-Collin',
				text: 'This is a temporary chatroom that will terminate upon user disconnect',
				time: moment().format('h:mm:ss A')
			}],
		}
			io.sockets.emit('tempRoomJoined', tempRoom)

	})

	socket.on('chatMessage', message=> {
		io.sockets.emit('chatMessage', formatMessage(message.name, message.text, message.room))
		const newMessage = new MessageModel({ 
			name: message.name,
			text: message.text,
			time: moment().format('h:mm:ss A'),
		})
		RoomModel.updateOne({name: message.room}, {$push: {messages: newMessage}}).then(()=> {
			newMessage.save()
		})
	})
	

	socket.on('disconnect', () => {
		let user 
		onlineUsers.map((u, i) => {
			if(u.ID === socket.id){
				user = u.user
				onlineUsers.splice(i, 1)
			}
		})
		io.sockets.emit('userDisconnect', {user: user, onlineUsers: onlineUsers})
		console.log('User disconnected')
	})
})



/*#######################REST CALLS######################################*/


app.put('/register', (req, res) => {
	const {email, name, password} = req.body
	const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
	const emailNormalized = email.charAt(0).toLowerCase() + email.slice(1)
	const hash = bcrypt.hashSync(password)
	UserModel.findOne({name: nameCapitalized}).then(result => {
		if(result === null){
			UserModel.findOne({email: emailNormalized}).then(result => {
				if(result === null){
					const user = new UserModel({
						id: uuidv4(),
						email: emailNormalized,
						name: nameCapitalized,
						hash: hash
					})
					user.save().then(() => {
						RoomModel.updateOne({name: 'Public'}, {$push: {users: nameCapitalized}})
						.then(() => {
							if(nameCapitalized !== 'Collin'){
							const welcomeMessage = new MessageModel({
								name: 'Robo-Collin',
								text: 'Thank you for using Connect to Collin, leave me a message here and Ill get back to you asap!',
								time: moment().format('h:mm:ss A')
							})
							const room = new RoomModel({
								name: nameCapitalized,
								users: ['Collin', nameCapitalized],
								messages: [welcomeMessage]
							})
							room.save()
							}
						})
						.then(()=>{
							res.send('Success')
						})
					})
				} else {
					res.status(400).json('Credentials already in use')
				}
			})
		} else {
			res.status(400).json('Credentials already in use')
		}
	})


})


app.post('/login' , (req, res) => {
	const {email, password} = req.body
	const emailNormalized = email.charAt(0).toLowerCase() + email.slice(1)
	UserModel.findOne({email: emailNormalized}).then(result => {
		if(result !== null){
			const isValid = bcrypt.compareSync(password, result.hash)
			if(isValid){
				res.json({user: result.name})
			}else {
				res.status(400).json('Something about your credidentals were amiss')
			}
		}else {
				res.status(400).json('Something about your credidentals were amiss')
		}
	})
})


const myPort = 3000 || process.env.PORT 

http.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})