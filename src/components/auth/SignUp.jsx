import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";
import errorFormat from "../../utils/errorFormat";

export default function SignUp({ setLoginState }) {
	const { createUser } = UserAuth();

	const [email, setEmail] = useState(null);
	const [pass, setPass] = useState(null);
	const [error, setError] = useState(null);
	const [rePass, setRePass] = useState(null);

	const writeUserData = (email, userId) => {
		const reference = ref(db, "users/" + userId);

		set(reference, {
			email,
			userId,
		});
	};

	const signUpHandler = (e) => {
		e.preventDefault();

		if (!email || !pass || !rePass ) {
			setError(`Error - please fill out all inputs`);
		} else if (pass !== rePass) {
			setError(`Error - passwords should be the same`);
		} else {
			createUser(email, pass)
				.then((response) => {
					const userId = response.user.uid;
					writeUserData(email, userId);
				})
				.catch((error) => {
					setError(`Error - ${errorFormat(error)}`);
				});
		}
	};

	return (
		<div className="signInWrapper">
			<form>
				{error && <p style={{ color: "#f76262" }}>{error}</p>}
				<p>create a profile</p>
				<input
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
					type="password"
					placeholder="Retype your password"
					onChange={(e) => {
						setRePass(e.target.value);
					}}
				/>
				<button type="submit" onClick={(e) => signUpHandler(e)}>
					Create
				</button>
				<p className="dimmedParagraph" onClick={() => setLoginState(true)}>
					back to login
				</p>
			</form>
		</div>
	);
}
