import React, { useState, useEffect } from 'react';

interface Option {
  value: string;
  label?: string;
  disabled?: boolean;
  name?: string;
}

interface DynamicSelectBoxProps {
  isRequired?: boolean;
  dynamicOptions: Option[];
  onSelectChange: (name: string, value: string | string[]) => void;
  name: string;
  label?: string;
  defaultValue?: string | string[];
  value?: string | string[]; // Add value prop for controlled component
  isMultiple?: boolean;
  disabled?: boolean;
  onReset?: boolean;
  readOnly?: boolean;
  dynamicClass?: string;
  placeholder?: string;
}

const DynamicSelectBox: React.FC<DynamicSelectBoxProps> = ({
  isRequired = false,
  dynamicOptions,
  onSelectChange,
  name,
  label,
  defaultValue,
  value,
  isMultiple,
  disabled,
  onReset,
  readOnly,
  dynamicClass,
  placeholder
}) => {
  // Use value prop if provided (controlled), otherwise use internal state (uncontrolled)
  const isControlled = value !== undefined;
  const [selectedOptions, setSelectedOptions] = useState(
    isControlled ? '' : defaultValue || (isMultiple ? [] : '')
  );

  // Only update internal state if component is uncontrolled
  useEffect(() => {
    if (!isControlled) {
      setSelectedOptions(defaultValue || (isMultiple ? [] : ''));
    }
  }, [defaultValue, isMultiple, onReset, isControlled]);

  const handleSelectChange = (e) => {
    if (readOnly) {
      return;
    }

    const selectedValue = isMultiple
      ? Array.from(e.target.selectedOptions, (option) => option.value)
      : e.target.value;

    // Only update internal state if component is uncontrolled
    if (!isControlled) {
      setSelectedOptions(selectedValue);
    }

    onSelectChange(name, selectedValue);
  };

  // Use value prop if controlled, otherwise use internal state
  const currentValue = isControlled ? value : selectedOptions;

  return (
    <div className={`form-group col-12`}>
      {label && <label htmlFor={`dynamicSelect_${name}`}>{label}</label>}
      <select
        id={`dynamicSelect_${name}`}
        className={`form-select dynamicSelect dynamic-select shadow-none ${dynamicClass || ''}`}
        name={name}
        multiple={isMultiple}
        value={currentValue}
        onChange={handleSelectChange}
        disabled={disabled}>
        <option value="" disabled>
          {placeholder || 'Select an option'}
        </option>
        {dynamicOptions?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicSelectBox;
