import React, { createContext, useContext, useReducer, useEffect } from 'react';
import StorageService from '../services/storage';

// Initial state
const initialState = {
  tasks: [],
  loading: true,
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0
  },
  error: null
};

// Action types
const ActionTypes = {
  FETCH_TASKS_SUCCESS: 'FETCH_TASKS_SUCCESS',
  FETCH_TASKS_ERROR: 'FETCH_TASKS_ERROR',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  REORDER_TASKS: 'REORDER_TASKS',
  UPDATE_SUBTASK: 'UPDATE_SUBTASK'
};

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        stats: calculateStats(action.payload)
      };
      
    case ActionTypes.FETCH_TASKS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case ActionTypes.ADD_TASK:
      const updatedTasksAfterAdd = [...state.tasks, action.payload];
      return {
        ...state,
        tasks: updatedTasksAfterAdd,
        stats: calculateStats(updatedTasksAfterAdd)
      };
      
    case ActionTypes.UPDATE_TASK:
      const updatedTasksAfterUpdate = state.tasks.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasksAfterUpdate,
        stats: calculateStats(updatedTasksAfterUpdate)
      };
      
    case ActionTypes.DELETE_TASK:
      const updatedTasksAfterDelete = state.tasks.filter(task => 
        task.id !== action.payload
      );
      return {
        ...state,
        tasks: updatedTasksAfterDelete,
        stats: calculateStats(updatedTasksAfterDelete)
      };
    
    case ActionTypes.REORDER_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
      
    case ActionTypes.UPDATE_SUBTASK:
      const { taskId, subtaskId, changes } = action.payload;
      const updatedTasksWithSubtask = state.tasks.map(task => {
        if (task.id !== taskId) return task;
        
        const updatedSubtasks = task.subtasks?.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, ...changes } : subtask
        ) || [];
        
        return { ...task, subtasks: updatedSubtasks };
      });
      
      return {
        ...state,
        tasks: updatedTasksWithSubtask,
        stats: calculateStats(updatedTasksWithSubtask)
      };
      
    default:
      return state;
  }
};

// Helper function to calculate stats
const calculateStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const pending = tasks.filter(task => task.status === 'pending').length;
  const highPriority = tasks.filter(task => task.priority === 3).length;
  const mediumPriority = tasks.filter(task => task.priority === 2).length;
  const lowPriority = tasks.filter(task => task.priority === 1).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    pending,
    highPriority,
    mediumPriority,
    lowPriority,
    completionRate
  };
};

// Create the context
const TaskContext = createContext();

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  
  // Load tasks on mount
  useEffect(() => {
    try {
      const loadedTasks = StorageService.getTasks();
      dispatch({ 
        type: ActionTypes.FETCH_TASKS_SUCCESS, 
        payload: loadedTasks 
      });
    } catch (error) {
      dispatch({ 
        type: ActionTypes.FETCH_TASKS_ERROR, 
        payload: error.message 
      });
    }
  }, []);
  
  // Task actions
  const addTask = (taskData) => {
    const success = StorageService.saveTask(taskData);
    if (success) {
      dispatch({ type: ActionTypes.ADD_TASK, payload: taskData });
      return true;
    }
    return false;
  };
  
  const updateTask = (taskData) => {
    const success = StorageService.saveTask(taskData);
    if (success) {
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: taskData });
      return true;
    }
    return false;
  };
  
  const deleteTask = (taskId) => {
    const success = StorageService.deleteTask(taskId);
    if (success) {
      dispatch({ type: ActionTypes.DELETE_TASK, payload: taskId });
      return true;
    }
    return false;
  };
  
  const reorderTasks = (newTasksOrder) => {
    dispatch({ type: ActionTypes.REORDER_TASKS, payload: newTasksOrder });
    // TODO: Persist order to storage if needed
  };
  
  const updateSubtask = (taskId, subtaskId, changes) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    const updatedSubtasks = task.subtasks?.map(subtask => 
      subtask.id === subtaskId ? { ...subtask, ...changes } : subtask
    ) || [];
    
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    const success = StorageService.saveTask(updatedTask);
    
    if (success) {
      dispatch({ 
        type: ActionTypes.UPDATE_SUBTASK, 
        payload: { taskId, subtaskId, changes } 
      });
      return true;
    }
    
    return false;
  };
  
  // Status changing shortcuts
  const markTaskAsCompleted = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status: 'completed' });
      return true;
    }
    return false;
  };
  
  const markTaskAsInProgress = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status: 'in-progress' });
      return true;
    }
    return false;
  };
  
  // Provide the context value
  const contextValue = {
    tasks: state.tasks,
    loading: state.loading,
    stats: state.stats,
    error: state.error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    updateSubtask,
    markTaskAsCompleted,
    markTaskAsInProgress
  };
  
  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for using the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext; 