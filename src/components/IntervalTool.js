import React, { useRef, useState } from "react";

export default function IntervalTool({ toggleInterval }) {
	const [countdown, setCountdown] = useState("00:00:00");
	const [workInput, setWorkInput] = useState({
		minutes: 0,
		seconds: 0,
	});
	const [restInput, setRestInput] = useState({
		minutes: 0,
		seconds: 0,
	});

	const roundsTotal = useRef(0);
	const roundAt = useRef(0);
	const work = useRef(0);
	const rest = useRef(0);
	const pauseTimestamp = useRef(0);
	const pauseElapsed = useRef(0);
	const isCountdownPaused = useRef(false);
	const status = useRef("Work");

	const workInputHandler = (e) => {
		const valueName = e.target.name;
		setWorkInput((existingValues) => ({
			...existingValues,
			[valueName]: +e.target.value,
		}));
	};

	const restInputHandler = (e) => {
		const valueName = e.target.name;
		setRestInput((existingValues) => ({
			...existingValues,
			[valueName]: +e.target.value,
		}));
	};

	const startHandler = () => {
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
		} else {
			roundAt.current = roundsTotal.current;
		}

		const animateWork = () => {
			status.current = "Work";
			if (work.current === 0) {
				work.current =
					Date.now() + workInput.minutes * 60000 + workInput.seconds * 1000 + 1000;
			}
			const timeDiff = Math.abs(Date.now() - work.current);
			const timeDiffConverted = new Date(timeDiff).toISOString().slice(11, 19);
			setCountdown(() => timeDiffConverted);

			let workAnimateId = requestAnimationFrame(animateWork);
			if (roundAt.current === 0) {
				cancelAnimationFrame(workAnimateId);
				setCountdown("00:00:00");
				work.current = 0;
				rest.current = 0;
				status.current = null;
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
					Date.now() + restInput.minutes * 60000 + restInput.seconds * 1000 + 1000;
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
				roundAt.current -= 1;
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
			requestAnimationFrame(animateWork)
		}
	};

	const pauseHandler = () => {
		pauseTimestamp.current = Date.now();
		isCountdownPaused.current = true;
		console.log(status.current);
	}

	const resetHandler = () => {

	}

	return (
		<>
			<div className="closeTool" onClick={toggleInterval}>
				close me
			</div>
			<div>This is the interval tool</div>
			<p>Rounds</p>
			<input
				type="number"
				placeholder="rounds?"
				onChange={(e) => (roundsTotal.current = +e.target.value)}
			/>
			<p>Work</p>
			<input
				type="number"
				placeholder="minutes?"
				name="minutes"
				onChange={(e) => workInputHandler(e)}
			/>
			<input
				type="number"
				placeholder="seconds?"
				name="seconds"
				onChange={(e) => workInputHandler(e)}
			/>
			<p>Rest</p>
			<input
				type="number"
				placeholder="minutes?"
				name="minutes"
				onChange={(e) => restInputHandler(e)}
			/>
			<input
				type="number"
				placeholder="seconds?"
				name="seconds"
				onChange={(e) => restInputHandler(e)}
			/>
			<div>Countdown - {roundAt.current ? status.current : "Over"}</div>
			<div>
				Round - {roundAt.current}/{roundsTotal.current}
			</div>
			<div>{countdown}</div>
			<div onClick={startHandler}>Start</div>
			<div onClick={pauseHandler}>Pause</div>
			<div onClick={resetHandler}>Reset</div>
		</>
	);
}


/*
- press pause
- get timestamp
- figure out if it's during work or rest

- press start again 
- check if it has been paused
- check if it has been paused during work or rest
- if work - continue and figure the elapsed time
- if rest - start directly requestAnimationFrame(animateRest) and figure elapsed time

*/	