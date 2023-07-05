import React, { useState, useEffect } from "react";
import { ReactComponent as CloseIcon } from '../icons/close-icon.svg';

export default function ClockTool({ toggleClock }) {
	const [currentTime, setTime] = useState(`00:00:00`);

	useEffect(() => {
		let animationId;

    const animate = () => {
      const date = new Date();
      const hours = String(date.getHours());
      const minutes = String(date.getMinutes());
      const seconds = String(date.getSeconds());
  
      const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
			console.log(time);
  
      setTime(time);
  
      animationId = requestAnimationFrame(animate);
    };
		
		 animationId = requestAnimationFrame(animate);

		return function cleanup() {
			cancelAnimationFrame(animationId);
			console.log("animation stopped");
		}
   	//cancel animation with return callback??

	}, []);

	return (
		<>
		<div className="toolBody">
			<CloseIcon className="closeTool" onClick={toggleClock} alt="Back to main menu"/>
			<h1>{currentTime}</h1>
		</div>
		</>
	);
}
