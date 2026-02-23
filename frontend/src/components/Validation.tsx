import React from 'react';
import '../styles/validation.css';

interface ValidationErrorProps {
  error?: string;
  showIcon?: boolean;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ error, showIcon = true }) => {
  if (!error) return null;

  return (
    <div className="validation-error">
      {showIcon && <span className="error-icon">!</span>}
      <span>{error}</span>
    </div>
  );
};

interface InputWithValidationProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
  icon?: string;
}

export const InputWithValidation: React.FC<InputWithValidationProps> = ({
  label,
  error,
  helper,
  icon,
  ...props
}) => {
  return (
    <div className="form-group-validation">
      <label>{label}</label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input {...props} className={`input-field ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`} />
      </div>
      {error && <ValidationError error={error} />}
      {helper && !error && <div className="helper-text">{helper}</div>}
    </div>
  );
};

interface FormFieldStatusProps {
  isValid: boolean;
  isDirty: boolean;
  isEmpty?: boolean;
}

export const FormFieldStatus: React.FC<FormFieldStatusProps> = ({ isValid, isDirty, isEmpty }) => {
  if (!isDirty && !isEmpty) return null;

  return (
    <span className={`field-status ${isValid ? 'valid' : 'invalid'}`}>
      {isValid ? '✓' : '✕'}
    </span>
  );
};
