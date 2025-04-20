import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Button from '../components/common/Button';
import StorageService from '../services/storage';
import TaskForm from '../components/planner/TaskForm';
import TaskDetails from '../components/planner/TaskDetails';
import TaskList from '../components/planner/TaskList';
import { useTaskContext } from '../contexts/TaskContext';

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

  cursor: pointer;
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
  max-width: ${props => props.wide ? '900px' : '700px'};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ViewTypeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: var(--background-secondary);
  border-radius: 6px;
  padding: 0.25rem;
  width: fit-content;
`;

const ViewTypeButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  border-radius: 4px;
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'};
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-color);
`;

const TableRow = styled.tr`
  &:hover {
    background-color: var(--background-secondary);
  }
  cursor: pointer;
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 0.9rem;
`;

const PriorityCell = styled(TableCell)`
  width: 80px;
`;

const StatusCell = styled(TableCell)`
  width: 150px;
`;

const ActionsCell = styled(TableCell)`
  width: 120px;
  text-align: right;
`;

const Pill = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.type === 'status') {
      switch(props.value) {
        case 'completed': return 'var(--success-light)';
        case 'in-progress': return 'var(--primary-light)';
        case 'canceled': return 'var(--error-light)';
        default: return 'var(--warning-light)';
      }
    } else if (props.type === 'priority') {
      switch(props.value) {
        case 'high': return 'var(--error-light)';
        case 'medium': return 'var(--warning-light)';
        default: return 'var(--success-light)';
      }
    }
  }};
  color: ${props => {
    if (props.type === 'status') {
      switch(props.value) {
        case 'completed': return 'var(--success-color)';
        case 'in-progress': return 'var(--primary-color)';
        case 'canceled': return 'var(--error-color)';
        default: return 'var(--warning-color)';
      }
    } else if (props.type === 'priority') {
      switch(props.value) {
        case 'high': return 'var(--error-color)';
        case 'medium': return 'var(--warning-color)';
        default: return 'var(--success-color)';
      }
    }
  }};
  white-space: nowrap;
