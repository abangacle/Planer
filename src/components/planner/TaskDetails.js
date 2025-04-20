import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Button from '../common/Button';
import StorageService from '../../services/storage';

const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  background-color: ${props => 
    props.status === 'completed' ? 'var(--success-color)' : 
    props.status === 'in-progress' ? 'var(--primary-color)' : 
    props.status === 'canceled' ? 'var(--error-light)' : 
    'var(--warning-color)'};
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
`;

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  background-color: ${props => 
    props.priority === 'high' ? 'var(--error-light)' : 
    props.priority === 'medium' ? 'var(--warning-light)' : 
    'var(--success-light)'};
  color: ${props => 
    props.priority === 'high' ? 'var(--error-color)' : 
    props.priority === 'medium' ? 'var(--warning-color)' : 
    'var(--success-color)'};
  font-size: 0.8rem;
  font-weight: 500;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  font-weight: 500;
`;

const Description = styled.div`
  color: var(--text-color);
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 1.5rem;
  background-color: var(--background-secondary);
  padding: 1.25rem;
  border-radius: 6px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  background-color: var(--background-secondary);
  border-radius: 6px;
  padding: 1rem;
`;

const MetaLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.35rem;
`;

const MetaValue = styled.div`
  font-weight: 500;
`;

const SubtaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SubtaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--background-secondary);
  border-radius: 6px;
  
  &:hover {
    background-color: var(--background-secondary-hover);
  }
`;

const SubtaskCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const SubtaskTitle = styled.span`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? 'var(--text-secondary)' : 'var(--text-color)'};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  margin-bottom: 0.5rem;
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
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--background-secondary);
  border-radius: 6px;
  max-width: 250px;
  
  &:hover {
    background-color: var(--background-secondary-hover);
  }
`;

const AttachmentIcon = styled.div`
  font-size: 1.5rem;
`;

const AttachmentName = styled.div`
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CommentSection = styled.div`
  margin-top: 1.5rem;
`;

const CommentForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CommentInput = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const TaskDetails = ({ task, onEdit, onDelete, onClose }) => {
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  
  const handleToggleSubtask = (subtaskId) => {
    // Update local state
    const updatedSubtasks = subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updatedSubtasks);
    
    // Update task in storage
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    StorageService.saveTask(updatedTask);
  };
  
  // Calculate subtask completion percentage
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const totalSubtasks = subtasks.length;
  const completionPercentage = totalSubtasks > 0 
    ? Math.round((completedSubtasks / totalSubtasks) * 100) 
    : 0;
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak ada';
    return format(new Date(dateString), 'dd MMM yyyy HH:mm');
  };
  
  // Get priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 3: return { text: 'Tinggi', icon: '🔴' };
      case 2: return { text: 'Sedang', icon: '🟠' };
      default: return { text: 'Rendah', icon: '🟢' };
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in-progress': return 'Sedang Dikerjakan';
      case 'canceled': return 'Dibatalkan';
      default: return 'Pending';
    }
  };
  
  return (
    <Container>
      <Header>
        <div>
          <Title>{task.title}</Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <StatusBadge status={task.status}>
              {getStatusText(task.status)}
            </StatusBadge>
            <PriorityBadge priority={task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}>
              {getPriorityText(task.priority).icon} {getPriorityText(task.priority).text}
            </PriorityBadge>
            <Tag>{task.category}</Tag>
          </div>
        </div>
        <Actions>
          <Button 
            type="secondary" 
            size="small"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button 
            type="danger" 
            size="small"
            onClick={onDelete}
          >
            Hapus
          </Button>
          <Button 
            type="icon"
            onClick={onClose}
            title="Tutup Detail"
          >
            ✕
          </Button>
        </Actions>
      </Header>
      
      <Section>
        <SectionTitle>Deskripsi</SectionTitle>
        <Description>
          {task.description || 'Tidak ada deskripsi.'}
        </Description>
      </Section>
      
      <Section>
        <SectionTitle>Detail</SectionTitle>
        <MetaGrid>
          <MetaItem>
            <MetaLabel>Tenggat Waktu</MetaLabel>
            <MetaValue>{task.dueDate ? formatDate(task.dueDate) : 'Tidak ada'}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Proyek</MetaLabel>
            <MetaValue>{task.project || 'Tidak ada'}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Tanggal Dibuat</MetaLabel>
            <MetaValue>{formatDate(task.createdAt)}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Terakhir Diperbarui</MetaLabel>
            <MetaValue>{formatDate(task.updatedAt)}</MetaValue>
          </MetaItem>
          
          {task.timeEstimate && (
            <MetaItem>
              <MetaLabel>Estimasi Waktu</MetaLabel>
              <MetaValue>{task.timeEstimate} menit</MetaValue>
            </MetaItem>
          )}
          
          {task.timeSpent && (
            <MetaItem>
              <MetaLabel>Waktu Terpakai</MetaLabel>
              <MetaValue>{task.timeSpent} menit</MetaValue>
            </MetaItem>
          )}
        </MetaGrid>
      </Section>
      
      {subtasks.length > 0 && (
        <Section>
          <SectionTitle>Subtasks</SectionTitle>
          
          <ProgressBar>
            <ProgressFill percentage={completionPercentage} />
          </ProgressBar>
          <ProgressStats>
            <span>{completionPercentage}% Selesai</span>
            <span>{completedSubtasks} dari {totalSubtasks} subtasks</span>
          </ProgressStats>
          
          <SubtaskList>
            {subtasks.map(subtask => (
              <SubtaskItem key={subtask.id}>
                <SubtaskCheckbox 
                  type="checkbox" 
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                />
                <SubtaskTitle completed={subtask.completed}>
                  {subtask.title}
                </SubtaskTitle>
              </SubtaskItem>
            ))}
          </SubtaskList>
        </Section>
      )}
      
      {task.attachments && task.attachments.length > 0 && (
        <Section>
          <SectionTitle>Lampiran</SectionTitle>
          <AttachmentList>
            {task.attachments.map((attachment, index) => (
              <AttachmentItem key={index}>
                <AttachmentIcon>📎</AttachmentIcon>
                <AttachmentName>{attachment.name}</AttachmentName>
              </AttachmentItem>
            ))}
          </AttachmentList>
        </Section>
      )}
      
      <Section>
        <SectionTitle>Komentar</SectionTitle>
        <CommentForm>
          <CommentInput placeholder="Tambahkan komentar..." />
          <Button type="primary">Kirim</Button>
        </CommentForm>
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          Tidak ada komentar.
        </div>
      </Section>
    </Container>
  );
};

export default TaskDetails; 