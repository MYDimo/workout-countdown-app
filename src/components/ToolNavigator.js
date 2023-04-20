import React, { useState } from 'react';

export default function ToolNavigator() {
  const [clockTool, setClockTool] = useState(false);
  const [intervalTool, setIntervalTool] = useState(false);
  const [countDownTool, setCountDownTool] = useState(false);

  const clockTollHandler = () => {
    console.log("you chose clock");
  }
  const intervalToolHandler = () => {
    console.log("you chose intervals");
  }
  const countDownToolHandler = () => {
    console.log("you chose countdown");
  }

  return (
    <>
      {!(clockTool || intervalTool || countDownTool) &&
        <>
          <div onClick={clockTollHandler}>Clock</div>
          <div onClick={intervalToolHandler}>Intervals work/rest</div>
          <div onClick={countDownToolHandler}>Countdown</div>
        </>
      }
    </>
  )
}
