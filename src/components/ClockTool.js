import React, { useState, useEffect } from "react";

export default function ClockTool({ toggleClock }) {
	const [currentTime, setTime] = useState(`00:00:00`);

	const animate = () => {
		const date = new Date();
		const hours = String(date.getHours());
		const minutes = String(date.getMinutes());
		const seconds = String(date.getSeconds());

		const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;

		setTime(time);

		requestAnimationFrame(animate);
	};

	useEffect(() => {
    const animate = () => {
      const date = new Date();
      const hours = String(date.getHours());
      const minutes = String(date.getMinutes());
      const seconds = String(date.getSeconds());
  
      const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  
      setTime(time);
  
      requestAnimationFrame(animate);
    };

		requestAnimationFrame(animate);
	}, []);

	return (
		<>
			<div className="closeTool" onClick={toggleClock}>
				close me
			</div>
			<div>This is the clock tool</div>
			<div>{currentTime}</div>
		</>
	);
}
