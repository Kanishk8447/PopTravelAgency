import React, { useEffect, useState } from 'react';
import ToolTip from './ToolTip';
import { notification } from '../service/notification-Service';

interface DynamicInputComponentProps {
  label: string;
  name: string;
  placeholder?: string;
  onTextChange?: (name: string, value: string) => void;
  autoComplete?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  onReset?: boolean;
  type?: string;
  value?: any;
  className?: string;
  disabled?: boolean;
  min?: string | number;
  pattern?: string;
  errorMessage?: string;
  inputType?: string;
  inputSymbol?: string;
  max?: string | number;
  step?: string | number;
  showToolTip?: boolean;
  initiativePaste?: boolean;
  maxLength?: number; // Add maxLength as an optional prop
}

const DynamicInputComponent: React.FC<DynamicInputComponentProps> = ({
  label,
  name,
  placeholder,
  onTextChange,
  autoComplete,
  onKeyDown,
  isRequired = false,
  onReset,
  type,
  value,
  className,
  disabled,
  min,
  pattern = '',
  errorMessage = '',
  inputType,
  inputSymbol,
  max,
  step,
  showToolTip = false,
  initiativePaste = false,
  maxLength // Accept maxLength
}) => {
  const [text, setText] = useState(value || '');

  useEffect(() => {
    if (onReset) {
      setText(value || '');
    }
  }, [onReset]);

  useEffect(() => {
    setText(value || ''); // Update the internal state when the value prop changes
  }, [value]);

  const isInputValid = (input: string): boolean => {
    const trimmedInput = input.trim();
    const regex = new RegExp(pattern);
    return trimmedInput !== '' && regex.test(trimmedInput);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = e.target.value;
    if (pattern) {
      // Allow empty string or valid pattern
      if (inputValue === '' || isInputValid(inputValue)) {
        setText(inputValue);
        onTextChange && onTextChange(name, inputValue);
      }
    } else {
      // If no pattern is provided, accept the input as is
      setText(inputValue);
      onTextChange && onTextChange(name, inputValue);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>): void => {
    if (!pattern) {
      // If no pattern is provided, allow normal paste
      return;
    }

    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text'); // Get plain text from clipboard

    if (!pastedText) {
      // If the pasted content is not text (e.g., an image), show a meaningful error notification
      notification('error', 'Pasting images or unsupported content is not allowed.');
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const selectionStart = inputElement.selectionStart || 0;
    const selectionEnd = inputElement.selectionEnd || 0;
    const currentValue = inputElement.value;

    // Build the new text by replacing only the selected portion
    const beforeSelection = currentValue.substring(0, selectionStart);
    const afterSelection = currentValue.substring(selectionEnd);

    let newText: string;
    let cleanedPastedText: string;

    if (initiativePaste) {
      const pattern = /[^a-zA-Z0-9]+/g;
      cleanedPastedText = pastedText.replace(pattern, '');
    } else {
      cleanedPastedText = pastedText;
    }

    newText = beforeSelection + cleanedPastedText + afterSelection;

    if (maxLength && newText.length > maxLength) {
      // If the new text exceeds the maxLength, show a notification
      notification('error', `Maximum ${maxLength} characters are allowed.`);
      return;
    }

    const validPaste = isInputValid(newText);

    if (validPaste) {
      setText(newText);
      onTextChange && onTextChange(name, newText);

      // Set cursor position after paste
      setTimeout(() => {
        const newCursorPosition = selectionStart + cleanedPastedText.length;
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      notification('error', errorMessage || 'Invalid input.');
    }
  };

  const handleBlur = () => {
    if (!pattern) {
      // If no pattern is provided, accept the input as is
      onTextChange && onTextChange(name, text);
      return;
    }

    const validBlur = isInputValid(text);
    if (validBlur) {
      onTextChange && onTextChange(name, text);
    } else {
      setText(''); // Clear if it's invalid
      onTextChange && onTextChange(name, '');
    }
  };

  const renderInputGroup = () => {
    if (inputType === 'inputGroup') {
      return (
        <div className="input-group">
          <span className="input-group-text">{inputSymbol}</span>
          <input
            type={type}
            name={name}
            required={isRequired}
            className={`form-control dynamic-input-value padding-top-bottom shadow-none  ${className} `}
            id={`textInput-${name}`}
            value={text}
            onChange={handleTextChange}
            disabled={disabled}
            autoComplete={autoComplete}
            onBlur={handleBlur}
            min={min}
            max={max}
            onKeyDown={onKeyDown}
            onPaste={handlePaste}
            pattern={pattern}
            step={step}
            placeholder={placeholder}
            maxLength={maxLength} // Pass maxLength to the input
          />
          {/* Add additional elements like buttons or dropdowns here */}
        </div>
      );
    } else {
      return (
        <input
          type={type}
          name={name}
          required={isRequired}
          className={`form-control dynamic-input-value std-background shadow-none padding-top-bottom ${className}`}
          id={`textInput-${name}`}
          value={text}
          onChange={handleTextChange}
          disabled={disabled}
          autoComplete={autoComplete}
          onBlur={handleBlur}
          min={min}
          max={max}
          onKeyDown={onKeyDown}
          onPaste={handlePaste}
          pattern={pattern}
          step={step}
          placeholder={placeholder}
          maxLength={maxLength} // Pass maxLength to the input
        />
      );
    }
  };

  return (
    <div className="row">
      <div className="form-group col-12">
        <label htmlFor={`textInput-${name}`}>
          {label}
          {showToolTip && (
            <>
              <ToolTip message={name} />
            </>
          )}
        </label>
        {renderInputGroup()}
      </div>
    </div>
  );
};

export default DynamicInputComponent;
