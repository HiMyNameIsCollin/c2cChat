import React from 'react'

const ChatMessage = ({m, loggedIn}) => {
	if(loggedIn === m.name){
		return(
		<div id='chatMessage' style={{background: "#4C6EF0"}}>
			<span>{m.name}</span> <br/>
			<div style={{background: "#4C6EF0"}}> {m.text}  </div> <br/>
			<span>{m.time} </span>
		</div> 
		)
	} else {
		return(
		<div id='chatMessage'>
			<span>{m.name}</span> <br/>
			<div> {m.text}  </div> <br/>
			<span>{m.time} </span>
		</div>
		)
	}
}

export default ChatMessage