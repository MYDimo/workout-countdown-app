import React from "react";

export default function CountdownTool({toggleCountdown}) {
	return (
		<>
			<div className="closeTool" onClick={toggleCountdown}>close me</div>
			<div>This is the coundwon tool</div>
		</>
	);
}
