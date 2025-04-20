import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import StorageService from '../../services/storage';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const SubtaskList = styled.div`
  margin-top: 1rem;
`;

const SubtaskItem = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    status: 'pending',
    priority: 1,
    category: 'personal',
    project: '',
    subtasks: [],
  });
  
  const [newSubtask, setNewSubtask] = useState('');
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // Load projects for dropdown
    const loadedProjects = StorageService.getProjects();
    setProjects(loadedProjects);
    
    // If editing, populate form data
    if (task) {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      
      setFormData({
        id: task.id,
        title: task.title || '',
        description: task.description || '',
        dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
        dueTime: dueDate ? `${dueDate.getHours().toString().padStart(2, '0')}:${dueDate.getMinutes().toString().padStart(2, '0')}` : '',
        status: task.status || 'pending',
        priority: task.priority || 1,
        category: task.category || 'personal',
        project: task.project || '',
        subtasks: task.subtasks || [],
      });
    }
  }, [task]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        {
          id: `subtask-${Date.now()}`,
          title: newSubtask,
          completed: false
        }
      ]
    }));
    
    setNewSubtask('');
  };
  
  const handleRemoveSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId)
    }));
  };
  
  const handleToggleSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask => 
        subtask.id === subtaskId ? 
        { ...subtask, completed: !subtask.completed } : 
        subtask
      )
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Judul tugas harus diisi');
      return;
    }
    
    // Prepare data
    let taskData = { ...formData };
    
    // Combine date and time for dueDate
    if (formData.dueDate) {
      const dateStr = formData.dueDate;
      const timeStr = formData.dueTime || '23:59';
      
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      
      const dueDate = new Date(year, month - 1, day, hour, minute);
      taskData.dueDate = dueDate.toISOString();
    }
    
    // Remove temporary fields
    delete taskData.dueTime;
    
    // Save task
    const success = StorageService.saveTask(taskData);
    
    if (success) {
      if (onSave) onSave(taskData);
    } else {
      setError('Gagal menyimpan tugas');
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>{task ? 'Edit Tugas' : 'Tambah Tugas Baru'}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="title">Judul</FormLabel>
          <FormInput
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Judul tugas"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="description">Deskripsi</FormLabel>
          <FormTextarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Deskripsi detail tugas"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="dueDate">Tenggat Waktu</FormLabel>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormInput
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              style={{ flex: 2 }}
            />
            <FormInput
              type="time"
              id="dueTime"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
          </div>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="priority">Prioritas</FormLabel>
          <FormSelect
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value={3}>Tinggi</option>
            <option value={2}>Sedang</option>
            <option value={1}>Rendah</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="category">Kategori</FormLabel>
          <FormSelect
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="personal">Personal</option>
            <option value="work">Pekerjaan</option>
            <option value="education">Pendidikan</option>
            <option value="health">Kesehatan</option>
            <option value="finance">Keuangan</option>
            <option value="other">Lainnya</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="project">Proyek</FormLabel>
          <FormSelect
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
          >
            <option value="">Tanpa Proyek</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Subtasks</FormLabel>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <FormInput
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Tambah subtask"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            />
            <Button 
              type="secondary" 
              size="small" 
              onClick={handleAddSubtask}
            >
              Tambah
            </Button>
          </div>
          
          <SubtaskList>
            {formData.subtasks.map((subtask) => (
              <SubtaskItem key={subtask.id}>
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                />
                <span style={{ 
                  flex: 1,
                  textDecoration: subtask.completed ? 'line-through' : 'none'
                }}>
                  {subtask.title}
                </span>
                <Button 
                  type="icon" 
                  size="small" 
                  onClick={() => handleRemoveSubtask(subtask.id)}
                >
                  🗑️
                </Button>
              </SubtaskItem>
            ))}
          </SubtaskList>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormActions>
          <Button type="secondary" onClick={onCancel}>
            Batal
          </Button>
          <Button type="primary" htmlType="submit">
            {task ? 'Simpan Perubahan' : 'Tambah Tugas'}
          </Button>
        </FormActions>
      </form>
    </FormContainer>
  );
};

export default TaskForm; 