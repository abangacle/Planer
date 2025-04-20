import React from 'react';
import styled from 'styled-components';
import DataManagement from '../components/settings/DataManagement';

const SettingsContainer = styled.div`
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

const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const Settings = () => {
  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>Pengaturan</PageTitle>
        <PageDescription>
          Kustomisasi aplikasi Planer sesuai kebutuhan Anda.
        </PageDescription>
      </PageHeader>
      
      <SettingsSection>
        <SectionTitle>Data dan Keamanan</SectionTitle>
        <DataManagement />
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle>Preferensi Pengguna</SectionTitle>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Pengaturan preferensi pengguna akan segera hadir.
          </p>
        </div>
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle>Tentang Aplikasi</SectionTitle>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Planer - Aplikasi Manajemen Tugas</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Versi 1.0.0<br />
            Dikembangkan sebagai aplikasi manajemen tugas yang kommprehensif <br />
            dengan fokus pada produktivitas dan analitik.
          </p>
          <p style={{ marginBottom: 0 }}>
            <a 
              href="https://github.com/ihyaabrar/Planer" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
            >
              Lihat di GitHub →
            </a>
          </p>
        </div>
      </SettingsSection>
    </SettingsContainer>
  );
};

export default Settings; 