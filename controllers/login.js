const handleLogin = (bcrypt, UserModel) => (req, res) => {
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
}

module.exports = {
  handleLogin: handleLogin
}