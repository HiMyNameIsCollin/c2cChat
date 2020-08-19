const mongoose = require('mongoose')


before(function(done){
	mongoose.connect('mongodb://localhost/c2c')
	mongoose.connection.once('open', () => {
		console.log(123)
		done()
	}).on('error', (error) => {
		console.log(321)
	})



})




