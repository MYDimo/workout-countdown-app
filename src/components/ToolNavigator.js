import React, { useState } from "react";
import ClockTool from "./ClockTool";
import CountdownTool from "./CountdownTool";
import IntervalTool from "./IntervalTool";

export default function ToolNavigator() {
	const [clockState, setClockState] = useState(false);
	const [intervalState, setIntervalState] = useState(false);
	const [countDownState, setCountDownState] = useState(false);

	const toggleClock = () => {
		setClockState(prevState => !prevState);
	};
	const toggleInterval = () => {
    setIntervalState(prevState => !prevState);
	};
	const toggleCountdown = () => {
    setCountDownState(prevState => !prevState);
	};



	return (
		<>
			{!(clockState || intervalState || countDownState) && (
				<>
					<div onClick={toggleClock}>Clock</div>
					<div onClick={toggleInterval}>Intervals work/rest</div>
					<div onClick={toggleCountdown}>Countdown</div>
				</>
			)}
			{clockState && <ClockTool toggleClock={toggleClock}/>}
			{intervalState && <IntervalTool toggleInterval={toggleInterval}/>}
			{countDownState && <CountdownTool toggleCountdown={toggleCountdown}/>}
		</>
	);
}
