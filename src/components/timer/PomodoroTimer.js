import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  margin: 0 auto;
`;

const TimerHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const TimerTab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TimerDisplay = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  margin: 2rem 0;
`;

const TimerCircle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(to right, var(--background-secondary) 50%, transparent 50%);
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    background-color: white;
    z-index: 1;
  }
`;

const TimerProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip: rect(0, 125px, 250px, 0);
  background-color: var(--primary-color);
  transform: rotate(${props => (props.progress * 360)}deg);
  transition: transform 1s linear;
`;

const TimerContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const TimerTime = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const TimerLabel = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
`;

const TimerControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const TimerStats = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
`;

const TIMER_TYPES = {
  POMODORO: 'pomodoro',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak'
};

const DEFAULT_TIMES = {
  [TIMER_TYPES.POMODORO]: 25 * 60, // 25 minutes in seconds
  [TIMER_TYPES.SHORT_BREAK]: 5 * 60, // 5 minutes in seconds
  [TIMER_TYPES.LONG_BREAK]: 15 * 60 // 15 minutes in seconds
};

const PomodoroTimer = () => {
  const [activeTimer, setActiveTimer] = useState(TIMER_TYPES.POMODORO);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES[TIMER_TYPES.POMODORO]);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress (0 to 1)
  const calculateProgress = () => {
    const totalTime = DEFAULT_TIMES[activeTimer];
    return (totalTime - timeLeft) / totalTime;
  };
  
  // Change timer type
  const changeTimer = (timerType) => {
    if (isRunning) {
      if (window.confirm('Timer is running. Are you sure you want to switch?')) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setActiveTimer(timerType);
        setTimeLeft(DEFAULT_TIMES[timerType]);
      }
    } else {
      setActiveTimer(timerType);
      setTimeLeft(DEFAULT_TIMES[timerType]);
    }
  };
  
  // Start/resume timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - ((DEFAULT_TIMES[activeTimer] - timeLeft) * 1000);
      
      intervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newTimeLeft = DEFAULT_TIMES[activeTimer] - elapsedSeconds;
        
        if (newTimeLeft <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setTimeLeft(0);
          
          // Play notification sound (commented out for now as we don't have audio files yet)
          // const audio = new Audio('/notification.mp3');
          // audio.play();
          
          // Handle session completion
          if (activeTimer === TIMER_TYPES.POMODORO) {
            setSessions(prev => prev + 1);
            setTotalFocusTime(prev => prev + DEFAULT_TIMES[TIMER_TYPES.POMODORO]);
            
            // After pomodoro, go to break
            setTimeout(() => {
              const nextTimer = sessions % 4 === 3 
                ? TIMER_TYPES.LONG_BREAK 
                : TIMER_TYPES.SHORT_BREAK;
              changeTimer(nextTimer);
            }, 3000);
          } else {
            // After break, go back to pomodoro
            setTimeout(() => {
              changeTimer(TIMER_TYPES.POMODORO);
            }, 3000);
          }
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 1000);
    }
  };
  
  // Pause timer
  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIMES[activeTimer]);
  };
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <TimerContainer>
      <TimerHeader>
        <TimerTab 
          active={activeTimer === TIMER_TYPES.POMODORO} 
          onClick={() => changeTimer(TIMER_TYPES.POMODORO)}
        >
          Pomodoro
        </TimerTab>
        <TimerTab 
          active={activeTimer === TIMER_TYPES.SHORT_BREAK} 
          onClick={() => changeTimer(TIMER_TYPES.SHORT_BREAK)}
        >
          Short Break
        </TimerTab>
        <TimerTab 
          active={activeTimer === TIMER_TYPES.LONG_BREAK} 
          onClick={() => changeTimer(TIMER_TYPES.LONG_BREAK)}
        >
          Long Break
        </TimerTab>
      </TimerHeader>
      
      <TimerDisplay>
        <TimerCircle>
          <TimerProgress progress={calculateProgress()} />
        </TimerCircle>
        <TimerContent>
          <TimerTime>{formatTime(timeLeft)}</TimerTime>
          <TimerLabel>
            {activeTimer === TIMER_TYPES.POMODORO ? 'Focus Time' : 'Break Time'}
          </TimerLabel>
        </TimerContent>
      </TimerDisplay>
      
      <TimerControls>
        {!isRunning ? (
          <Button type="primary" onClick={startTimer}>
            {timeLeft === DEFAULT_TIMES[activeTimer] ? 'Start' : 'Resume'}
          </Button>
        ) : (
          <Button type="secondary" onClick={pauseTimer}>
            Pause
          </Button>
        )}
        
        <Button type="secondary" onClick={resetTimer} disabled={isRunning}>
          Reset
        </Button>
      </TimerControls>
      
      <TimerStats>
        <StatItem>
          <StatValue>{sessions}</StatValue>
          <div>Sessions</div>
        </StatItem>
        
        <StatItem>
          <StatValue>{Math.floor(totalFocusTime / 60)}</StatValue>
          <div>Minutes</div>
        </StatItem>
        
        <StatItem>
          <StatValue>{activeTimer === TIMER_TYPES.POMODORO ? 'Focus' : 'Break'}</StatValue>
          <div>Mode</div>
        </StatItem>
      </TimerStats>
    </TimerContainer>
  );
};

export default PomodoroTimer; 