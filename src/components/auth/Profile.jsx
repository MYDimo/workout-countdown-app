import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as CloseIcon } from "../../icons/close-icon.svg";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { UserAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { onValue, ref, push, child, remove, update } from "firebase/database";
import formatDuration from "../../utils/formatDuration.js";

const Profile = ({ toggleClock }) => {
	const { user, logout } = UserAuth();

	const [userActivities, setUserActivities] = useState([]);
	const [newActivityName, setNewActivityName] = useState("");
	const [renameInput, setRenameInput] = useState("n/a");
	const [renameOrDone, setRenameOrDone] = useState("rename");
	const [isLoginActive, setLoginState] = useState(true);

	const renamingIsActive = useRef(false);

	useEffect(() => {
		if (user) {
			const query = ref(db, `users/${user.uid}/activities`);

			return onValue(query, (snapshot) => {
				const data = snapshot.val();
				if (snapshot.exists()) {
					setUserActivities(data);
				} else {
					setUserActivities([]);
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
		push(userActivitiesRef, newActivityObj);
		setNewActivityName("");
	};

	const deleteActivity = (e) => {
		const activityId = e.target.dataset.id;

		const userRef = ref(db, `users/${user.uid}/`);
		const activityRef = child(userRef, `activities/${activityId}`);
		remove(activityRef);
	};

	const renameActivityTrigger = (e) => {
		if (!renamingIsActive.current) {
			console.log(renamingIsActive.current);
			e.target.parentNode.firstChild.removeAttribute("readonly");
			e.target.parentNode.firstChild.focus();
			setRenameInput(e.target.parentNode.firstChild.value);
			e.target.parentNode.firstChild.value = renameInput;
			renamingIsActive.current = true;
			setRenameOrDone("done");
		} else {
			renamingIsActive.current = false;
			setRenameInput("n/a");
			setRenameOrDone("rename");
			e.target.parentNode.firstChild.setAttribute("readonly", true);
		}
	};

	const renameInputHandler = (e) => {
		console.log(renamingIsActive.current);
		setRenameInput(e.target.value);
	};

	const renameActivityInDb = (e) => {
		if (renamingIsActive.current) {
			console.log(renamingIsActive.current);
			const activityId = e.target.dataset.id;

			const userRef = ref(db, `users/${user.uid}/`);
			const activityRef = child(userRef, `activities/${activityId}/`);

			update(activityRef, { activityName: renameInput });
			setRenameInput("n/a");
			setRenameOrDone("rename");
		}
	};

	return (
		<div className="toolBody">
			<CloseIcon
				className="closeTool"
				onClick={toggleClock}
				alt="Back to main menu"
			/>
			{user ? (
				<>
					<div>
						<h3>Hello, {user.email}</h3>
						<button onClick={logoutHandler}>Logout</button>
					</div>
					{Object.keys(userActivities).length ? (
						<>
							<h3>Activities ⤵️</h3>
							<div className="activitiesWrapper">
								{Object.entries(userActivities).map(([id, activity]) => (
									<div key={id} className="activityCard">
										<input
											data-id={id}
											className=""
											value={
												renameInput !== "n/a"
													? renameInput
													: renameInput === "n/a"
													? activity.activityName
													: renameInput
											}
											onChange={(e) => renameInputHandler(e)}
											onBlur={(e) => renameActivityInDb(e)}
											readOnly
										/>
										<p> - {formatDuration(activity.totalDuration)}</p>
										<div className="activityCardActions">
											<button data-id={id} onClick={(e) => deleteActivity(e)}>
												delete
											</button>
											<button
												data-id={id}
												onClick={(e) => renameActivityTrigger(e)}
											>
												{renameOrDone}
											</button>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<p>No activities yet</p>
					)}
					<div className="newActivityWrapper">
						<input
							placeholder="add activity to track"
							onChange={(e) => setNewActivityName(e.target.value)}
							value={newActivityName}
						/>
						<button onClick={addNewActivity}>Add</button>
					</div>
				</>
			) : (
				<>
					{isLoginActive ? (
						<SignIn setLoginState={setLoginState} />
					) : (
						<SignUp setLoginState={setLoginState} />
					)}
				</>
			)}
		</div>
	);
};

export default Profile;