`;

const StatusIcon = {
  completed: '✓',
  'in-progress': '⟳',
  canceled: '✕',
  pending: '⏱️'
};

const TasksPage = () => {
  // Extract reorderTasks from context
  const { 
    tasks, 
    loading, 
    stats, 
    error,
    addTask,
    updateTask,
    deleteTask,
    markTaskAsCompleted,
    markTaskAsInProgress,
    reorderTasks
  } = useTaskContext();
  
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [viewType, setViewType] = useState('list'); // Changed default to 'list'
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Update filtered tasks when main tasks or filters change
  const filteredTasks = useMemo(() => {
    if (loading) return [];
    
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
    
    return result;
  }, [tasks, filter, loading]);
  
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
  
  const handleEditTask = (taskId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setCurrentTask(taskToEdit);
      setModalOpen(true);
      
      // Close details if open
      if (detailsOpen) {
        setDetailsOpen(false);
      }
    }
  };
  
  const handleDeleteTask = (taskId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (window.confirm('Yakin ingin menghapus tugas ini?')) {
      deleteTask(taskId);
      
      // Close details if this task was being viewed
      if (selectedTask && selectedTask.id === taskId) {
        setDetailsOpen(false);
      }
    }
  };
  
  const handleViewTask = (task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };
  
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Update existing task
      updateTask(taskData);
    } else {
      // Add new task
      addTask(taskData);
    }
    
    // Close modal
    setModalOpen(false);
    
    // Update selected task if it was changed
    if (selectedTask && selectedTask.id === taskData.id) {
      setSelectedTask(taskData);
    }
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTask(null);
  };
  
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  const handleQuickStatusChange = (taskId, newStatus, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({...task, status: newStatus});
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in-progress': return 'Sedang Dikerjakan';
      case 'canceled': return 'Dibatalkan';
      default: return 'Pending';
    }
  };
  
  const handleReorderTasks = (reorderedTasks) => {
    // Call the context method to reorder tasks
    reorderTasks(reorderedTasks);
  };
  
  const renderTasksList = () => (
    <TaskList 
      tasks={filteredTasks}
      onTaskUpdate={updateTask}
      onTaskClick={handleViewTask}
      onTaskDelete={handleDeleteTask}
      onReorder={handleReorderTasks}
    />
  );
  
  const renderTasksGrid = () => (
    <TaskGrid>
      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => (
          <TaskCard 
            key={task.id} 
            priority={task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}
            onClick={() => handleViewTask(task)}
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
            
            <TaskActions onClick={e => e.stopPropagation()}>
              <Button 
                type="secondary" 
                size="small"
                onClick={(e) => handleEditTask(task.id, e)}
              >
                Edit
              </Button>
              <Button 
                type="danger" 
                size="small"
                onClick={(e) => handleDeleteTask(task.id, e)}
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
  );
  
  const renderTasksTable = () => (
    <TaskTable>
      <thead>
        <tr>
          <TableHeader style={{ width: '40%' }}>Judul</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Prioritas</TableHeader>
          <TableHeader>Tenggat</TableHeader>
          <TableHeader>Kategori</TableHeader>
          <TableHeader>Aksi</TableHeader>
        </tr>
      </thead>
      <tbody>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TableRow key={task.id} onClick={() => handleViewTask(task)}>
              <TableCell>{task.title}</TableCell>
              <StatusCell>
                <Pill type="status" value={task.status}>
                  {StatusIcon[task.status]} {getStatusText(task.status)}
                </Pill>
              </StatusCell>
              <PriorityCell>
                <Pill 
                  type="priority" 
                  value={task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}
                >
                  {task.priority === 3 ? '🔴 Tinggi' : 
                   task.priority === 2 ? '🟠 Sedang' : 
                   '🟢 Rendah'}
                </Pill>
              </PriorityCell>
              <TableCell>
                {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : '-'}
              </TableCell>
              <TableCell>{task.category}</TableCell>
              <ActionsCell onClick={e => e.stopPropagation()}>
                <Button 
                  type="icon" 
                  size="small"
                  onClick={(e) => handleEditTask(task.id, e)}
                  title="Edit"
                >
                  ✏️
                </Button>
                <Button 
                  type="icon" 
                  size="small"
                  onClick={(e) => handleDeleteTask(task.id, e)}
                  title="Hapus"
                >
                  🗑️
                </Button>
              </ActionsCell>
            </TableRow>
          ))
        ) : (
          <tr>
            <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p>Tidak ada tugas yang ditemukan.</p>
              <Button type="primary" style={{ marginTop: '1rem' }} onClick={handleCreateTask}>
                Tambah Tugas Pertama
              </Button>
            </TableCell>
          </tr>
        )}
      </tbody>
    </TaskTable>
  );
  
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <ViewTypeToggle>
          <ViewTypeButton 
            active={viewType === 'list'} 
            onClick={() => setViewType('list')}
          >
            📋 Daftar
          </ViewTypeButton>
          <ViewTypeButton 
            active={viewType === 'grid'} 
            onClick={() => setViewType('grid')}
          >
            🔲 Grid
          </ViewTypeButton>
          <ViewTypeButton 
            active={viewType === 'table'} 
            onClick={() => setViewType('table')}
          >
            📊 Tabel
          </ViewTypeButton>
        </ViewTypeToggle>
        
        <Button type="primary" onClick={handleCreateTask}>
          ➕ Tambah Tugas
        </Button>
      </div>
      
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
      </FilterBar>
      
      {viewType === 'grid' 
        ? renderTasksGrid() 
        : viewType === 'table' 
          ? renderTasksTable() 
          : renderTasksList()
      }
      
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
      
      {detailsOpen && selectedTask && (
        <ModalOverlay onClick={handleCloseDetails}>
          <ModalContent wide onClick={e => e.stopPropagation()}>
            <TaskDetails 
              task={selectedTask}
              onEdit={() => handleEditTask(selectedTask.id)}
              onDelete={() => handleDeleteTask(selectedTask.id)}
              onClose={handleCloseDetails}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </TasksContainer>
  );
};

export default TasksPage; 