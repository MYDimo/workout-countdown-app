import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";

export default function SignIn() {
	const { login } = UserAuth();

	const [email, setEmail] = useState(null);
	const [pass, setPass] = useState(null);

	const signInHandler = (e) => {
		e.preventDefault();

		login(email, pass)
			.then((user) => console.log(user))
			.catch((error) => console.log(error));
	};

	return (
		<div className="signInWrapper">
			<form>
				<p>log in</p>
				<input
					className="auth"
					type="email"
					placeholder="Write your email"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					className="auth"
					type="password"
					placeholder="Write your password"
					onChange={(e) => {
						setPass(e.target.value);
					}}
				/>
				<button type="submit" onClick={(e) => signInHandler(e)}>
					Log in
				</button>
			</form>
		</div>
	);
}
