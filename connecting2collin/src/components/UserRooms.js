import React from 'react'

const UserRooms = ({loggedIn, userRooms, room, setRoom, tempRooms}) => {
	return (
		<div id='userRooms'>
		{
			userRooms.map((r, i) => {
				return(
					<div onClick={() => setRoom(r.name)}>
						<p>{	r.name === 'Public' ? r.name : loggedIn === 'Collin' ? r.name : 'Collin'	}</p>
					</div>
				)
			})
		}
		{
			tempRooms.length > 0 ?
			tempRooms.map((r, i) => {
				return(
					<div onClick={() => setRoom(r.name)} style={{background: '#C099E3'}}>
						<p>{r.users[0]} + {r.users[1]}</p>
					</div>
				)
			}) :
			null
		}
		</div>
	)
}

export default UserRooms