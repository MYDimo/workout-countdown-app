import React, { useState } from "react";
import ClockTool from "./ClockTool";
import CountdownTool from "./CountdownTool";
import IntervalTool from "./IntervalTool";
import Avatar from "./auth/Avatar";
import Profile from "./auth/Profile";

export default function ToolNavigator() {
	const [clockState, setClockState] = useState(false);
	const [intervalState, setIntervalState] = useState(false);
	const [countDownState, setCountDownState] = useState(false);
	const [profileState, setProfileState] = useState(false);
	const [dimmedActive, setDimmedActive] = useState(false);

	const toggleClock = () => {
		setDimmedActive(false);
		setClockState((prevState) => !prevState);
	};
	const toggleInterval = () => {
		setDimmedActive(false);
		setIntervalState((prevState) => !prevState);
	};
	const toggleCountdown = () => {
		setDimmedActive(false);
		setCountDownState((prevState) => !prevState);
	};

	const toggleProfile = () => {
		setProfileState((prevState) => !prevState);
	}

	function MouseOver(event) {
		setDimmedActive(true);
		event.target.style.color = "#FFE5B2";
	}

	function MouseOut(event) {
		setDimmedActive(false);
		event.target.style.color = "";
	}

	return (
		<>
			{!(profileState || clockState || intervalState || countDownState) && (
				<div className="toolNavigator">
					<Avatar toggleProfile={toggleProfile}/>
					<button
						onClick={toggleClock}
						className={dimmedActive ? "dimmedActive" : null}
						onMouseOver={MouseOver}
						onMouseOut={MouseOut}
					>
						Clock
					</button>
					<button
						onClick={toggleInterval}
						className={dimmedActive ? "dimmedActive" : null}
						onMouseOver={MouseOver}
						onMouseOut={MouseOut}
					>
						Intervals
					</button>
					<button
						onClick={toggleCountdown}
						className={dimmedActive ? "dimmedActive" : null}
						onMouseOver={MouseOver}
						onMouseOut={MouseOut}
					>
						Countdown
					</button>
				</div>
			)}
			{profileState && <Profile toggleClock={toggleProfile} />}
			{clockState && <ClockTool toggleClock={toggleClock} />}
			{intervalState && <IntervalTool toggleInterval={toggleInterval} />}
			{countDownState && <CountdownTool toggleCountdown={toggleCountdown} />}
		</>
	);
}
