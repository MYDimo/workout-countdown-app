import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as CloseIcon } from "../icons/close-icon.svg";
import { ReactComponent as StartIcon } from "../icons/start-icon.svg";
import { ReactComponent as PauseIcon } from "../icons/pause-icon.svg";
import { ReactComponent as BackIcon } from "../icons/back-icon.svg";

export default function IntervalTool({ toggleInterval }) {
	const [countdown, setCountdown] = useState("00:00");
	const [roundsInput, setRoundsInput] = useState(null);
	const [workInput, setWorkInput] = useState({
		minutes: null,
		seconds: null,
	});
	const [restInput, setRestInput] = useState({
		minutes: null,
		seconds: null,
	});
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [areInputsReady, setAreInputsReady] = useState(false);
	const [isOver, setIsOver] = useState(false);

	const roundsTotal = useRef(0);
	const roundAt = useRef(0);
	const work = useRef(0);
	const rest = useRef(0);
	const pauseTimestamp = useRef(0);
	const pauseElapsed = useRef(0);
	const isCountdownPaused = useRef(false);
	const status = useRef("Work");
	const workAnimateId = useRef(null);
	const reset = useRef(false);

	useEffect(() => {
		if (
			roundsInput !== null &&
			workInput.minutes !== null &&
			workInput.seconds !== null &&
			restInput.minutes !== null &&
			restInput.seconds !== null
		) {
			setAreInputsReady(true);
		} else {
			setAreInputsReady(false);
		}
	}, [roundsInput, workInput, restInput]);

	const roundsInputHandler = (e) => {
		const inputValidation = /^\d+$/;

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
				setRoundsInput(null);
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
					[valueName]: null,
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
					[valueName]: null,
				}));
			}
		}
	};

	const startHandler = () => {
		setIsPaused(true);
		reset.current = false;

		if (pauseTimestamp.current === 0) {
			setIsRunning(true);
			isCountdownPaused.current = true;
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
			const timeDiffConverted = new Date(timeDiff).toISOString().slice(14, 19);
			setCountdown(timeDiffConverted);

			workAnimateId.current = requestAnimationFrame(animateWork);
			if (roundAt.current === roundsTotal.current || reset.current) {
				setIsOver(true);
				cancelAnimationFrame(workAnimateId.current);
				setCountdown("00:00");
				work.current = 0;
				rest.current = 0;
				status.current = "Work";
				reset.current = false;
			} else if (timeDiff <= 50) {
				work.current = 0;
				cancelAnimationFrame(workAnimateId.current);
				requestAnimationFrame(animateRest);
			}
			if (pauseTimestamp.current) {
				cancelAnimationFrame(workAnimateId.current);
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
			const timeDiffConverted = new Date(timeDiff).toISOString().slice(14, 19);
			setCountdown(() => timeDiffConverted);

			let restAnimateId = requestAnimationFrame(animateRest);
			if (timeDiff <= 50) {
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
		isCountdownPaused.current = false;
		setIsPaused(false);
		reset.current = false;
	};

	const resetHandler = () => {
		work.current = 0;
		rest.current = 0;
		pauseTimestamp.current = 0;
		status.current = "Work";
		reset.current = true;
		roundAt.current = 0;
		setIsPaused(false);
		setIsRunning(false);
		setIsOver(false);
	};

	return (
		<div className="toolBody">
			{!isRunning && (
				<>
					<CloseIcon
						tabIndex="0"
						className="closeTool"
						onClick={toggleInterval}
						alt="Go back icon"
					/>
					<div className="inputsMainWrapper">
						<div className="roundInputWrapper">
							<label htmlFor="rounds">rounds</label>
							<input
								className={roundsInput !== null ? "activeTextColorBlue" : null}
								min="0"
								placeholder="#"
								name="rounds"
								value={roundsInput !== null ? `${roundsInput}` : ""}
								autoFocus
								onChange={(e) => roundsInputHandler(e)}
							/>
						</div>
						<div className="workInputWrapper">
							<label htmlFor="rounds">work</label>
							<input
								className={
									workInput.minutes !== null ? "activeTextColorBlue" : null
								}
								min="0"
								placeholder="m"
								name="minutes"
								value={workInput.minutes !== null ? `${workInput.minutes}` : ""}
								onChange={(e) => workInputHandler(e)}
							/>
							<input
								className={
									workInput.seconds !== null ? "activeTextColorBlue" : null
								}
								min="0"
								placeholder="s"
								name="seconds"
								value={workInput.seconds !== null ? `${workInput.seconds}` : ""}
								onChange={(e) => workInputHandler(e)}
							/>
						</div>
						<div className="restInputWrapper">
							<label htmlFor="rounds">rest</label>
							<input
								className={
									restInput.minutes !== null ? "activeTextColorBlue" : null
								}
								min="0"
								placeholder="m"
								name="minutes"
								value={restInput.minutes !== null ? `${restInput.minutes}` : ""}
								onChange={(e) => restInputHandler(e)}
							/>
							<input
								className={
									restInput.seconds !== null ? "activeTextColorBlue" : null
								}
								min="0"
								placeholder="s"
								name="seconds"
								value={restInput.seconds !== null ? `${restInput.seconds}` : ""}
								onChange={(e) => restInputHandler(e)}
							/>
						</div>
					</div>
				</>
			)}

			{isRunning && (
				<>
					<div className="toolNavWrapper">
						<BackIcon
							tabIndex="0"
							id="backIcon"
							className={`toolControl`}
							alt="Back to change numbers"
							onClick={() => resetHandler()}
						/>
						<h2>R{isOver ? roundAt.current : roundAt.current + 1}</h2>
						<h3>{isOver ? "Over" : status.current}</h3>
					</div>
					<h1>{countdown}</h1>
				</>
			)}

			{isOver ? null : isPaused ? (
				<div className="toolControlWrapper">
					<PauseIcon
						tabIndex="0"
						id="pauseIcon"
						className={`toolControl ${
							areInputsReady ? null : "dimmedActive disabled"
						}`}
						alt="Start/Continue Countdown"
						onClick={pauseHandler}
					/>
				</div>
			) : (
				<div className="toolControlWrapper">
					<StartIcon
						tabIndex={areInputsReady ? "0" : null}
						id="startIcon"
						className={`toolControl ${
							areInputsReady ? null : "dimmedActive disabled"
						}`}
						alt="Start/Continue Countdown"
						onClick={startHandler}
					/>
				</div>
			)}
		</div>
	);
}
