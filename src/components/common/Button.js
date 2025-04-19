import React from 'react';
import styled, { css } from 'styled-components';

// Variasi button types
const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TEXT: 'text',
  ICON: 'icon'
};

// Variasi ukuran
const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Styled button base
const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Button type styles */
  ${props => {
    switch (props.buttonType) {
      case BUTTON_TYPES.PRIMARY:
        return css`
          background-color: var(--primary-color);
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: var(--primary-dark);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case BUTTON_TYPES.SECONDARY:
        return css`
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          
          &:hover:not(:disabled) {
            background-color: var(--primary-light);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case BUTTON_TYPES.TEXT:
        return css`
          background-color: transparent;
          color: var(--primary-color);
          border: none;
          padding: 0.25rem 0.5rem;
          
          &:hover:not(:disabled) {
            text-decoration: underline;
          }
        `;
      case BUTTON_TYPES.ICON:
        return css`
          background-color: transparent;
          color: var(--text-color);
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          
          &:hover:not(:disabled) {
            background-color: var(--background-secondary);
          }
        `;
      default:
        return '';
    }
  }}
  
  /* Button size styles */
  ${props => {
    switch (props.size) {
      case BUTTON_SIZES.SMALL:
        return css`
          padding: ${props.buttonType === BUTTON_TYPES.ICON ? '0.25rem' : '0.25rem 0.75rem'};
          font-size: 0.85rem;
        `;
      case BUTTON_SIZES.LARGE:
        return css`
          padding: ${props.buttonType === BUTTON_TYPES.ICON ? '0.75rem' : '0.75rem 1.5rem'};
          font-size: 1.1rem;
        `;
      default: // MEDIUM
        return css`
          padding: ${props.buttonType === BUTTON_TYPES.ICON ? '0.5rem' : '0.5rem 1rem'};
          font-size: 1rem;
        `;
    }
  }}
`;

const Button = ({
  children,
  type = 'primary',
  size = 'medium',
  icon,
  onClick,
  disabled = false,
  fullWidth = false,
  ...rest
}) => {
  // Determine button type
  let buttonType = BUTTON_TYPES.PRIMARY;
  if (Object.values(BUTTON_TYPES).includes(type)) {
    buttonType = type;
  }
  
  // Determine button size
  let buttonSize = BUTTON_SIZES.MEDIUM;
  if (Object.values(BUTTON_SIZES).includes(size)) {
    buttonSize = size;
  }
  
  return (
    <ButtonBase
      buttonType={buttonType}
      size={buttonSize}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      {...rest}
    >
      {icon && icon}
      {children && buttonType !== BUTTON_TYPES.ICON && children}
    </ButtonBase>
  );
};

export default Button; 