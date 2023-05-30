import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as CloseIcon } from "../icons/close-icon.svg";
import { ReactComponent as StartIcon } from "../icons/start-icon.svg";
import { ReactComponent as PauseIcon } from "../icons/pause-icon.svg";

export default function IntervalTool({ toggleInterval }) {
	const [countdown, setCountdown] = useState("00:00:00");
	const [roundsInput, setRoundsInput] = useState(0);
	const [workInput, setWorkInput] = useState({
		minutes: 0,
		seconds: 0,
	});
	const [restInput, setRestInput] = useState({
		minutes: 0,
		seconds: 0,
	});
	const [isRunning, setIsRunning] = useState(false);
	const [areInputsReady, setAreInputsReady] = useState(false);

	const roundsTotal = useRef(0);
	const roundAt = useRef(0);
	const work = useRef(0);
	const rest = useRef(0);
	const pauseTimestamp = useRef(0);
	const pauseElapsed = useRef(0);
	const isCountdownPaused = useRef(false);
	const status = useRef("Work");

	const roundsInputHandler = (e) => {
		const inputValidation = /^\d+$/;

		console.log(e.target.value);

		if (inputValidation.test(e.target.value)) {
			roundsTotal.current = +e.target.value;
			setRoundsInput(+e.target.value);
			e.target.style.color = "#216583";
		} else {
			e.target.style.color = "#6b655c";

			if (e.target.value) {
				e.target.value = e.target.value.slice(0, -1);
				if (inputValidation.test(e.target.value)) {
					roundsTotal.current = +e.target.value;
					e.target.style.color = "#216583";
				}
			} else {
				roundsTotal.current = 0;
				setRoundsInput(0);
			}
		}
	};

	const workInputHandler = (e) => {
		const valueName = e.target.name;
		const inputValidation = /\d+/;

		if (inputValidation.test(e.target.value)) {
			setWorkInput((existingValues) => ({
				...existingValues,
				[valueName]: +e.target.value,
			}));
			e.target.style.color = "#216583";
		} else {
			e.target.style.color = "#6b655c";

			if (e.target.value) {
				e.target.value = e.target.value.slice(0, -1);
				if (inputValidation.test(e.target.value)) {
					setWorkInput((existingValues) => ({
						...existingValues,
						[valueName]: +e.target.value,
					}));
					e.target.style.color = "#216583";
				}
			} else {
				setWorkInput((existingValues) => ({
					...existingValues,
					[valueName]: 0,
				}));
			}
		}
	};

	const restInputHandler = (e) => {
		const valueName = e.target.name;
		const inputValidation = /\d+/;

		if (inputValidation.test(e.target.value)) {
			setRestInput((existingValues) => ({
				...existingValues,
				[valueName]: +e.target.value,
			}));
			e.target.style.color = "#216583";
		} else {
			e.target.style.color = "#6b655c";

			if (e.target.value) {
				e.target.value = e.target.value.slice(0, -1);
				if (inputValidation.test(e.target.value)) {
					setRestInput((existingValues) => ({
						...existingValues,
						[valueName]: +e.target.value,
					}));
					e.target.style.color = "#216583";
				}
			} else {
				setRestInput((existingValues) => ({
					...existingValues,
					[valueName]: 0,
				}));
			}
		}
	};

	const startHandler = () => {
		if (pauseTimestamp.current === 0) {
			setIsRunning((oldValue) => !oldValue);
		}

		if (pauseTimestamp.current !== 0 && status.current === "Work") {
			pauseElapsed.current = Math.abs(Date.now() - pauseTimestamp.current);
			work.current += pauseElapsed.current;
			pauseTimestamp.current = 0;
			pauseElapsed.current = 0;
		} else if (pauseTimestamp.current !== 0 && status.current === "Rest") {
			pauseElapsed.current = Math.abs(Date.now() - pauseTimestamp.current);
			rest.current += pauseElapsed.current;
			pauseTimestamp.current = 0;
			pauseElapsed.current = 0;
		}

		console.log(
			roundAt.current,
			roundsTotal.current,
			isRunning,
			pauseTimestamp.current
		);

		const animateWork = () => {
			status.current = "Work";
			if (work.current === 0) {
				work.current =
					Date.now() +
					workInput.minutes * 60000 +
					workInput.seconds * 1000 +
					1000;
			}
			const timeDiff = Math.abs(Date.now() - work.current);
			const timeDiffConverted = new Date(timeDiff).toISOString().slice(11, 19);
			setCountdown(() => timeDiffConverted);

			let workAnimateId = requestAnimationFrame(animateWork);
			if (roundAt.current === roundsTotal.current) {
				cancelAnimationFrame(workAnimateId);
				setCountdown("00:00:00");
				work.current = 0;
				rest.current = 0;
				status.current = null;
				resetHandler(false);
			} else if (timeDiffConverted === "00:00:00") {
				work.current = 0;
				cancelAnimationFrame(workAnimateId);
				requestAnimationFrame(animateRest);
			}
			if (pauseTimestamp.current) {
				cancelAnimationFrame(workAnimateId);
			}
		};

		const animateRest = () => {
			status.current = "Rest";
			if (rest.current === 0) {
				rest.current +=
					Date.now() +
					restInput.minutes * 60000 +
					restInput.seconds * 1000 +
					1000;
				status.current = null;
			}
			const timeDiff = Math.abs(Date.now() - rest.current);
			const timeDiffConverted = new Date(timeDiff).toISOString().slice(11, 19);
			setCountdown(() => timeDiffConverted);

			let restAnimateId = requestAnimationFrame(animateRest);
			if (timeDiffConverted === "00:00:00") {
				rest.current = 0;
				cancelAnimationFrame(restAnimateId);
				requestAnimationFrame(animateWork);
				roundAt.current += 1;
			}
			if (pauseTimestamp.current) {
				cancelAnimationFrame(restAnimateId);
			}
		};

		if (isCountdownPaused.current && status.current === "Work") {
			requestAnimationFrame(animateWork);
		} else if (isCountdownPaused.current && status.current === "Rest") {
			requestAnimationFrame(animateRest);
		} else {
			requestAnimationFrame(animateWork);
		}
	};

	const pauseHandler = () => {
		pauseTimestamp.current = Date.now();
		isCountdownPaused.current = true;
	};

	const resetHandler = (changeIsRunning) => {
		roundsTotal.current = 0;
		roundAt.current = 0;
		work.current = 0;
		rest.current = 0;
		pauseTimestamp.current = 0;
		pauseElapsed.current = 0;
		isCountdownPaused.current = false;
		status.current = "Work";

		if (changeIsRunning) {
			setIsRunning((oldValue) => !oldValue);
		}
	};

	useEffect(() => {
		if (
			roundsInput &&
			workInput.minutes &&
			workInput.seconds &&
			restInput.minutes &&
			restInput.seconds
		) {
			setAreInputsReady(true);
		} else {
			setAreInputsReady(false);
		}
	}, [roundsInput, workInput, restInput]);

	return (
		<div className="toolBody">
			{!isRunning && (
				<>
					<CloseIcon
						className="closeTool"
						onClick={toggleInterval}
						alt="Go back icon"
					/>
					<div className="inputsMainWrapper">
						<div className="roundInputWrapper">
							<label htmlFor="rounds">rounds</label>
							<input
								min="0"
								placeholder="#"
								name="rounds"
								onChange={(e) => roundsInputHandler(e)}
							/>
						</div>
						<div className="workInputWrapper">
							<label htmlFor="rounds">work</label>
							<input
								min="0"
								placeholder="m"
								name="minutes"
								onChange={(e) => workInputHandler(e)}
							/>
							<input
								min="0"
								placeholder="s"
								name="seconds"
								onChange={(e) => workInputHandler(e)}
							/>
						</div>
						<div className="restInputWrapper">
							<label htmlFor="rounds">rest</label>
							<input
								min="0"
								placeholder="m"
								name="minutes"
								onChange={(e) => restInputHandler(e)}
							/>
							<input
								min="0"
								placeholder="s"
								name="seconds"
								onChange={(e) => restInputHandler(e)}
							/>
						</div>
					</div>
						<div className="toolControlWrapper">
							<StartIcon
								id="startTool"
								className={`toolControl ${
									areInputsReady ? null : "dimmedActive disabled"
								}`}
								alt="Start/Continue Countdown"
								onClick={startHandler}
							/>
						</div>
				</>
			)}

			{isRunning && (
				<>
					<div>
						Countdown -{" "}
						{roundAt.current === roundsTotal.current ? "Over" : status.current}
					</div>
					<div>
						Round -{" "}
						{roundAt.current === roundsTotal.current
							? roundsTotal.current
							: roundAt.current + 1}
					</div>
					<div>{countdown}</div>
					<div onClick={() => resetHandler(true)}>Reset</div>
				</>
			)}
		</div>
	);
}
