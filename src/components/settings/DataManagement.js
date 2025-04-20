import React, { useState } from 'react';
import styled from 'styled-components';
import ExportButton from '../common/ExportButton';
import ImportButton from '../common/ImportButton';
import { useTaskContext } from '../../contexts/TaskContext';

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  font-weight: 500;
`;

const Description = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background-color: var(--background-secondary);
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
`;

const StatItem = styled.div`
  min-width: 100px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const DataManagement = () => {
  const { tasks, stats } = useTaskContext();
  const [lastImport, setLastImport] = useState(null);

  const handleImportSuccess = (importedData) => {
    setLastImport({
      time: new Date().toLocaleTimeString(),
      type: importedData.exportType,
      count: importedData.data.length
    });
    
    // Reload halaman setelah impor berhasil untuk memperbarui UI
    window.location.reload();
  };

  return (
    <Container>
      <Title>Manajemen Data</Title>
      <Description>
        Ekspor data Anda untuk dicadangkan atau impor dari file yang sudah diekspor sebelumnya.
        Pastikan data yang diimpor berasal dari aplikasi Planer untuk menghindari kesalahan.
      </Description>
      
      <StatsContainer>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Tugas</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Tugas Selesai</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{tasks.filter(t => t.timeSpent).length}</StatValue>
          <StatLabel>Tugas Terlacak</StatLabel>
        </StatItem>
      </StatsContainer>
      
      <Card>
        <CardTitle>Ekspor Data</CardTitle>
        <Description>
          Ekspor data Anda sebagai file JSON yang dapat digunakan untuk mencadangkan
          atau memindahkan data ke perangkat lain.
        </Description>
        <ButtonsContainer>
          <ExportButton type="tasks" buttonText="Ekspor Tugas" />
          <ExportButton type="all" buttonText="Ekspor Semua Data" />
          <ExportButton type="projects" buttonText="Ekspor Proyek" />
        </ButtonsContainer>
      </Card>
      
      <Card>
        <CardTitle>Impor Data</CardTitle>
        <Description>
          Impor data dari file JSON yang diekspor sebelumnya. Data yang ada akan digabungkan dengan
          data impor. Perhatikan bahwa pengimporan dapat menimpa data yang sudah ada jika ID-nya sama.
        </Description>
        <ImportButton 
          onImportSuccess={handleImportSuccess}
          buttonText="Pilih File untuk Diimpor"
        />
        
        {lastImport && (
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--success-color)' }}>
            Impor terakhir: {lastImport.count} item {lastImport.type} pada {lastImport.time}
          </div>
        )}
      </Card>
    </Container>
  );
};

export default DataManagement; 