import React, { useEffect, useRef, useState } from 'react';
import TextAreaComponent from '../../../form/TextAreaComponent';

interface AgentInstructionsProps {
  formValues: { agent_character: string };
  handleChange: (name: string, value: string, type: string) => void;
  isFormReset: boolean;
  setSaveClicked: (clicked: boolean) => void;
}

const AgentInstructions: React.FC<AgentInstructionsProps> = ({
  formValues,
  handleChange,
  isFormReset,
  setSaveClicked
}) => {
  const [inputText, setInputText] = useState(formValues.agent_character || '');
  const [savedText, setSavedText] = useState('');

  const handleSave = () => {
    setSavedText(inputText);
    handleChange('agent_character', inputText, 'textarea'); // Update formValues with the saved text
    setSaveClicked(true); // Notify parent component that Save button has been clicked
  };

  // const handleLinkClick = (event) => {
  //   event.preventDefault();
  //   const modalElement = document.getElementById('exampleModal');
  //   const myModal = new bootstrap.Modal(modalElement);
  //   myModal.show();
  // };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height based on content
    }
  }, [inputText]);

  // const handleTextChange = (name, value) => {
  //   setInputText(value);
  // };

  return (
    <div className="row px-2">
      <div className="col-md-12 px-0">
        {/* <div className="row form-group">
          <label className='cutom-label ml-3 mt-2'>Select Input Type</label>
        </div>
        <div className="col-md-12 d-flex mt-1 mb-3">
          Specify your use case's input elements to precisely tailor user interactions
          <a
            className="active rounded-pill ml-1 cursor-pointer"
            onClick={handleLinkClick}
          >
            Read more...           </a>
        </div> */}
        <div className="card-body col-md-12 px-2 mt-4">
          {/* <span className="col-lg-12 moduleHeading mt-2 mb-10">Previewing the Standard Input element</span> */}
          <div className="card-header col-md-12 px-0" style={{ borderRadius: '8px' }}>
            <div className="col-md-12 px-4">
              <>
                <TextAreaComponent
                  name="agent_character"
                  label="Agent Instructions (Character properties)"
                  onTextChange={(name, value) => {
                    setInputText(value);
                  }}
                  isRequired={true}
                  minCharLength={40}
                  value={inputText}
                  rows={6}
                  textareaRef={textareaRef}
                />

                {savedText && (
                  <div>
                    <h5>Saved Instructions :</h5>
                    <div className="bg-white p-2" style={{ borderRadius: '12px' }}>
                      {savedText}
                    </div>
                  </div>
                )}
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className={`btn-primary fw-normal rounded-3 ${inputText.length < 40 ? 'disabled-button' : ''}`}
                    onClick={handleSave}
                    disabled={inputText.length < 40}>
                    Save
                  </button>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentInstructions;
