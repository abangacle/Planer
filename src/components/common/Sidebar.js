import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';

const SidebarContainer = styled.aside`
  background-color: var(--background-secondary);
  width: ${props => props.collapsed ? '60px' : '250px'};
  height: 100%;
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  border-bottom: 1px solid var(--border-color);
`;

const SidebarTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: ${props => props.collapsed ? '0.75rem 0' : '0.75rem 1rem'};
  gap: 0.75rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: ${props => props.collapsed ? '0' : '4px'};
  margin: ${props => props.collapsed ? '0' : '0 0.5rem'};
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background-color: var(--primary-light);
    color: var(--primary-color);
    font-weight: 500;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 1.2rem;
`;

const LabelWrapper = styled.span`
  display: ${props => props.collapsed ? 'none' : 'inline'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  align-items: center;
`;

const SidebarSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 1rem 0.5rem;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const Sidebar = ({ onNavigate = () => {}, currentPage = 'dashboard' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState(currentPage);
  
  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  // Define navigation items
  const mainNavItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', link: '#' },
    { id: 'tasks', icon: '✓', label: 'Tugas', link: '#' },
    { id: 'calendar', icon: '📅', label: 'Kalender', link: '#', disabled: true },
    { id: 'projects', icon: '🎯', label: 'Proyek', link: '#', disabled: true },
    { id: 'timer', icon: '⏱️', label: 'Timer Fokus', link: '#' }
  ];
  
  const toolsNavItems = [
    { id: 'notes', icon: '📝', label: 'Catatan', link: '#', disabled: true },
    { id: 'reports', icon: '📈', label: 'Laporan', link: '#', disabled: true },
    { id: 'settings', icon: '⚙️', label: 'Pengaturan', link: '#' }
  ];
  
  const handleNavItemClick = (pageId, disabled) => {
    if (disabled) return;
    
    setActivePage(pageId);
    onNavigate(pageId);
  };
  
  const renderNavItem = (item) => (
    <NavItem key={item.id}>
      <NavLink 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          handleNavItemClick(item.id, item.disabled);
        }}
        collapsed={collapsed} 
        className={activePage === item.id ? 'active' : ''}
        style={{ opacity: item.disabled ? 0.5 : 1, cursor: item.disabled ? 'not-allowed' : 'pointer' }}
      >
        <IconWrapper>{item.icon}</IconWrapper>
        <LabelWrapper collapsed={collapsed}>
          {item.label}
          {item.disabled && !collapsed && <small style={{ marginLeft: '5px', fontSize: '0.7rem' }}>(Segera)</small>}
        </LabelWrapper>
      </NavLink>
    </NavItem>
  );
  
  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        <SidebarTitle collapsed={collapsed}>Navigasi</SidebarTitle>
        <Button 
          type="icon" 
          onClick={toggleCollapse} 
          title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {collapsed ? '→' : '←'}
        </Button>
      </SidebarHeader>
      
      <NavList>
        {mainNavItems.map(renderNavItem)}
      </NavList>
      
      <SidebarSection>
        <SectionTitle collapsed={collapsed}>Alat</SectionTitle>
        <NavList>
          {toolsNavItems.map(renderNavItem)}
        </NavList>
      </SidebarSection>
      
      <SidebarFooter collapsed={collapsed}>
        {!collapsed && <span>v1.0.0</span>}
        <Button 
          type="icon" 
          title="Bantuan"
          onClick={() => console.log('Help clicked')}
        >
          ?
        </Button>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar; 