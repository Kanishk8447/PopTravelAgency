import React, { useEffect, useState } from 'react';
// import ModalPopup from '../modules/ModelManagement/ModelPopUp';

interface TextAreaComponentProps {
  label?: string;
  name: string;
  onTextChange?: (name: string, value: string) => void;
  onBlur?: (name: string, value: string) => void;
  isRequired?: boolean;
  onReset?: boolean;
  value?: string;
  sampleText?: string;
  disabled?: boolean;
  enable_clear_btn?: boolean;
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
  isNoteRequired?: boolean;
  noteText?: string;
  minCharLength?: number;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

const TextAreaComponent: React.FC<TextAreaComponentProps> = ({
  label,
  name,
  onTextChange,
  onBlur,
  isRequired,
  onReset,
  value,
  sampleText,
  disabled,
  enable_clear_btn = true,
  rows = 4,
  placeholder = '',
  readOnly,
  isNoteRequired = false,
  noteText = '',
  minCharLength, // minCharLength now optional
  textareaRef // Add this prop
}) => {
  const [text, setText] = useState(value || '');
  // const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const handleShowModal = () => {
  //   setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  useEffect(() => {
    if (onReset) {
      setText(value || '');
    }
  }, [onReset]);

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.trim() !== '') {
      setText(newText);
      onTextChange && onTextChange(name, newText);

      if (minCharLength && newText.length < minCharLength) {
        setErrorMessage(`Minimum ${minCharLength} characters required.`);
      } else {
        setErrorMessage('');
      }
    } else {
      setText('');
      onTextChange && onTextChange(name, '');
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    setText('');
    onTextChange && onTextChange(name, '');
    setErrorMessage('');
  };

  const handleBlur = () => {
    if (text.trim() !== '') {
      onTextChange && onTextChange(name, text);
      onBlur && onBlur(name, text);

      if (minCharLength && text.length < minCharLength) {
        setErrorMessage(`Minimum ${minCharLength} characters required.`);
      } else {
        setErrorMessage('');
      }
    } else {
      setText('');
      onTextChange && onTextChange(name, '');
      onBlur && onBlur(name, '');
      setErrorMessage('');
    }
  };

  return (
    <div className="mb-0">
      <div className="row">
        <div className="form-group col-12" style={{ position: 'relative' }}>
          <label htmlFor={`textInput-${name}`}>
            <div className="d-flex align-items-center">
              {label && <span className="material-icons-round std-color">description</span>}{' '}
              <span className="ml-1 Ubuntu dynamicFileLabel fw-medium mr-2">{label} </span>
              {/* {sampleText && (
                <>
                  <span
                    className="ml-2 cursor-pointer text-decoration-underline std-color"
                    onClick={handleShowModal}>
                    Sample text
                  </span>
                  <ModalPopup
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    ModalTitle="Sample Text"
                    ModalData={sampleText}
                  />
                </>
              )} */}
            </div>
          </label>
          <div
            className="std-background std-border-radius p-2 d-flex"
            style={{ alignItems: 'center' }}>
            <textarea
              name={name}
              required={isRequired}
              className="form-control input-text shadow-none border-0"
              id={`textInput-${name}`}
              rows={rows}
              value={text}
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleTextChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              ref={textareaRef}></textarea>
            {text && enable_clear_btn && (
              <img
                src="/cleaning_services.svg"
                alt="Clear"
                className="material-symbols-outlined clear-button-brush"
                onClick={handleClear}
                title="Clear all text"
              />
            )}
          </div>
          {errorMessage && <div className="text-danger">{errorMessage}</div>}
          {isNoteRequired && (
            <div className={`col-14`}>
              <p style={{ fontSize: '12.5px' }}>
                <i>
                  <strong style={{ fontWeight: 'bold' }}>Note: </strong>
                  {noteText}
                </i>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextAreaComponent;
