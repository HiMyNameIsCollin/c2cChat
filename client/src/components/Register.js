import React, {useState} from 'react'

const Register = ({setRoute, setError}) => {
	const [emailInput, setEmail] = useState('')
	const [nameInput, setName] = useState('')
	const [passwordInput, setPassword] = useState('')
	const [confirmInput, setConfirm] = useState('')

	const handleRegister = (e) => {
		e.preventDefault()
		if(passwordInput.length > 5) {
			if(nameInput.length > 0) {
				if(passwordInput === confirmInput){
					fetch('http://localhost:3000/register', {
						method: 'put',
						headers: {'Content-Type' : 'application/json'},
						body: JSON.stringify({
							name: nameInput,
							email: emailInput,
							password: passwordInput
						})
					})
					.then(response => response.text())
					.then(response => {
						if(response === 'Success') {
							setRoute('login')
						} else {
							setError(response)
						}
					})
				}else {
					setError('Passwords do not match')
				}	
			} else {
				setError('Name field required')
			}		
		} else {
			setError('Password requires at least 6 characters')
		}
	}


	return (
		<main class="pa4 black-80" id='register'>
		  <form onSubmit={handleRegister} class="measure center">
		    <fieldset id="sign_up" class="ba b--transparent ph0 mh0">
		      <legend class="f4 fw6 ph0 mh0">Register</legend>
		      <div class="mt3">
		        <label class="db fw6 lh-copy f6" for="email-address">Email</label>
		        <input onChange={(e) => {setEmail(e.target.value)}} class="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
		      </div>
		      <div class="mt3">
		        <label class="db fw6 lh-copy f6" for="name">Name</label>
		        <input onChange={(e) => {setName(e.target.value)}} class="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" required pattern="[a-zA-Z\.]+"  type="name" name="name" id="name"/>
		      </div>
		      <div class="mv3">
		        <label class="db fw6 lh-copy f6" for="password">Password</label>
		        <input onChange={(e) => {setPassword(e.target.value)}} class="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
		      </div>
		      <div class="mv3">
		        <label class="db fw6 lh-copy f6" for="confirmPassword">Confirm password</label>
		        <input onChange={(e) => {setConfirm(e.target.value)}} class="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="confirmPassword"  id="confirmPassword"/>
		      </div>
		    </fieldset>
		    <div class="">
		      <input onClick={handleRegister} class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register"/>
		    </div>
		    <div class="lh-copy mt3">
		      <a onClick={(e) => {
		      	e.preventDefault()
		      	setRoute('login')
		      }} href="#0" class="f6 link dim black db">Sign In</a>
		    </div>
		  </form>
		</main>
	)
}

export default Register