
import React, { useEffect, useRef, useState } from "react";
import './../styles/App.css';

const App = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(null);

  const getCurrentTime = () => (
    startedAtRef.current === null
      ? elapsedTime
      : Date.now() - startedAtRef.current
  );

  const startTimer = () => {
    if (intervalRef.current !== null) return;

    startedAtRef.current = Date.now() - elapsedTime;
    intervalRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startedAtRef.current);
    }, 10);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (intervalRef.current === null) return;

    setElapsedTime(getCurrentTime());
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    startedAtRef.current = null;
    setIsRunning(false);
  };

  const recordLap = () => {
    setLaps((previousLaps) => [...previousLaps, getCurrentTime()]);
  };

  const resetTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startedAtRef.current = null;
    setElapsedTime(0);
    setLaps([]);
    setIsRunning(false);
  };

  useEffect(() => () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    const pad = (value) => String(value).padStart(2, "0");

    return `${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
  };

  return (
    <div className="timer-app">
      <main className="timer" aria-label="Lap timer">
        <p className="timer-kicker">STOPWATCH</p>
        <h1 className="timer-display" role="timer" aria-label="Elapsed time">
          {formatTime(elapsedTime)}
        </h1>

        <div className="timer-controls" aria-label="Timer controls">
          <button className="control control-start" onClick={startTimer} disabled={isRunning}>
            Start
          </button>
          <button className="control control-stop" onClick={stopTimer} disabled={!isRunning}>
            Stop
          </button>
          <button className="control control-lap" onClick={recordLap}>
            Lap
          </button>
          <button className="control control-reset" onClick={resetTimer}>
            Reset
          </button>
        </div>

        <section className="laps" aria-labelledby="laps-heading">
          <div className="laps-heading-row">
            <h2 id="laps-heading">Laps</h2>
            <span>{String(laps.length).padStart(2, "0")}</span>
          </div>
          {laps.length > 0 ? (
            <ol className="laps-list">
              {laps.map((lap, index) => (
                <li className="lap-row" key={`${index}-${lap}`}>
                  <span className="lap-number">Lap {String(index + 1).padStart(2, "0")}</span>
                  <time>{formatTime(lap)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <p className="laps-empty">No laps recorded</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
