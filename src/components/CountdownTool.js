import React, { useState, useRef } from "react";
import { ReactComponent as CloseIcon } from '../icons/close-icon.svg' 
import { ReactComponent as StartIcon } from "../icons/start-icon.svg";
import { ReactComponent as PauseIcon } from "../icons/pause-icon.svg";

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
			if (deltaMax.current === 0) {
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
		<div className="toolBody">
			<CloseIcon
				className="closeTool"
				onClick={toggleCountdown}
				alt="Go back icon"
			/>
			<div className="countdownInputsWrapper">
				<input placeholder={`h`} onChange={(e) => inputHandler(e)} />
				<h2>:</h2>
				<input placeholder={`m`} onChange={(e) => inputHandler(e)} />
				<h2>:</h2>
				<input placeholder={`s`} onChange={(e) => inputHandler(e)} />
			</div>
			<div className="toolControlWrapper">
				<StartIcon id="startTool" className={`toolControl ${input ? null : "dimmedActive" }`} alt="Start/Continue Countdown" onClick={countDownStart}/>
				<PauseIcon id="pauseTool" className={`toolControl ${input ? null : "dimmedActive" }`} alt="Pause Countdown" onClick={pauseCountdown}/>
			</div>
			{countdown !== "00:00:00" && <div>{countdown}</div>}
		</div>
	);
}
