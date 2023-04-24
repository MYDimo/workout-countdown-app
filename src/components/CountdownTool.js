import userEvent from "@testing-library/user-event";
import React, { useState, useRef } from "react";

export default function CountdownTool({ toggleCountdown }) {
	const [input, setInput] = useState(null);
	const [countdown, setCountdown] = useState(`00:00:00`);

	const deltaMax = useRef(0);
	const pause = useRef(false);
	const pauseTimestamp = useRef(0);
	const pauseElapsed = useRef(0);

	const countDownStart = () => {
		if (pause.current) {
			pause.current = false;
		}
		if (pauseTimestamp.current !== 0) {
			pauseElapsed.current = Math.abs(Date.now() - pauseTimestamp.current);
			deltaMax.current += pauseElapsed.current;
			pauseTimestamp.current = 0;
		}

		const animate = () => {
			if (deltaMax.current == 0) {
				deltaMax.current = Date.now() + input * 60000;
			}
			const difference = Math.abs(Date.now() - deltaMax.current);
			const differenceConverted = new Date(difference)
				.toISOString()
				.slice(11, 19);
			setCountdown(() => differenceConverted);
			console.log(differenceConverted);
			let countDownId = requestAnimationFrame(animate);
			if (pause.current) {
				cancelAnimationFrame(countDownId);
				pauseTimestamp.current = Date.now();
			}
		};

		let countDownId = requestAnimationFrame(animate);
		if (pause.current) {
			cancelAnimationFrame(countDownId);
		}
	};

	const inputHandler = (e) => {
		setInput(+e.target.value);
	};

	const pauseCountdown = () => {
		pause.current = true;
	};

	return (
		<>
			<div className="closeTool" onClick={toggleCountdown}>
				close me
			</div>
			<div>This is the coundwon tool</div>
			<input
				type="number"
				placeholder={`add minutes`}
				onChange={(e) => inputHandler(e)}
			/>
			{input && <div onClick={countDownStart}>Start</div>}
			<div onClick={pauseCountdown}>Pause</div>
			{countdown !== "00:00:00" && <div>{countdown}</div>}
		</>
	);
}
