const moment = require('moment')

function formatMessage(name, text, room) {
	return {
		name, 
		text,
		time: moment().format('h:mm:ss A'),
		room,
	}
}

module.exports = formatMessage;