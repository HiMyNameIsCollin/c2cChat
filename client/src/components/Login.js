import React, {useState} from 'react'

const Login = ({setRoute, setError, setloggedIn, setUserRooms}) => {

	const [emailInput, setEmail] = useState('')
	const [passwordInput, setPassword] = useState('')

	const handleLogin = (e) => {
		e.preventDefault()
		if(passwordInput.length > 5) {
			if(emailInput.length > 5){
				fetch('https://connect2collin.herokuapp.com/login', {
					method: 'post',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						email: emailInput,
						password: passwordInput
					})
				})
				.then(response => response.json())
				.then(response => {
					if(typeof response === 'object') {
						setloggedIn(response.user)
					} else {
						setError(response)
					}
				})
				.catch(err => console.log)
			} else {
				setError('Valid email required')
			}
		} else {
			setError('Password field requires at least 6 characters')
		}
	}

	return (
		<main class="pa4 black-80" id='login'>
		  <form onSubmit={handleLogin} class="measure center">
		    <fieldset id="sign_up" class="ba b--transparent ph0 mh0">
		      <legend class="f4 fw6 ph0 mh0">Sign In</legend>
		      <div class="mt3">
		        <label class="db fw6 lh-copy f6" for="email-address">Email</label>
		        <input onChange={(e) => setEmail(e.target.value)} class="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
		      </div>
		      <div class="mv3">
		        <label class="db fw6 lh-copy f6" for="password">Password</label>
		        <input onChange={(e) => setPassword(e.target.value)} class="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
		      </div>
		      {/*<label class="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/> Remember me</label>*/}
		    </fieldset>
		    <div class="">
		      <input onClick={handleLogin} class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in"/>
		    </div>
		    <div class="lh-copy mt3">
		      <a onClick={(e) => {
		      	e.preventDefault()
		      	setRoute('register')
		      }} href="#0" class="f6 link dim black db">Sign up</a>
		    </div>
		  </form>
		</main>
	)
}

export default Login