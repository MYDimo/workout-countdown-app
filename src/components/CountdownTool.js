import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as CloseIcon } from "../icons/close-icon.svg";
import { ReactComponent as StartIcon } from "../icons/start-icon.svg";
import { ReactComponent as PauseIcon } from "../icons/pause-icon.svg";
import { ReactComponent as BackIcon } from "../icons/back-icon.svg";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { onValue, ref, push, child, update } from "firebase/database";
import formatDuration from "../utils/formatDuration.js";

export default function CountdownTool({ toggleCountdown }) {
	const { user } = UserAuth();
	const [userActivities, setUserActivities] = useState([]);

	const [countdown, setCountdown] = useState(`00:00:00`);
	const [isPaused, setIsPaused] = useState(false);
	const [inputTime, setInputTime] = useState({
		hours: null,
		minutes: null,
		seconds: null,
	});
	const [areInputsReady, setAreInputsReady] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [isOver, setIsOver] = useState(false);

	const deltaMax = useRef(0);
	const inputInMilliseconds = useRef(0);
	const pause = useRef(false);
	const pauseTimestamp = useRef(0);
	const pauseElapsed = useRef(0);
	const goBackToInputs = useRef(false);

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

	useEffect(() => {
		if (
			inputTime.hours !== null &&
			inputTime.minutes !== null &&
			inputTime.seconds !== null
		) {
			setAreInputsReady(true);
		} else {
			setAreInputsReady(false);
		}
	}, [inputTime]);

	const countDownStart = () => {
		setIsRunning(true);
		goBackToInputs.current = false;
		setIsPaused(true);

		if (pause.current) {
			pause.current = false;
		}
		if (pauseTimestamp.current !== 0) {
			pauseElapsed.current = Math.abs(Date.now() - pauseTimestamp.current);
			deltaMax.current += pauseElapsed.current;
			pauseTimestamp.current = 0;
		}

		const animate = () => {
			if (deltaMax.current === 0) {
				inputInMilliseconds.current =
					+inputTime.minutes * 60000 +
					inputTime.seconds * 1000 +
					inputTime.hours * 3600000;

				deltaMax.current = Date.now() + inputInMilliseconds.current + 1000;
			}
			const difference = Math.abs(Date.now() - deltaMax.current);
			const differenceConverted = new Date(difference)
				.toISOString()
				.slice(11, 19);
			setCountdown(() => differenceConverted);
			let countDownId = requestAnimationFrame(animate);
			if (difference <= 999) {
				setIsOver(true);
				cancelAnimationFrame(countDownId);
			}
			if (pause.current) {
				cancelAnimationFrame(countDownId);
				pauseTimestamp.current = Date.now();
			}
			if (goBackToInputs.current) {
				cancelAnimationFrame(countDownId);
				deltaMax.current = 0;
			}
		};

		let countDownId = requestAnimationFrame(animate);
		if (pause.current) {
			cancelAnimationFrame(countDownId);
		}
	};

	const inputHandler = (e) => {
		const inputName = e.target.name;
		const inputValidation = /\d+/;

		if (inputValidation.test(e.target.value)) {
			setInputTime((oldValue) => ({
				...oldValue,
				[inputName]: +e.target.value,
			}));
			e.target.style.color = "#ffe5b2";
		} else {
			setInputTime((oldValue) => ({ ...oldValue, [inputName]: null }));
			e.target.style.color = "#6b655c";
		}
	};

	const pauseCountdown = () => {
		pause.current = true;
		setIsPaused(false);
	};

	const backHandler = () => {
		deltaMax.current = 0;
		pauseTimestamp.current = 0;
		pauseElapsed.current = 0;
		goBackToInputs.current = true;
		setIsRunning(false);
		setIsPaused(false);
		setIsOver(false);
	};

	const addTimeToActivity = (e) => {
		const activityId = e.target.dataset.id;
		const timestampOfCreation = Date.now();
		const activityTotalDuration =
			userActivities[activityId].totalDuration;

		const entry = {
			duration: inputInMilliseconds.current,
			timestamp: timestampOfCreation,
		};

		const userRef = ref(db, `users/${user.uid}/`);
		const activityRef = ref(db, `users/${user.uid}/activities/${activityId}/`);
		const activityEntriesRef = child(userRef, `activities/${activityId}/entries/`);

		push(activityEntriesRef , entry);
		return update(activityRef, {totalDuration: inputInMilliseconds.current + activityTotalDuration});
	};

	return (
		<div className="toolBody">
			{isRunning ? (
				<>
					<BackIcon
						tabIndex="0"
						id="backIcon"
						className={`toolControl`}
						alt="Back to change numbers"
						onClick={() => backHandler()}
					/>
					<h1>{countdown}</h1>
				</>
			) : (
				<>
					<CloseIcon
						className="closeTool"
						onClick={toggleCountdown}
						alt="Go back icon"
					/>
					<div className="countdownInputsWrapper">
						<input
							className={inputTime.hours !== null ? "activeTextColor" : null}
							placeholder="h"
							name="hours"
							autoFocus
							value={inputTime.hours !== null ? `${inputTime.hours}` : ""}
							onChange={(e) => inputHandler(e)}
						/>
						<h2>:</h2>
						<input
							className={inputTime.minutes !== null ? "activeTextColor" : null}
							placeholder="m"
							name="minutes"
							value={inputTime.minutes !== null ? `${inputTime.minutes}` : ""}
							onChange={(e) => inputHandler(e)}
						/>
						<h2>:</h2>
						<input
							className={inputTime.seconds !== null ? "activeTextColor" : null}
							placeholder="s"
							name="seconds"
							value={inputTime.seconds !== null ? `${inputTime.seconds}` : ""}
							onChange={(e) => inputHandler(e)}
						/>
					</div>
				</>
			)}

			{isOver ? (
				user && (
					<div>
						<p>Good job! Which activity to add the time to?</p>
						<ul className="userActivitiesWrapper">
							{Object.entries(userActivities).map(([id, activity]) => (
								<li key={id} data-id={id} onClick={(e) => addTimeToActivity(e)}>
									{activity.activityName} - {formatDuration(activity.totalDuration)}
								</li>
							))}
						</ul>
					</div>
				)
			) : isPaused ? (
				<div className="toolControlWrapper">
					<PauseIcon
						id="pauseIcon"
						className={`toolControl ${areInputsReady ? null : "dimmedActive"}`}
						alt="Pause Countdown"
						tabIndex="0"
						onClick={pauseCountdown}
					/>
				</div>
			) : (
				<div className="toolControlWrapper">
					<StartIcon
						id="startIcon"
						className={`toolControl ${areInputsReady ? null : "dimmedActive"}`}
						alt="Start/Continue Countdown"
						tabIndex="0"
						onClick={countDownStart}
					/>
				</div>
			)}
		</div>
	);
}
