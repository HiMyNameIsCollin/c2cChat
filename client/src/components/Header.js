import React from 'react'

const Header = ({loggedIn, room, setRoom, route, setRoute}) => {
	return (
		<div id='header'>
			{
			room !==undefined && loggedIn !== undefined && route !== 'menu' ?
			<div onClick={() => setRoom(undefined)} id="backBtn"></div> :
			null
			}
			<span> Connect </span> 
			<span className='to' style={{fontSize: '1rem'}}> to </span>
			<span className='collin'> Collin </span>
			{
			loggedIn !== undefined ?				
			<div onClick={() => {
				if(route !== 'menu'){
					setRoute('menu')
				}else{
					setRoute('main')
				}
			}} id='dropBtn'></div> :
			null
			}
		</div>
	)
}

export default Header