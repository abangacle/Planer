import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Button from '../common/Button';

const TaskListContainer = styled.div`
  margin-bottom: 2rem;
`;

const TaskItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: grab;
  border-left: 3px solid ${props => 
    props.priority === 'high' ? 'var(--error-color)' : 
    props.priority === 'medium' ? 'var(--warning-color)' : 
    'var(--success-color)'};
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
`;

const TaskCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TaskContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const TaskTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? 'var(--text-secondary)' : 'var(--text-color)'};
`;

const TaskMeta = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  gap: 1rem;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TaskList = ({ tasks, onTaskUpdate, onTaskClick, onTaskDelete, onReorder }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.currentTarget.classList.add('dragging');
    
    // Required for Firefox
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedTask(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.id === targetTask.id) return;
    
    // Find indices
    const tasksCopy = [...tasks];
    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = tasks.findIndex(t => t.id === targetTask.id);
    
    // Reorder tasks
    tasksCopy.splice(draggedIndex, 1);
    tasksCopy.splice(targetIndex, 0, draggedTask);
    
    // Update order
    if (onReorder) {
      onReorder(tasksCopy);
    }
  };
  
  const handleStatusChange = (task) => {
    // Toggle completion status
    const updatedTask = { 
      ...task, 
      status: task.status === 'completed' ? 'pending' : 'completed' 
    };
    onTaskUpdate(updatedTask);
  };
  
  return (
    <TaskListContainer>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          priority={task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}
          draggable
          onDragStart={(e) => handleDragStart(e, task)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, task)}
        >
          <TaskCheckbox 
            type="checkbox" 
            checked={task.status === 'completed'}
            onChange={() => handleStatusChange(task)}
            onClick={(e) => e.stopPropagation()}
          />
          
          <TaskContent onClick={() => onTaskClick(task)}>
            <TaskTitle completed={task.status === 'completed'}>
              {task.title}
            </TaskTitle>
            
            <TaskMeta>
              {task.dueDate && (
                <span>Due: {format(new Date(task.dueDate), 'dd MMM yyyy')}</span>
              )}
              <span>{task.category}</span>
            </TaskMeta>
          </TaskContent>
          
          <TaskActions onClick={(e) => e.stopPropagation()}>
            <Button 
              type="icon" 
              size="small"
              onClick={() => onTaskDelete(task.id)}
              title="Hapus"
            >
              🗑️
            </Button>
          </TaskActions>
        </TaskItem>
      ))}
    </TaskListContainer>
  );
};

export default TaskList; 