import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import errorFormat from "../../utils/errorFormat";


export default function SignIn({ setLoginState }) {
	const { login } = UserAuth();

	const [email, setEmail] = useState(null);
	const [pass, setPass] = useState(null);
	const [error, setError] = useState(null);

	const signInHandler = (e) => {
		e.preventDefault();

		login(email, pass)
			.then((user) => console.log(user))
			.catch((error) => {
				setError(`Error - ${errorFormat(error)}`);
			});
	};

	return (
		<div className="signInWrapper">
			<form>
				{error && <p style={{color: '#f76262'}}>{error}</p>}
				<p>log in</p>
				<input
					type="email"
					placeholder="Write your email"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					type="password"
					placeholder="Write your password"
					onChange={(e) => {
						setPass(e.target.value);
					}}
				/>
				<button type="submit" onClick={(e) => signInHandler(e)}>
					Log in
				</button>
				<p className="dimmedParagraph" onClick={() => setLoginState(false)}>
					don't have a profile?
				</p>
			</form>
		</div>
	);
}
