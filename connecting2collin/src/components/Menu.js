import React, {useState, useRef} from 'react'

const Menu = ({onlineUsers, handleLogOut, loggedIn, setRoute, room, setRoom, socket, tempRooms}) => {

	const [userInteract, setUserInteract] = useState(undefined)
	const interactCard = useRef()

	const handleUserInteract = (e, command) => {
		e.preventDefault()
		interactCard.current.style.animation = 'slit-out-vertical 0.5s ease-in both'
		setTimeout(()=> {
			setUserInteract(undefined)
		}, 250);
		if(command === 'yes'){
			if(loggedIn === 'Collin') {
				setTimeout(() => {
					setRoute('main')
					setRoom(userInteract)
				}, 300)
			} else {
				if(userInteract === 'Collin'){
					setTimeout(() => {
						setRoute('main')
						setRoom(loggedIn)
					}, 300)
				} else {
					const tempRoom = tempRooms.find(tempRoom => tempRoom.name === room)
					if(tempRoom !== undefined) {
						setRoute('main')
						setRoom(tempRoom.name)
					} else {
						socket.emit('joinTempRoom', {user1: loggedIn, user2: userInteract})
						setRoute('main')
						setRoom(undefined)
					}
				}
			}
		}
	}

	return (
		<div id='menu'>
		{
			userInteract !== undefined ?
			<div onClick={() => {
				interactCard.current.style.animation = 'slit-out-vertical 0.5s ease-in both'
				setTimeout(()=> {
					setUserInteract(undefined)
				}, 250);
			}} id="userInteract">
				<div ref={interactCard} id='userInteractCard'>
					<p>Send {userInteract} a message? </p>
					<div>
						<input onClick={(e) => handleUserInteract(e, 'no')} type="button" value='Nope'/>
						<input onClick={(e) => handleUserInteract(e, 'yes')} type="button" value='You betcha'/>
					</div>
				</div>
			</div> : 
			null
		}
			<h3>Online users</h3>
			<div id="onlineUsersContainer">
			{
				onlineUsers.map((u, i) => {
					return(
						<div onClick={() => {
							if(u.user === loggedIn){

							}else {
								setUserInteract(u.user)
							}
						}}>
							<p>
								{u.user}
							</p>
						</div>
					)
				})
			}
			</div>
			<input type="submit" value='Log out' onClick={handleLogOut}/>
		</div>
	)
}

export default Menu