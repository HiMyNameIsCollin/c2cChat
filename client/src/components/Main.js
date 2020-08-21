import React from 'react'
import ChatRoom from './ChatRoom'
import UserRooms from './UserRooms'


const Main = ({loggedIn, room, setRoom, userRooms, setUserRooms, socket, tempRooms}) => {

	const handleTypeOfRoom = (chatRoomHeight) => {
		const realRoom = userRooms.find(realRoom => realRoom.name === room)
		const tempRoom = tempRooms.find(tempRoom => tempRoom.name === room)
		if(realRoom !== undefined){
			return <ChatRoom r={realRoom} loggedIn={loggedIn} socket={socket} roomType={'room'}/>
		} else if (tempRoom !== undefined) {
			return <ChatRoom r={tempRoom} loggedIn={loggedIn} socket={socket} roomType={'temp'}/>
		} else if (tempRoom === undefined && realRoom === undefined){
			setRoom(undefined)
		}

	}

	return(
		<div id="main">
		{
			room !== undefined ?
			handleTypeOfRoom()
			:
			<UserRooms loggedIn={loggedIn} room={room} setRoom={setRoom} userRooms={userRooms} tempRooms={tempRooms}/>
			
		}
		</div>
	)
}

export default Main