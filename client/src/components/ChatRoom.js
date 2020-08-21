import React, {useState, useRef, useEffect} from 'react'
import ChatMessage from './ChatMessage'

const ChatRoom = ({r, loggedIn, socket, roomType}) => {
	const [chatInput, setChatInput] = useState('')
	const [roomMessages, setRoomMessages] = useState([])
	const formRef = useRef()

	const lastMessage = useRef()


	useEffect(() => {
		setRoomMessages(r.messages)
		socket.emit('joinRoom', {room: r.name, length: r.messages.length})
	}, [])

	useEffect(() => {
		socket.on('joinedRoom', payload => {
			if(payload.length !== undefined){
				setRoomMessages(previous => [...previous.concat([...payload])])
			}
		})
	},[socket])

	useEffect(() => {
		socket.on('chatMessage', payload => {
			if(payload.room === r.name){
				const messagee = {
					name: payload.name,
					text: payload.text,
					time: payload.time
				}
				setRoomMessages(messages => [...messages, messagee])
			}
		})
	}, [socket])

	useEffect(() => {
		lastMessage.current.scrollIntoView({ behavior: 'smooth' })
	},[roomMessages])

	const handleChatMessage = (e) => {
		e.preventDefault()
		socket.emit('chatMessage', {name: loggedIn, text: chatInput, room: r.name})
		setChatInput('')
		formRef.current.value = ''
	}

	

	return (
		<div id='chatRoom'>
			<div id='roomHeader'>
			{
				roomType === 'room' ?
				<p>
				{	r.name === 'Public' ? r.name : loggedIn === 'Collin' ? r.name : 'Collin'	}
				</p> :
				<p>{r.users[0]} + {r.users[1]}</p>
			}
			</div>
			<div id="chatContainer">
			{
				roomMessages.map((m, i) => {
					return <ChatMessage m={m} loggedIn={loggedIn}/>
				})
			}
			<div ref={lastMessage}></div>
			</div>
		<form onSubmit={handleChatMessage} id='chatForm'>
			<input ref={formRef} onChange={(e) => setChatInput(e.target.value)} type="text" style={{width: '75%', padding: '0 .5em'}}/>
			<input onClick={handleChatMessage} type="submit" value="Send" style={{width: '25%'}}/>
		</form>
		</div>
	)
}

export default ChatRoom