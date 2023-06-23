import React, { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../../icons/close-icon.svg";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { UserAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { onValue, ref, push, child, remove } from "firebase/database";
import formatDuration from "../../utils/formatDuration.js";

const Profile = ({ toggleClock }) => {
	const { user, logout } = UserAuth();

	const [userActivities, setUserActivities] = useState([]);
	const [newActivityName, setNewActivityName] = useState("");

	useEffect(() => {
		if (user) {
			const query = ref(db, `users/${user.uid}/activities`);

			return onValue(query, (snapshot) => {
				const data = snapshot.val();
				if (snapshot.exists()) {
					setUserActivities(data);
				}
			});
		} else {
			return;
		}
	}, [user]);

	const logoutHandler = async () => {
		logout()
			.then(() => {
				console.log("Sign-out successful");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const addNewActivity = () => {
		const timestampOfCreation = Date.now();

		const newActivityObj = {
			activityName: newActivityName,
			totalDuration: 0,
			entries: {},
			createdOn: timestampOfCreation,
		};

		const userRef = ref(db, `users/${user.uid}/`);
		const userActivitiesRef = child(userRef, "activities");
		const newActivityRef = push(userActivitiesRef, newActivityObj);
		setNewActivityName("");
	};

	const deleteActivity = (e) => {
		const activityId = e.target.dataset.id;

		const userRef = ref(db, `users/${user.uid}/`);
		const activityRef = child(userRef, `activities/${activityId}`);
		remove(activityRef);
		console.log(e.target.dataset.id);
	};

	// const formatDuration = (milliseconds) => {
	// 	const seconds = Math.floor((milliseconds/1000) % 60);
	// 	const minutes = Math.floor((milliseconds/1000/60) % 60);
	// 	const hours = Math.floor((milliseconds/1000/60/60) % 60);

	// 	return `${hours.toString()}h and ${minutes.toString()}m`
	// }

	return (
		<div className="toolBody">
			<CloseIcon
				className="closeTool"
				onClick={toggleClock}
				alt="Back to main menu"
			/>
			{user ? (
				<>
					<p>Hello, {user.email}</p>
					{Object.keys(userActivities).length ? (
						<>
							{Object.entries(userActivities).map(([id, activity]) => (
								<div key={id}>
									<p>
										{activity.activityName} -{" "}
										{formatDuration(activity.totalDuration)}
									</p>
									<button data-id={id} onClick={(e) => deleteActivity(e)}>
										delete
									</button>
								</div>
							))}
						</>
					) : (
						<p>No activities yet</p>
					)}
					<input
						className="auth"
						placeholder="add activity to track"
						onChange={(e) => setNewActivityName(e.target.value)}
						value={newActivityName}
					/>
					<button onClick={addNewActivity}>Add</button>
					<button onClick={logoutHandler}>Logout</button>
				</>
			) : (
				<>
					<SignIn />
					<SignUp />
				</>
			)}
		</div>
	);
};

export default Profile;
