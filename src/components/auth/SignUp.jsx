import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";

export default function SignUp() {
	const {createUser} = UserAuth();

	const [email, setEmail] = useState(null);
	const [pass, setPass] = useState(null);
	// const [rePass, setRePass] = useState(null);

	const writeUserData = (email, userId) => {
		const reference = ref(db, 'users/' + userId);

		set(reference, {
			email,
			userId,
		})
	}

	const signUpHandler = (e) => {
		e.preventDefault();

		createUser(email, pass)
			.then((response) => {
				const userId = response.user.uid
				writeUserData(email, userId);
			})
			.catch((error) => console.log(error));

	};

	return (
		<div className="signInWrapper">
			<form>
				<p>create profile</p>
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
				<input
					className="auth"
					type="password"
					placeholder="Retype your password"
					onChange={(e) => {
						// setRePass(e.target.value);
					}}
				/>
				<button type="submit" onClick={(e) => signUpHandler(e)}>Create</button>
			</form>
		</div>
	);
};
