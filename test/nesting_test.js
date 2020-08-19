const assert = require('assert')
const mongoose = require('mongoose')
const RoomModel = require('../models/roomModel')

describe('Nesting records', () => {

	it('Creates a room with sub', done => {

		var room = new RoomModel({
			name: 'Collin',
			users: ['Collin', 'Ringo'],
			messages: [{name: 'Collin', text: 'Testing', time: '5:55AM'}]
		})

		room.save().then(()=> {
			RoomModel.findOne({name: 'Collin'}).then(result => {
				assert(result.messages.length === 1)
				done()
			})
		})

	})

})