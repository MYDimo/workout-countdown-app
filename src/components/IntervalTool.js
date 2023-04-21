import React from "react";

export default function IntervalTool({toggleInterval}) {
	return (
		<>
			<div className="closeTool" onClick={toggleInterval}>close me</div>
			<div>This is the interval tool</div>
		</>
	);
}
