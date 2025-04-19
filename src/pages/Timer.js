import React, { useState } from 'react';
import styled from 'styled-components';
import PomodoroTimer from '../components/timer/PomodoroTimer';

const TimerPageContainer = styled.div`
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--text-secondary);
`;

const TimerSection = styled.div`
  margin-top: 2rem;
`;

const TaskSelection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SelectionHeader = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TaskOption = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  ${props => props.selected && `
    border-color: var(--primary-color);
    background-color: var(--primary-light);
  `}
  
  &:hover {
    background-color: var(--background-secondary);
  }
`;

const RadioButton = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  margin-right: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => props.selected ? 1 : 0};
  }
`;

const TaskName = styled.div`
  font-weight: ${props => props.selected ? 500 : 400};
`;

const AddTaskButton = styled.button`
  background: none;
  border: 1px dashed var(--border-color);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: center;
  color: var(--text-secondary);
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: var(--background-secondary);
  }
`;

// Mock tasks for demo
const mockTasks = [
  { id: 'task-1', title: 'Complete project proposal' },
  { id: 'task-2', title: 'Review client feedback' },
  { id: 'task-3', title: 'Prepare meeting presentation' }
];

const Timer = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  
  return (
    <TimerPageContainer>
      <PageHeader>
        <PageTitle>Focus Timer</PageTitle>
        <PageDescription>
          Use the Pomodoro Technique to boost your productivity. Focus for 25 minutes, then take a 5 minute break.
        </PageDescription>
      </PageHeader>
      
      <TaskSelection>
        <SelectionHeader>Select a task to focus on:</SelectionHeader>
        <TaskList>
          {mockTasks.map(task => (
            <TaskOption 
              key={task.id} 
              selected={selectedTask === task.id}
              onClick={() => setSelectedTask(task.id)}
            >
              <RadioButton selected={selectedTask === task.id} />
              <TaskName selected={selectedTask === task.id}>{task.title}</TaskName>
            </TaskOption>
          ))}
        </TaskList>
        <AddTaskButton>+ Add New Task</AddTaskButton>
      </TaskSelection>
      
      <TimerSection>
        <PomodoroTimer />
      </TimerSection>
    </TimerPageContainer>
  );
};

export default Timer; 