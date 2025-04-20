import React from 'react';
import styled from 'styled-components';
import StorageService from '../../services/storage';

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const ExportButton = ({ type = 'tasks', buttonText, className }) => {
  const handleExport = () => {
    let data;
    let filename;
    
    switch (type) {
      case 'tasks':
        data = StorageService.getTasks();
        filename = 'planer-tasks.json';
        break;
      case 'all':
        data = StorageService.exportData();
        filename = 'planer-data.json';
        break;
      case 'projects':
        data = StorageService.getProjects();
        filename = 'planer-projects.json';
        break;
      default:
        data = StorageService.getTasks();
        filename = 'planer-tasks.json';
    }
    
    // Tambahkan metadata ekspor
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportType: type,
      version: '1.0',
      data: data
    };
    
    // Konversi ke JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Buat URL untuk unduhan
    const url = URL.createObjectURL(blob);
    
    // Buat elemen anchor untuk mengunduh
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Bersihkan
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  return (
    <Button onClick={handleExport} className={className}>
      <span>📤</span>
      <span>{buttonText || 'Ekspor Data'}</span>
    </Button>
  );
};

export default ExportButton; 