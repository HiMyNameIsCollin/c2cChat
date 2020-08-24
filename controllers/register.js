const handleRegister = (req, res, bcrypt, UserModel, RoomModel) => {
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
}




module.exports = {
  handleRegister: handleRegister
};
