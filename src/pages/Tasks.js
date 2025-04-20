import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Button from '../components/common/Button';
import StorageService from '../services/storage';
import TaskForm from '../components/planner/TaskForm';

const TasksContainer = styled.div`
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const StatisticsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const StatIcon = styled.div`
  align-self: flex-end;
  font-size: 1.5rem;
  color: var(--primary-light);
  margin-bottom: 0.5rem;
`;

const ProgressSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ProgressTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
  width: ${props => props.percentage}%;
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const PriorityDistribution = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PriorityItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriorityDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.priority === 'high' ? 'var(--error-color)' : 
    props.priority === 'medium' ? 'var(--warning-color)' : 
    'var(--success-color)'};
`;

const PriorityLabel = styled.span`
  font-size: 0.85rem;
`;

const PriorityCount = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: white;
  min-width: 150px;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: white;
  flex: 1;
  min-width: 200px;
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const TaskCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 3px solid ${props => 
    props.priority === 'high' ? 'var(--error-color)' : 
    props.priority === 'medium' ? 'var(--warning-color)' : 
    'var(--success-color)'};
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    transition: all 0.2s ease;
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
`;

const TaskCategory = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 500;
`;

const TaskDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
  
  /* Limit to 3 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  grid-column: 1 / -1;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0
  });
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  useEffect(() => {
    // Fetch tasks
    const loadedTasks = StorageService.getTasks();
    setTasks(loadedTasks);
    setFilteredTasks(loadedTasks);
    
    // Calculate statistics
    calculateStats(loadedTasks);
  }, []);
  
  const calculateStats = (taskList) => {
    const total = taskList.length;
    const completed = taskList.filter(task => task.status === 'completed').length;
    const pending = taskList.filter(task => task.status === 'pending').length;
    const highPriority = taskList.filter(task => task.priority === 3).length;
    const mediumPriority = taskList.filter(task => task.priority === 2).length;
    const lowPriority = taskList.filter(task => task.priority === 1).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats({
      total,
      completed,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate
    });
  };
  
  useEffect(() => {
    // Apply filters
    let result = [...tasks];
    
    // Filter by status
    if (filter.status !== 'all') {
      result = result.filter(task => task.status === filter.status);
    }
    
    // Filter by priority
    if (filter.priority !== 'all') {
      const priorityValue = 
        filter.priority === 'high' ? 3 : 
        filter.priority === 'medium' ? 2 : 1;
      
      result = result.filter(task => task.priority === priorityValue);
    }
    
    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm) || 
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filter]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateTask = () => {
    setCurrentTask(null);
    setModalOpen(true);
  };
  
  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setCurrentTask(taskToEdit);
      setModalOpen(true);
    }
  };
  
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Yakin ingin menghapus tugas ini?')) {
      StorageService.deleteTask(taskId);
      
      // Update tasks list
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      
      // Recalculate stats
      calculateStats(updatedTasks);
    }
  };
  
  const handleSaveTask = (taskData) => {
    // Update local tasks state
    const updatedTasks = [...tasks];
    const existingIndex = updatedTasks.findIndex(t => t.id === taskData.id);
    
    if (existingIndex >= 0) {
      // Update existing task
      updatedTasks[existingIndex] = taskData;
    } else {
      // Add new task
      updatedTasks.push(taskData);
    }
    
    setTasks(updatedTasks);
    
    // Recalculate stats
    calculateStats(updatedTasks);
    
    // Close modal
    setModalOpen(false);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTask(null);
  };
  
  return (
    <TasksContainer>
      <PageHeader>
        <PageTitle>Manajemen Tugas</PageTitle>
      </PageHeader>
      
      <StatisticsSection>
        <StatCard>
          <StatIcon>📋</StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Tugas</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>✅</StatIcon>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Tugas Selesai</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>⏳</StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Tugas Pending</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>🔴</StatIcon>
          <StatValue>{stats.highPriority}</StatValue>
          <StatLabel>Prioritas Tinggi</StatLabel>
        </StatCard>
      </StatisticsSection>
      
      <ProgressSection>
        <ProgressTitle>Progress Penyelesaian Tugas</ProgressTitle>
        <ProgressBar>
          <ProgressFill percentage={stats.completionRate} />
        </ProgressBar>
        <ProgressStats>
          <span>{stats.completionRate}% Completed</span>
          <span>{stats.completed} dari {stats.total} tugas</span>
        </ProgressStats>
        
        <PriorityDistribution>
          <PriorityItem>
            <PriorityDot priority="high" />
            <PriorityLabel>Tinggi</PriorityLabel>
            <PriorityCount>{stats.highPriority}</PriorityCount>
          </PriorityItem>
          
          <PriorityItem>
            <PriorityDot priority="medium" />
            <PriorityLabel>Sedang</PriorityLabel>
            <PriorityCount>{stats.mediumPriority}</PriorityCount>
          </PriorityItem>
          
          <PriorityItem>
            <PriorityDot priority="low" />
            <PriorityLabel>Rendah</PriorityLabel>
            <PriorityCount>{stats.lowPriority}</PriorityCount>
          </PriorityItem>
        </PriorityDistribution>
      </ProgressSection>
      
      <FilterBar>
        <FilterSelect 
          name="status" 
          value={filter.status}
          onChange={handleFilterChange}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </FilterSelect>
        
        <FilterSelect 
          name="priority" 
          value={filter.priority}
          onChange={handleFilterChange}
        >
          <option value="all">Semua Prioritas</option>
          <option value="high">Tinggi</option>
          <option value="medium">Sedang</option>
          <option value="low">Rendah</option>
        </FilterSelect>
        
        <SearchInput 
          name="search"
          value={filter.search}
          onChange={handleFilterChange}
          placeholder="Cari tugas..."
        />
        
        <Button type="primary" onClick={handleCreateTask}>
          Tambah Tugas
        </Button>
      </FilterBar>
      
      <TaskGrid>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              priority={task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}
            >
              <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskCategory>{task.category}</TaskCategory>
              </TaskHeader>
              
              {task.description && (
                <TaskDescription>{task.description}</TaskDescription>
              )}
              
              <TaskMeta>
                <div>
                  {task.dueDate && (
                    <div>Due: {format(new Date(task.dueDate), 'dd MMM yyyy HH:mm')}</div>
                  )}
                  {task.project && <div>Project: {task.project}</div>}
                </div>
                <div>
                  {task.priority === 3 ? '🔴 High' : 
                   task.priority === 2 ? '🟠 Medium' : 
                   '🟢 Low'}
                </div>
              </TaskMeta>
              
              <TaskActions>
                <Button 
                  type="secondary" 
                  size="small"
                  onClick={() => handleEditTask(task.id)}
                >
                  Edit
                </Button>
                <Button 
                  type="danger" 
                  size="small"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Hapus
                </Button>
              </TaskActions>
            </TaskCard>
          ))
        ) : (
          <EmptyState>
            <p>Tidak ada tugas yang ditemukan.</p>
            <Button type="primary" style={{ marginTop: '1rem' }} onClick={handleCreateTask}>
              Tambah Tugas Pertama
            </Button>
          </EmptyState>
        )}
      </TaskGrid>
      
      {modalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <TaskForm 
              task={currentTask} 
              onSave={handleSaveTask} 
              onCancel={handleCloseModal} 
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </TasksContainer>
  );
};

export default TasksPage; 