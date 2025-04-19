import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../contexts/ThemeContext';
import Button from './Button';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  cursor: pointer;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: bold;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: none;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
`;

const ThemeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ThemeButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.active ? 'white' : 'transparent'};
  background-color: ${props => props.bgColor};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid white;
`;

const Header = () => {
  const { currentTheme, changeTheme, themes } = useContext(ThemeContext);
  
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>P</LogoIcon>
        <span>Planer</span>
      </Logo>
      
      <RightSection>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput placeholder="Search tasks, events, or projects..." />
        </SearchContainer>
        
        <ThemeSelector>
          <ThemeButton 
            bgColor={themes.green.primary} 
            active={currentTheme === 'green'} 
            onClick={() => changeTheme('green')}
            title="Green Theme"
          />
          <ThemeButton 
            bgColor={themes.purple.primary} 
            active={currentTheme === 'purple'} 
            onClick={() => changeTheme('purple')}
            title="Purple Theme"
          />
          <ThemeButton 
            bgColor={themes.blue.primary} 
            active={currentTheme === 'blue'} 
            onClick={() => changeTheme('blue')}
            title="Blue Theme"
          />
        </ThemeSelector>
        
        <Button 
          type="icon" 
          title="Notifications"
          onClick={() => console.log('Notifications clicked')}
        >
          🔔
        </Button>
        
        <ProfileButton title="User Profile">
          U
        </ProfileButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header; 