const assert = require('assert')
const mongoose = require('mongoose')
const UserModel = require('../models/userModel')

describe('Nesting records', () => {

	it('Creates a user', done => {

		var user = new UserModel({
			id: '3',
			email: 'something@gmail.com',
			name: 'Patrick',
			hash: '1g1g313t'
		})
		user.save().then(()=> {
			UserModel.findOne({name: 'Patrick'}).then(result => {
				assert(result.name === 'Patrick')
				done()
			})
		})
	})

})