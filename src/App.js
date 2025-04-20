import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import Timer from './pages/Timer';
import Tasks from './pages/Tasks';

// Temporary placeholder components
const PlaceholderHeader = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlaceholderSidebar = styled.aside`
  background-color: var(--background-secondary);
  width: 250px;
  padding: 1rem;
  height: 100%;
  border-right: 1px solid var(--border-color);
`;

const PlaceholderContent = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentWrapper = styled.main`
  flex: 1;
  overflow-y: auto;
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle sidebar navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'timer':
        return <Timer />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <AppContainer className="app">
        <div className="flex items-center justify-center" style={{ height: '100vh' }}>
          <div className="text-center">
            <h1 style={{ color: 'var(--primary-color)' }}>Planer</h1>
            <p>Loading...</p>
          </div>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer className="app">
      <Header />
      
      <MainContainer>
        <Sidebar onNavigate={handleNavigation} />
        <ContentWrapper>
          {renderPage()}
        </ContentWrapper>
      </MainContainer>
    </AppContainer>
  );
}

export default App; 