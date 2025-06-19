import React, { useEffect, useState, useRef, memo } from 'react';

import DynamicInputComponent from '../../../form/DynamicInputComponent';
import TextAreaComponent from '../../../form/TextAreaComponent';
import * as bootstrap from 'bootstrap';
import DeleteConfirmationModal from '../../../Modals/DeleteConfirmationModal';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import { notification } from '../../../service/notification-Service';
import DynamicSelectBox from '../../../form/DynamicSelectBoxComponent';
import apiService from '../../../service/apiService';

interface AgentDetailsProps {
  formValues: any;
  handleChange: (name: string, value: any, type?: string) => void;
  isFormReset: boolean;
  supervisorAgentIndex: number | null;
  setSupervisorAgentIndex: (idx: number | null) => void;
  editingInitiative?: InitiativeData;
}

const AgentDetails = ({
  formValues,
  handleChange,
  isFormReset,
  supervisorAgentIndex,
  setSupervisorAgentIndex,
  editingInitiative
}: AgentDetailsProps) => {
  const [icons, setIcons] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [allModels, setAllModels] = useState([]);
  const [inputText, setInputText] = useState(formValues.agent_character || '');
  const [savedText, setSavedText] = useState('');
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState<number | null>(0); // Track the active tab
  // const [agents, setAgents] = useState([
  //   { agent_name: '', agent_description: '', agent_character: '', model: '', isCollapsed: false }
  // ]);
  // const [agents, setAgents] = useState([
  //   { agent_name: '', agent_description: '', agent_character: '', isCollapsed: false }
  // ]);
  const agents = formValues.agents || [
    { agent_name: '', agent_description: '', agent_character: '', model: '', isCollapsed: false }
  ];

  // useEffect(() => {
  //   const fetchModelList = async () => {
  //     try {
  //       const response = await apiService.getData('model/list');
  //       if (response) {
  //         setAllModels(response);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching Models List:', error);
  //     }
  //   };
  //   fetchModelList();
  // }, []);
  
  useEffect(() => {
    fetch('/models.json')
      .then((response) => response.json())
      .then((data) => setAllModels(data))
      .catch((error) => console.error('Error fetching menu data:', error));
  }, []);

  // useEffect(() => {
  //   if (!formValues.cloud) {
  //     // If no cloud is selected, reset all agent models
  //     const updatedAgents = agents.map((agent) => ({
  //       ...agent,
  //       model: ''
  //     }));
  //     handleChange('agents', updatedAgents, 'array');
  //   }
  // }, [formValues.cloud]);

  // Track the previous cloud value to detect changes
  const previousCloudRef = useRef(formValues.cloud);

  useEffect(() => {
    if (formValues.cloud !== previousCloudRef.current) {
      // Reset models when the cloud provider changes
      const updatedAgents = agents.map((agent) => ({
        ...agent,
        model: ''
      }));
      handleChange('agents', updatedAgents, 'array');
      handleChange('global_model', null); // Reset global model selection

      // Update the previous cloud value
      previousCloudRef.current = formValues.cloud;
    }
  }, [formValues.cloud, handleChange]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // useEffect(() => {
  //   // if (filteredModels.length > 0) {
  //   //   setSelectedModel(filteredModels[0].name); // Default to first model for the selected cloud
  //   // } else {
  //   setSelectedModel('');
  // }, [formValues.cloud, allModels]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [orchestrationType, setOrchestrationType] = useState(
    formValues.multiagent_pattern || 'Sequential'
  );
  // Track hover/active state for each agent
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  // const isActive = activeTab === idx || hoveredIdx === idx;

  // const [supervisorAgentIndex, setSupervisorAgentIndex] = useState<number | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<number | null>(null);
  const [test, setTest] = useState(false);

  const handleAgentChange = (index, field, value) => {
    const shouldTrim =
      field === 'agent_name' ||
      field === 'agent_description' ||
      field === 'agent_character' ||
      field === 'model';

    if (field === 'agent_name' && value.length > 15) {
      notification('error', 'Only 15 characters allowed for Agent Name.');
      return;
    }

    const trimmedValue = typeof value === 'string' && shouldTrim ? value.trim() : value;

    const updatedAgents = [...agents];

    // Update the field as usual
    updatedAgents[index][field] = trimmedValue;

    // Remove the model reset logic - let each agent keep their model selection
    // Only clear model if it's being explicitly set to empty
    if (field === 'model' && !trimmedValue) {
      updatedAgents[index]['model'] = '';
    }

    handleChange('agents', updatedAgents, 'array');
  };
  const handleDeleteClick = (index: number) => {
    setAgentToDelete(index);
    setShowDeleteModal(true);
  };
  const [showOrchestrationDropdown, setShowOrchestrationDropdown] = useState(false);

  // Add validation function to check if all agents are complete
  const validateAllAgents = () => {
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      if (
        !agent.agent_name?.trim() ||
        !agent.agent_description?.trim() ||
        !agent.agent_character?.trim() ||
        !agent.model?.trim()
      ) {
        return {
          isValid: false,
          incompleteAgentIndex: i,
          missingFields: [
            !agent.agent_name?.trim() ? 'Agent Name' : null,
            !agent.agent_description?.trim() ? 'Agent Description' : null,
            !agent.agent_character?.trim() ? 'Agent Instruction' : null,
            !agent.model?.trim() ? 'Model Selection' : null
          ].filter(Boolean)
        };
      }
    }
    return { isValid: true };
  };

  const handleOrchestrationClick = () => {
    // Validate all agents before allowing access to orchestration
    const validation = validateAllAgents();

    if (!validation.isValid) {
      const agentName =
        agents[validation.incompleteAgentIndex].agent_name ||
        `Agent ${validation.incompleteAgentIndex + 1}`;
      const missingFieldsText = validation.missingFields.join(', ');

      notification(
        'error',
        `Please complete all required fields for ${agentName}. Missing: ${missingFieldsText}`
      );

      // Switch to the incomplete agent tab to help user fix it
      setActiveTab(validation.incompleteAgentIndex);
      setShowOrchestrationDropdown(false);
      return;
    }

    setShowOrchestrationDropdown((prev) => {
      if (!prev) setActiveTab(null); // Deselect agent tabs when opening orchestration
      return !prev;
    });
  };

  const handleOrchestrationOption = (option: string) => {
    setShowOrchestrationDropdown(false);
    // You can handle the selected option here if needed
    // e.g., setOrchestrationType(option);
  };

  const [draggedAgentIdx, setDraggedAgentIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDraggedAgentIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (idx: number) => {
    if (draggedAgentIdx === null || draggedAgentIdx === idx) return;
    const updatedAgents = [...agents];
    const [removed] = updatedAgents.splice(draggedAgentIdx, 1);
    updatedAgents.splice(idx, 0, removed);
    // setAgents(updatedAgents);
    handleChange('agents', updatedAgents, 'array');
    setDraggedAgentIdx(null);
  };

  const handleDeleteConfirm = () => {
    if (agentToDelete !== null) {
      const updatedAgents = agents.filter((_, i) => i !== agentToDelete);

      // Adjust activeTab: if the deleted tab was the last one, move to previous
      let newActiveTab = activeTab;
      if (activeTab >= updatedAgents.length) {
        newActiveTab = updatedAgents.length - 1;
      }
      setActiveTab(newActiveTab >= 0 ? newActiveTab : 0);

      // Reset supervisor index if only one agent remains
      if (updatedAgents.length <= 1) {
        setSupervisorAgentIndex(null);
      }
      // If we deleted the supervisor agent, reset the supervisor index
      else if (agentToDelete === supervisorAgentIndex) {
        setSupervisorAgentIndex(0); // Default to first agent
      }
      // If we deleted an agent with index less than supervisor, adjust supervisor index
      else if (agentToDelete < supervisorAgentIndex) {
        setSupervisorAgentIndex(supervisorAgentIndex - 1);
      }

      // Update the parent component's state with the updated agents array
      handleChange('agents', updatedAgents, 'array');

      setAgentToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setAgentToDelete(null);
    setShowDeleteModal(false);
  };

  const handleAddAgentSection = () => {
    const currentIdx = activeTab ?? agents.length - 1;
    const currentAgent = agents[currentIdx];

    if (
      !currentAgent.agent_name ||
      !currentAgent.agent_description ||
      !currentAgent.agent_character
    ) {
      notification(
        'error',
        'Please fill out agent name, description, and prompt before adding another agent.'
      );
      return;
    }

    const newAgent = {
      agent_name: '',
      agent_description: '',
      agent_character: '',
      model: '', // explicitly clear model
      guardrail: false,
      memory: false,
      web_scrape: false,
      isCollapsed: false,
      tags: ''
    };

    const updatedAgents = [...agents, newAgent];

    handleChange('agents', updatedAgents, 'array');
    setActiveTab(updatedAgents.length - 1); // Switch to the new tab
    setShowOrchestrationDropdown(false); // Hide orchestration details

    // Set default supervisorAgentIndex if not set
    if (formValues.orchestrationType === 'Supervisor' && supervisorAgentIndex === null) {
      setSupervisorAgentIndex(0);
    }
  };

  useEffect(() => {
    // Ensure supervisorAgentIndex is set when changing orchestration type
    if (formValues.orchestrationType === 'Supervisor' && supervisorAgentIndex === null) {
      setSupervisorAgentIndex(0); // Default to the first agent
    }
  }, [formValues.orchestrationType, supervisorAgentIndex, agents]);

  // In the JSX part, log the supervisorAgentIndex to verify

  const handleOptionChangeInButtons = (event) => {
    const selectedValue = event.target.value;
    setSelectedModel(selectedValue);
    handleChange('model', selectedValue);
  };

  const pluginAccess = [
    {
      label: 'Who should see this Use Case?',
      name: 'is_public',
      value: [
        { value: '0', label: 'Only Me' },
        { value: '1', label: 'Everyone' }
      ]
    }
  ];

  const handleLinkClick = (event) => {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModal');
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();
  };

  const handleSelect = (iconName) => {
    handleChange('icon_name', iconName);
    setIsOpen(false);
  };

  const handleSeeMoreClick = (e) => {
    e.preventDefault();
    setIsExpanded(true);
  };

  const handleSave = () => {
    setSavedText(inputText);
    handleChange('agent_character', inputText, 'textarea');
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleToggleCollapse = (index) => {
    const updatedAgents = [...agents];
    updatedAgents[index].isCollapsed = !updatedAgents[index].isCollapsed;
    // setAgents(updatedAgents);
  };

  const nameCharacters = (event) => {
    // Only allow letters
    validateInputCharacters(event, /^[a-zA-Z]+$/);

    const input = event.target;

    // Notify if special character is attempted
    if (
      input.name.startsWith('agent_name_') &&
      event.key.length === 1 && // Only printable characters
      !/[a-zA-Z]/.test(event.key) &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      notification('error', 'Only alphabets are allowed for Agent Name.');
    }

    // If already at max length and user tries to type a printable character, show notification
    if (
      input.name.startsWith('agent_name_') &&
      input.value.length === 15 &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      notification('error', 'Only 15 characters allowed for Agent Name.');
    }
  };
  function validateInputCharacters(event: React.KeyboardEvent<HTMLInputElement>, regex: RegExp) {
    // Allow navigation keys, backspace, delete, etc.
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(event.key)
    ) {
      return;
    }
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  const swapAgents = (i: number, j: number) => {
    const updatedAgents = [...agents];
    [updatedAgents[i], updatedAgents[j]] = [updatedAgents[j], updatedAgents[i]];
    // setAgents(updatedAgents);
    // If one of the swapped indices is the supervisor, update supervisorAgentIndex accordingly
    if (i === (supervisorAgentIndex ?? 0)) {
      setSupervisorAgentIndex(j);
    } else if (j === (supervisorAgentIndex ?? 0)) {
      setSupervisorAgentIndex(i);
    }
    handleChange('agents', updatedAgents, 'array');
  };

  const [tools, setTools] = useState([{ value: 'true', label: 'Web Scrape' }]);

  // This function will handle changes in the DynamicSelectBox
  const handleToolChange = (name, value) => {
    setTools(value);
    handleChange(name, value);
  };

  const filteredModels = allModels?.filter((model) => model.provider === formValues.cloud);

  useEffect(() => {
    if (formValues.llms && formValues.llms.name && !formValues.global_model) {
      handleChange('global_model', formValues.llms.name);
    }
  }, [formValues.llms.name]);

  useEffect(() => {
    if (formValues.multiagent_pattern && !formValues.orchestrationType) {
      const supervisorIndex = agents.findIndex((agent) => agent.is_supervisor);
      handleChange('orchestrationType', formValues.multiagent_pattern);
      setSupervisorAgentIndex(supervisorIndex);
    }
  }, [formValues.multiagent_pattern, agents, formValues.orchestrationType]);

  return (
    <>
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '3px 24px 32px 24px',
          margin: '0 0 32px 0',
          boxShadow: '0 2px 8px #e0e0e0',
          width: '100%'
        }}>
        <div className="row mt-4" style={{ alignItems: 'center' }}>
          <div className="col-md-4">
            <DynamicInputComponent
              label="Initiative Name"
              name="initiative_name"
              value={formValues.name || ''}
              onTextChange={(name, value) => handleChange('name', value, 'input')}
              placeholder="Enter Initiative Name"
              className="form-control initiative-input"
              autoComplete="off"
              style={{ height: 48, fontSize: 16, width: '100%' }}
            />
          </div>
          <div className="col-md-4">
            <DynamicSelectBox
              name="cloud"
              label="Cloud Provider"
              dynamicOptions={[
                // { value: '', label: 'Select Cloud', disabled: true },
                { value: 'AWS', label: 'AWS' },
                { value: 'AZURE', label: 'Azure' }
              ]}
              defaultValue={formValues.cloud || ''}
              onSelectChange={(name, value) => handleChange('cloud', value)}
            />
          </div>
          <div className="col-md-4">
            {/* <label htmlFor="model" className="form-label" style={{ fontWeight: 600 }}>
              Select Model
            </label> */}
            <DynamicSelectBox
              name="global_model"
              label="Initiative Model Selection"
              dynamicOptions={[
                // { value: '', disabled: true },
                ...filteredModels.map((model) => ({
                  value: model.name,
                  label: model.label
                }))
              ]}
              value={formValues.global_model || ''}
              //value={formValues.global_model || formValues.llms.name || ''}
              onSelectChange={(name, value) => {
                // Only update the global model value, don't apply to agents
                handleChange('global_model', value);
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: '#F9F9F9', // White background for the inner content
            borderRadius: 16,
            padding: '24px 16px 24px 16px',
            boxShadow: '0 1px 4px #e0e0e0',
            width: '100%'
          }}>
          {/* Custom Agent Tabs */}
          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
            {agents.map((agent, index) => {
              const isActive = activeTab === index && !showOrchestrationDropdown;
              return (
                <div
                  key={index}
                  className="agent-tab-title"
                  style={{
                    position: 'relative',
                    background: isActive ? '#025A82' : '#fff',
                    color: isActive ? '#fff' : '#222',
                    borderRadius: '18px 18px 0 0',
                    minWidth: 110,
                    padding: '10px 28px',
                    marginRight: 8,
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 8px #e0e0e0' : 'none',
                    // border: isActive ? 'none' : '1px solid #e0e0e0',

                    zIndex: isActive ? 2 : 1,
                    opacity: showOrchestrationDropdown ? 0.6 : 1,
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onClick={() => {
                    setActiveTab(index);
                    setShowOrchestrationDropdown(false);
                  }}
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}>
                  {agent.agent_name ? agent.agent_name : `Agent ${index + 1}`}
                  {agents.length > 1 && isActive && !editingInitiative && (
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        right: '-14px',
                        background: '#fff',
                        borderRadius: '50%',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        padding: 0,
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3,
                        color: 'red',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(index);
                      }}>
                      {/* <i className="bi bi-trash" style={{ fontSize: 22, color: '#E14B4B' }} /> */}
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18" stroke="#E14B4B" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                          stroke="#E14B4B"
                          strokeWidth="2"
                        />
                        <rect
                          x="5"
                          y="6"
                          width="14"
                          height="14"
                          rx="2"
                          stroke="#E14B4B"
                          strokeWidth="2"
                        />
                        <path d="M10 11v4" stroke="#E14B4B" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14 11v4" stroke="#E14B4B" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
            {!editingInitiative && (
              <button
                type="button"
                onClick={handleAddAgentSection}
                style={{
                  position: 'relative',
                  background: '#5a8ca5',
                  color: '#fff',
                  borderRadius: '18px 18px 0 0',
                  minWidth: 110,
                  padding: '10px 28px',
                  marginRight: 8,
                  fontWeight: 600,
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  border: 'none',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s, color 0.2s'
                }}>
                <i className="bi-plus" style={{ marginRight: '8px', fontSize: 22 }} /> Add Agent
              </button>
            )}
            {agents.length > 1 && (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={{
                    position: 'relative',
                    background: showOrchestrationDropdown ? '#02344d' : '#5a8ca5', // darker when active
                    color: '#fff',
                    borderRadius: '18px 18px 0 0',
                    minWidth: 110,
                    height: '48px',
                    padding: '10px 28px',
                    marginRight: 8,
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onClick={handleOrchestrationClick}>
                  Orchestration
                </button>
              </div>
            )}
          </div>
          {/* Orchestration UI or Agent Details below the tabs */}
          <div
            style={{
              background: '#fff',
              borderRadius: '0 0 16px 16px', // Only bottom corners rounded
              padding: '24px 16px',
              marginTop: 0, // Remove gap between tabs and box
              boxShadow: '0 1px 4px #e0e0e0',
              width: '100%'
            }}>
            {showOrchestrationDropdown && agents.length > 1 ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                {/* Left column: Termination, Max Messages, Orchestration, Supervisor */}
                <div style={{ minWidth: 500, width: '100%' }}>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <DynamicInputComponent
                        label="Termination Condition"
                        name="termination_condition"
                        value={formValues.termination_condition || ''}
                        onTextChange={(name, value) =>
                          handleChange('termination_condition', value, 'input')
                        }
                        placeholder="Type Agent Name|..."
                        className="form-control"
                        autoComplete="off"
                      />
                      <DynamicInputComponent
                        label="Max Messages"
                        name="max_messages"
                        value={formValues.max_messages || ''}
                        onTextChange={(name, value) => handleChange('max_messages', value, 'input')}
                        placeholder="Type Max Messages..."
                        className="form-control"
                        autoComplete="off"
                        type="number" // Optional: restrict to numbers
                      />
                    </div>
                    <div className="col-md-4">
                      <DynamicSelectBox
                        name="orchestrationType"
                        label="Select Orchestration"
                        dynamicOptions={[
                          { value: 'Supervisor', label: 'Supervisor' },
                          { value: 'Sequential', label: 'Sequential' }
                        ]}
                        value={formValues.orchestrationType || formValues.multiagent_pattern || ''}
                        onSelectChange={(name, value) => {
                          handleChange('orchestrationType', value);
                          if (value !== formValues.multiagent_pattern) {
                            setSupervisorAgentIndex(null); // Reset supervisor index if orchestration type changes
                          }
                        }}
                      />

                      {formValues.orchestrationType === 'Supervisor' && (
                        <>
                          <div style={{ marginTop: '36px' }}>
                            <DynamicSelectBox
                              name="supervisorAgentIndex"
                              label="Select Supervisor Agent"
                              dynamicOptions={agents.map((agent, idx) => ({
                                value: idx,
                                label: agent.agent_name ? agent.agent_name : `Agent ${idx + 1}`
                              }))}
                              value={
                                supervisorAgentIndex !== null
                                  ? supervisorAgentIndex
                                  : agents.findIndex((agent) => agent.is_supervisor)
                              }
                              onSelectChange={(name, value) => {
                                setSupervisorAgentIndex(Number(value));
                                handleChange('supervisorAgentIndex', Number(value), 'input');
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Supervisor Flowchart */}
                {formValues.orchestrationType === 'Supervisor' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      marginLeft: 0, // No left margin
                      marginTop: 4, // Reduced from 8 to 4
                      minWidth: 0,
                      width: '100%'
                    }}>
                    <div
                      style={{
                        background: '#f8f9fa',
                        borderRadius: 18,
                        padding: '24px 32px',
                        width: '100%',
                        boxShadow: '0 2px 8px #e0e0e0',
                        minHeight: 120,
                        overflowX: 'auto'
                      }}>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>
                        Drag selected supervisor agent to the designated spot
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          minWidth: 600
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
                          <span style={{ fontWeight: 700, fontSize: 18, minWidth: 140 }}>
                            Supervisor Agent:
                          </span>
                          <div
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                'text/plain',
                                (supervisorAgentIndex ?? 0).toString()
                              );
                              setDraggedAgentIdx(supervisorAgentIndex ?? 0);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (
                                draggedAgentIdx !== null &&
                                draggedAgentIdx !== (supervisorAgentIndex ?? 0)
                              ) {
                                swapAgents(supervisorAgentIndex ?? 0, draggedAgentIdx);
                              }
                              setDraggedAgentIdx(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              background: '#fff',
                              border: '2px dashed #b2c7d9',
                              borderRadius: 24,
                              minWidth: 140,
                              height: 48,
                              fontWeight: 700,
                              fontSize: 20,
                              color: '#222',
                              marginLeft: 16
                            }}>
                            <div
                              style={{
                                width: 22,
                                height: 48,
                                background: '#5a8ca5',
                                borderRadius: '24px 0 0 24px',
                                marginRight: -8,
                                borderTop: '2px dashed #b2c7d9',
                                borderBottom: '2px dashed #b2c7d9',
                                borderLeft: '2px dashed #b2c7d9',
                                borderRight: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                            <span style={{ marginLeft: 16 }}>
                              {agents[supervisorAgentIndex ?? 0]?.agent_name
                                ? agents[supervisorAgentIndex ?? 0].agent_name
                                : `Agent ${(supervisorAgentIndex ?? 0) + 1}`}
                            </span>
                          </div>
                        </div>
                        {/* Child Agents */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ fontWeight: 700, fontSize: 18, minWidth: 140 }}>
                            Child Agents:
                          </span>
                          <div style={{ display: 'flex', gap: 16 }}>
                            {agents
                              .map((agent, idx) => ({ agent, idx }))
                              .filter(({ idx }) => idx !== (supervisorAgentIndex ?? 0))
                              .map(({ agent, idx }) => (
                                <div
                                  key={idx}
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', idx.toString());
                                    setDraggedAgentIdx(idx);
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (
                                      draggedAgentIdx !== null &&
                                      draggedAgentIdx === (supervisorAgentIndex ?? 0)
                                    ) {
                                      swapAgents(supervisorAgentIndex ?? 0, idx);
                                    }
                                    setDraggedAgentIdx(null);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: '#fff',
                                    border: '2px dashed #b2c7d9',
                                    borderRadius: 24,
                                    minWidth: 140,
                                    height: 48,
                                    fontWeight: 700,
                                    fontSize: 20,
                                    color: '#222'
                                  }}>
                                  <div
                                    style={{
                                      width: 22,
                                      height: 48,
                                      background: '#5a8ca5',
                                      borderRadius: '24px 0 0 24px',
                                      marginRight: -8,
                                      borderTop: '2px dashed #b2c7d9',
                                      borderBottom: '2px dashed #b2c7d9',
                                      borderLeft: '2px dashed #b2c7d9',
                                      borderRight: 'none',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                  <span style={{ marginLeft: 16 }}>
                                    {agent.agent_name ? agent.agent_name : `Agent ${idx + 1}`}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sequential Flow Chart */}
                {formValues.orchestrationType === 'Sequential' && (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 120,
                      marginRight: '100px',
                      maxWidth: 700
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        // marginLeft: 180,
                        minWidth: 0
                      }}>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>
                        Drag in order of required sequence (<i>left to right</i>)
                      </div>
                      <div
                        style={{
                          overflowX: 'auto',
                          maxWidth: 700,
                          width: '100%'
                        }}>
                        <div
                          style={{
                            background: '#f8f9fa',
                            borderRadius: 18,
                            padding: '24px 32px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 8px #e0e0e0',
                            minHeight: 70
                          }}>
                          {agents.map((agent, idx) => {
                            const isActive = activeTab === idx || hoveredIdx === idx;
                            const borderColor = '#b2c7d9';

                            const agentStyle: React.CSSProperties = {
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 28px 0 0',
                              background: '#fff',
                              color: '#222',
                              borderRadius: 24,
                              fontWeight: 700,
                              minWidth: 110,
                              height: 48,
                              textAlign: 'center',
                              border: `2px dashed ${borderColor}`,
                              borderLeft: 'none',
                              cursor: 'grab',
                              fontSize: 18,
                              marginRight: idx < agents.length - 1 ? 0 : 0,
                              marginLeft: idx === 0 ? 0 : 0,
                              boxShadow: undefined,
                              transition:
                                'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s'
                            };

                            const leftPillStyle: React.CSSProperties = {
                              width: 22,
                              height: 48,
                              background: isActive ? '#176086' : '#5a8ca5',
                              borderRadius: '24px 0 0 24px',
                              marginRight: -8,
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTop: `2px dashed ${borderColor}`,
                              borderBottom: `2px dashed ${borderColor}`,
                              borderLeft: `2px dashed ${borderColor}`,
                              borderRight: 'none',
                              boxSizing: 'border-box',
                              transition: 'background 0.2s'
                            };

                            return (
                              <React.Fragment key={idx}>
                                <div
                                  draggable
                                  onDragStart={() => handleDragStart(idx)}
                                  onDragOver={handleDragOver}
                                  onDrop={() => handleDrop(idx)}
                                  onMouseEnter={() => setHoveredIdx(idx)}
                                  onMouseLeave={() => setHoveredIdx(null)}
                                  onClick={() => setActiveTab(idx)}
                                  style={agentStyle}>
                                  <div style={leftPillStyle}></div>
                                  <span style={{ marginLeft: 16, fontWeight: 700 }}>
                                    {agent.agent_name ? agent.agent_name : `Agent ${idx + 1}`}
                                  </span>
                                </div>
                                {idx < agents.length - 1 && (
                                  <span
                                    style={{
                                      margin: '0 18px',
                                      fontSize: 28,
                                      color: '#b2c7d9',
                                      fontWeight: 700,
                                      userSelect: 'none',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                    <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                                      <path
                                        d="M2 8h28m0 0l-5-5m5 5l-5 5"
                                        stroke="#b2c7d9"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              agents[activeTab] && (
                <div>
                  <div className="row mt-3">
                    <div className="col-md-4">
                      <DynamicInputComponent
                        onReset={isFormReset}
                        type="text"
                        name={`agent_name_${activeTab}`}
                        value={agents[activeTab]?.agent_name || ''}
                        label="Agent Name"
                        onTextChange={(name, value) =>
                          handleAgentChange(activeTab, 'agent_name', value)
                        }
                        className="rounded-3"
                        autoComplete="off"
                        pattern="[a-zA-Z]+"
                        onKeyDown={nameCharacters}
                        maxLength={15}
                      />
                    </div>
                    <div className="col-md-7">
                      <TextAreaComponent
                        onReset={isFormReset}
                        name={`agent_description_${activeTab}`}
                        label="Agent Description"
                        value={agents[activeTab]?.agent_description || ''}
                        onTextChange={(name, value) =>
                          handleAgentChange(activeTab, 'agent_description', value)
                        }
                        rows={1}
                        // style={{ resize: 'none' }}
                        className="rounded-3"
                      />
                    </div>
                  </div>

                  {/* Model select row */}
                  <div className="row mt-3" style={{ alignItems: 'flex-end' }}>
                    <div className="col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <label
                        htmlFor={`agent_model_${activeTab}`}
                        className="form-label"
                        style={{
                          fontWeight: 600,
                          marginBottom: -10, // Reduced from 8 to 2
                          marginLeft: 16,
                          display: 'block',
                          marginTop: '-18px'
                        }}>
                        Select Agent Model
                      </label>
                      <div
                        style={{
                          borderRadius: '12px',
                          marginBottom: 0,
                          // Remove or reduce height/minHeight to allow upward movement
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0,
                          boxShadow: 'none'
                        }}>
                        <div style={{ flex: 1 }}>
                          <DynamicSelectBox
                            name="model"
                            // label="Select Model"
                            dynamicOptions={[
                              // { value: '', label: 'Select Model', disabled: true },
                              ...filteredModels.map((model) => ({
                                value: model.name,
                                label: model.label
                              }))
                            ]}
                            value={
                              activeTab !== null && agents[activeTab]
                                ? agents[activeTab].model || ''
                                : ''
                            }
                            onSelectChange={(name, value) => {
                              if (activeTab !== null) {
                                handleAgentChange(activeTab, 'model', value);
                              }
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 500,
                              fontSize: 15,
                              color: '#222',
                              boxShadow: 'none',
                              resize: 'none',
                              paddingLeft: 8,
                              height: '100%',
                              width: '100%',
                              outline: 'none',
                              marginLeft: 0
                            }}
                          />
                          {/* Memory & Guardrails toggles below model select */}
                          {formValues.cloud === 'AWS' ? (
                            <div className="row mt-3" style={{ marginLeft: 1 }}>
                              
                              {/* <div className="col-md-6">
                                {formValues.cloud === 'AWS' && (
                                  <div className="col-md-12 p-0 mt-3">
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                                      Tool
                                      {editingInitiative ? (
                                        <span className="disabled-label ml-2">Disabled</span>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        display: 'inline-flex',
                                        background: '#f7f8fa',
                                        borderRadius: 24,
                                        padding: 2,
                                        gap: 0
                                      }}>
                                      <button
                                        type="button"
                                        style={{
                                          border: 'none',
                                          background: agents[activeTab]?.web_scrape
                                            ? '#5a8ca5'
                                            : 'transparent',
                                          color: agents[activeTab]?.web_scrape ? '#fff' : '#7a8a99',
                                          padding: '6px 22px',
                                          borderRadius: 24,
                                          fontWeight: 500,
                                          fontSize: 15,
                                          outline: 'none',
                                          cursor: 'pointer',
                                          transition: 'background 0.2s, color 0.2s'
                                        }}
                                        className={`${editingInitiative ? 'disabled-button' : ''}`}
                                        onClick={() =>
                                          handleAgentChange(activeTab, 'web_scrape', true)
                                        }
                                        disabled={editingInitiative}>
                                        Enable
                                      </button>
                                      <button
                                        type="button"
                                        className={`${editingInitiative ? 'disabled-button' : ''}`}
                                        style={{
                                          border: 'none',
                                          background: !agents[activeTab]?.web_scrape
                                            ? '#5a8ca5'
                                            : 'transparent',
                                          color: !agents[activeTab]?.web_scrape
                                            ? '#fff'
                                            : '#7a8a99',
                                          padding: '6px 22px',
                                          borderRadius: 24,
                                          fontWeight: 500,
                                          fontSize: 15,
                                          outline: 'none',
                                          cursor: 'pointer',
                                          transition: 'background 0.2s, color 0.2s'
                                        }}
                                        onClick={() =>
                                          handleAgentChange(activeTab, 'web_scrape', false)
                                        }
                                        disabled={editingInitiative}>
                                        Disable
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div> */}
                            </div>
                          ) : (
                            // Render an empty space to reserve height when toggles are not visible
                            <div style={{ height: 56 }} />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7">
                      {/* <div style={{ fontWeight: 600, fontSize: 14, marginBottom: -40 }}>
                        Agent Prompt
                      </div> */}
                      <TextAreaComponent
                        name={`agent_character_${activeTab}`}
                        label="Agent Prompt"
                        onTextChange={(name, value) =>
                          handleAgentChange(activeTab, 'agent_character', value)
                        }
                        minCharLength={40}
                        value={agents[activeTab]?.agent_character || ''}
                        rows={1}
                        className="form-control"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 500,
                          fontSize: 15,
                          color: '#222',
                          boxShadow: 'none',
                          resize: 'none',
                          padding: 0,
                          height: '100%',
                          width: '100%',
                          outline: 'none'
                        }}
                        placeholder="Text goes here...!"
                      />
                      {/* <div style={{ marginTop: -6 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Tags</div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Text goes here...!"
                          value={agents[activeTab]?.tags || ''}
                          onChange={(e) => handleAgentChange(activeTab, 'tags', e.target.value)}
                          disabled
                        />
                      </div> */}
                    </div>
                  </div>

                 
                </div>
              )
            )}
          </div>
        </div>
        <DeleteConfirmationModal
          show={showDeleteModal}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </>
  );
};
export default AgentDetails;
