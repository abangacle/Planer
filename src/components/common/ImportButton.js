import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import StorageService from '../../services/storage';

const Button = styled.button`
  background-color: var(--success-color);
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
    background-color: var(--success-dark);
  }
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const StatusMessage = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.error ? 'var(--error-color)' : 'var(--success-color)'};
`;

const ImportButton = ({ onImportSuccess, onImportError, buttonText, className }) => {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState({ message: '', isError: false });
  
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      // Baca file sebagai teks
      const text = await file.text();
      
      // Parse JSON
      const importedData = JSON.parse(text);
      
      // Validasi data yang diimpor
      if (!importedData.data || !importedData.exportType) {
        throw new Error('Format file tidak valid');
      }
      
      // Impor data sesuai jenisnya
      let success = false;
      
      switch (importedData.exportType) {
        case 'tasks':
          // Impor hanya tugas
          const tasks = importedData.data;
          tasks.forEach(task => {
            StorageService.saveTask(task);
          });
          success = true;
          break;
        case 'all':
          // Impor semua data
          success = StorageService.importData(importedData.data);
          break;
        case 'projects':
          // Impor hanya proyek
          const projects = importedData.data;
          projects.forEach(project => {
            StorageService.saveProject(project);
          });
          success = true;
          break;
        default:
          throw new Error('Jenis impor tidak didukung');
      }
      
      if (success) {
        setStatus({ 
          message: `Berhasil mengimpor data ${importedData.exportType}`, 
          isError: false 
        });
        
        if (onImportSuccess) {
          onImportSuccess(importedData);
        }
      } else {
        throw new Error('Gagal mengimpor data');
      }
    } catch (error) {
      console.error('Import error:', error);
      setStatus({ 
        message: `Error: ${error.message || 'Gagal mengimpor data'}`, 
        isError: true 
      });
      
      if (onImportError) {
        onImportError(error);
      }
    }
    
    // Reset input file
    event.target.value = null;
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div>
      <Button onClick={triggerFileInput} className={className}>
        <span>📥</span>
        <span>{buttonText || 'Impor Data'}</span>
      </Button>
      
      <HiddenInput 
        type="file" 
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
      />
      
      {status.message && (
        <StatusMessage error={status.isError}>
          {status.message}
        </StatusMessage>
      )}
    </div>
  );
};

export default ImportButton; 