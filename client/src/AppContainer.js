import React, {useState, useEffect} from 'react'
import Main from './components/Main'
import Login from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Menu from './components/Menu'
import socketIOClient from 'socket.io-client'
import Loader from 'react-loader-spinner'

const AppContainer = () => {
	const [route, setRoute] = useState('login')
	const [userRooms, setUserRooms] = useState([])
	const [tempRooms, setTempRooms] = useState([])
	const [onlineUsers, setOnlineUsers] = useState([])
	const [error, setError] = useState(undefined)
	const [loggedIn, setloggedIn] = useState(undefined)
	const [socket, setSocket] = useState(undefined)
	const [room, setRoom] = useState(undefined)
	const [loading, setLoading] = useState(false)

/* SET SOCKET AFTER LOGIN*/
	useEffect(() => {
		if(loggedIn !== undefined) {
			setSocket(socketIOClient('https://connect2collin.herokuapp.com/'))
		}
	},[loggedIn])

/*EMIT USER CONNNECTED*/
	useEffect(() => {
		if(socket !== undefined){
			socket.emit('userConnected', loggedIn)
			setRoute('main')
		}
	},[socket])

/*SET TEMP ROOMS*/
	useEffect(() => {
		if(socket !== undefined){
			socket.on('tempRoomJoined', payload => {
				setTempRooms(previous => [...tempRooms.concat({...payload})])
			})
		}
	},[socket, tempRooms])

/*SET ONLINE USERS & SET ROOMS*/
	useEffect(() => {
		if(socket !== undefined){
			socket.on('userConnected', payload => {
				setLoading(false)
				setOnlineUsers(previous => previous = payload.onlineUsers)
				let rooms = []
				payload.rooms.forEach((r, i) => {
					if(r.users.includes(loggedIn)){
						rooms.push(r)
					}
				})
				setUserRooms(rooms)
			})
			socket.on('userDisconnect', payload =>{
				setOnlineUsers(payload.onlineUsers)
				handleTempRoomRemoval(payload.user, tempRooms)
			})
		}
	},[socket, tempRooms])

	function handleTempRoomRemoval(user, rooms){
		console.log(rooms)
		if(rooms !== undefined && rooms.length !== 0) {
			const newRooms = [...rooms]
			newRooms.forEach((r, i) => {
				if(r.users.includes(user)){
					newRooms.splice(i, 1)
				}
			})
			setTempRooms(newRooms)
		}
	}


	const handleLogOut = () => {
		socket.disconnect()
		setSocket(undefined)
		setloggedIn(undefined)
		setUserRooms([])
		setOnlineUsers([])
		setRoom(undefined)
		setRoute('login')
	}

	return(
		<div id="appContainer">
		{
			loading === true ? 
			<div id='loading'> 
				<Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
	        </div> : 
			null
		}
		{	
			error !== undefined ? 
			<div onClick={() => {
				document.getElementById('errorCard').style.animation = 'slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'
				setTimeout(() =>{
					setError(undefined)
				}, 250);
			}} id="error"><div id='errorCard'><p> {error} </p></div></div> 
			: null    
		}
			<Header loggedIn={loggedIn} route={route} setRoute={setRoute} room={room} setRoom={setRoom} />
		{
			route === 'login' ?
			<Login setRoute={setRoute} setError={setError} setLoading={setLoading} setloggedIn={setloggedIn} setUserRooms={setUserRooms}/> :
			route === 'register' ?
			<Register setRoute={setRoute} setError={setError}/> :
			route === 'main' && userRooms.length !== 0 ?
			<Main loggedIn={loggedIn} room={room} setRoom={setRoom} userRooms={userRooms} setUserRooms={setUserRooms} socket={socket} tempRooms={tempRooms}/> :
			route === 'menu' ?
			<Menu onlineUsers={onlineUsers} handleLogOut={handleLogOut} loggedIn={loggedIn} setRoute={setRoute} room={room} setRoom={setRoom} socket={socket} tempRooms={tempRooms}/> :
			null
		}
		</div>
	)
}





export default AppContainer