import React, { createContext, useState, useEffect } from 'react';

// Tema yang tersedia
const themes = {
  green: {
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    primaryLight: '#C8E6C9',
    textColor: '#212121',
    textSecondary: '#757575',
    backgroundColor: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    borderColor: '#E0E0E0'
  },
  purple: {
    primary: '#673AB7',
    primaryDark: '#512DA8',
    primaryLight: '#D1C4E9',
    textColor: '#212121',
    textSecondary: '#757575',
    backgroundColor: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    borderColor: '#E0E0E0'
  },
  blue: {
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#BBDEFB',
    textColor: '#212121',
    textSecondary: '#757575',
    backgroundColor: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    borderColor: '#E0E0E0'
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Cek jika ada tema yang tersimpan di localStorage
  const savedTheme = localStorage.getItem('theme') || 'green';
  const [currentTheme, setCurrentTheme] = useState(savedTheme);

  // Fungsi untuk mengubah tema
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  // Menerapkan tema pada CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      document.documentElement.style.setProperty('--primary-color', theme.primary);
      document.documentElement.style.setProperty('--primary-dark', theme.primaryDark);
      document.documentElement.style.setProperty('--primary-light', theme.primaryLight);
      document.documentElement.style.setProperty('--text-color', theme.textColor);
      document.documentElement.style.setProperty('--text-secondary', theme.textSecondary);
      document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
      document.documentElement.style.setProperty('--background-secondary', theme.backgroundSecondary);
      document.documentElement.style.setProperty('--border-color', theme.borderColor);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}; 