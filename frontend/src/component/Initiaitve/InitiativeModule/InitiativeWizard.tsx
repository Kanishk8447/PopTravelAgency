import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InitiativeStepper from './InitiativeStepper';
import './initiative.css';
import Header from '../../../header/Header';
import Sidebar from '../../../sidebar/Sidebar';
import AgentDetails from './AgentDetails';
import ReviewInitiative from './ReviewInitiative';
import apiService from '../../../service/apiService';
import { notification } from '../../../service/notification-Service';
// import { useInitiativeStore } from '../../store/InitiativeStore';
import Tags from './Tags';
// import { useUserStore } from '../../store/userStore';
// import Guardrails from './Guardrails';
// import { useGeneric } from '../../contexts/GenericContext';
// import RagManagement from './RagManagement';
import { useApi } from '../../../context/ApiContext';

type HandleChange = (name: string, value: any, type?: string, files?: FileList) => void;

interface FormValues {
  id: string;
  type: string;
  cloud: string;
  is_supervisor: string;
  agent_name: string;
  agent_description: string;
  agent_character: string;
  model: string;
  memory: string;
  guardrail: string;
  llms: {
    name: string;
    provider: string;
  };
  tags: {
    key: string;
    value: string;
  }[];
  prompts?: any[];
  knowledge_documents?: any[];
  input_elements?: any[];
  template_file?: File;
  iac_file?: File;
}

interface InitiativeData {
  Initiative: {
    id: string | null;
    type: string;
    cloud: string;
    Agents: {
      is_supervisor: boolean;
      agent_name: string;
      agent_description: string;
      agent_character: string;
      model: string;
      memory: string;
      guardrail: string;
      web_scrape: boolean;
    }[];
    llms: {
      name: string;
      provider: string;
    };
    tags: {
      key: string;
      value: string;
    }[];
  };
}



const InitiativeWizard = () => {
  const [metaData, setMetaData] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [saveClicked, setSaveClicked] = useState(false); // Track save state
  const [isLoading, setIsLoading] = useState(false);
  // const { fetchInitiatives } = useInitiativeStore();
  const navigate = useNavigate();
  // const { user_info } = useUserStore();
  const storedUser = localStorage.getItem('userConfig');
  const storedUserJSON = storedUser ? JSON.parse(storedUser) : null;
  const location = useLocation();
  // const editingInitiative = location.state?.initiative;

  const { setLoading, selectedInitiative, setSelectedInitiative } = useApi();

  const editingInitiative = selectedInitiative;

  const CardTitle = editingInitiative ? 'Update Initiative' : 'Create Initiative';

  useEffect(() => {
    if (location.pathname.includes('update-initiative-wizard') && !editingInitiative) {
      notification('error', 'Please select an initiative to update.');
      navigate('/create-initiative-wizard');
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes('create-initiative-wizard')) {
      setSelectedInitiative(null);
    }
  }, [location, setSelectedInitiative]);

  function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().split('.')[0]; // Remove milliseconds
  }
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const stepDescriptions = {
    0: {
      short:
        'Welcome to Create Initiatives Wizard — a unified wrapper in Foundation for creating IT Agents...',
      full: 'Welcome to Create Initiatives Wizard — a unified wrapper in Foundation for creating IT Agents across cloud platforms, offering a structured and scalable approach to launching Gen AI capabilities in the cloud.'
    },
    1: {
      short:
        'Configure safety and compliance parameters for your agents. Guardrails include content moderation...',
      full: 'Configure safety and compliance parameters for your agents. Guardrails include content moderation, access controls, and operational boundaries to ensure responsible AI usage.'
    },
    2: {
      short:
        'Add metadata tags to your initiative for better organization, searchability, and reporting...',
      full: 'Add metadata tags to your initiative for better organization, searchability, and reporting. Tags can represent business units, environments, use cases, or any custom taxonomy relevant to your organization.'
    },
    3: {
      short:
        'Connect your agents to documents or knowledge sources so they can give better, more accurate answers...',
      full: 'Connect your agents to documents or knowledge sources so they can give better, more accurate answers. In this step, you can upload RAG files that your agents will use to respond more effectively.'
    },
    4: {
      short:
        'Review all configurations before submission. This step provides a consolidated summary...',
      full: 'Review all configurations before submission. This step provides a consolidated summary of your initiative, including agent definitions, guardrails, tags, and RAG settings. You can validate and confirm the setup before initiating deployment to the cloud.'
    }
  };

  const initialValues = {
    id: '',
    type: 'Agent',
    cloud: 'AWS',
    is_supervisor: '',
    name: '',
    agent_description: '',
    agent_character: '',
    model: '',
    memory: 'true',
    guardrail: 'true',
    termination_condition: 'DONE', // Default termination condition
    max_messages: 5, // Default max messages
    agents: [
      {
        is_supervisor: false,
        agent_id: `asst_${Math.random().toString(36).substr(2, 16)}`,
        agent_name: '',
        agent_description: '',
        agent_character: '',
        tools: [],
        model: '', // Remove the pre-selected 'gpt-4o' value
        memory: false,
        guardrail: false,
        isCollapsed: false,
        web_scrape: false
      }
    ],
    llms: {
      name: '',
      provider: ''
    },
    tags: [{ key: '', value: '' }],
    knowledge_documents: []
  };

  const [formValues, setFormValues] = useState(
    editingInitiative
      ? {
          id: editingInitiative.id,
          type: editingInitiative.type,
          cloud: editingInitiative.cloud,
          // is_supervisor: editingInitiative.Agents[0]?.is_supervisor || '',
          name: editingInitiative.name || '',
          // agent_description: editingInitiative.Agents[0]?.agent_description || '',
          // agent_character: editingInitiative.Agents[0]?.agent_character || '',
          // model: editingInitiative.llms?.name || '',
          // memory: editingInitiative.Agents[0]?.memory?.toString() || 'true',
          guardrail: editingInitiative.guardrail || [],
          is_multiagent: editingInitiative.is_multiagent || false,
          max_messages: editingInitiative.max_messages || 5,
          termination_condition: editingInitiative.termination_condition || 'DONE',
          multiagent_pattern: editingInitiative.multiagent_pattern || 'Sequential', // Default to 'Sequential' if not set
          // tags: editingInitiative.tags || [],
          tags: editingInitiative.tags
            ? editingInitiative.tags.filter(
                (tag) =>
                  tag.key !== 'user_id' &&
                  tag.key !== 'project_id' &&
                  tag.key !== 'account_id' &&
                  tag.key.trim() !== '' &&
                  tag.value.trim() !== ''
              )
            : [],
          agents: editingInitiative.Agents.map((agent) => ({
            agent_id: agent.agent_id,
            is_supervisor: agent.is_supervisor,
            agent_name: agent.agent_name,
            agent_description: agent.agent_description,
            agent_character: agent.agent_character,
            tools: agent.tools || [],
            model: agent.model,
            memory: agent.memory,
            guardrail: agent.guardrail,
            isCollapsed: false,
            web_scrape: agent?.web_scrape
          })),
          llms: editingInitiative.llms || { name: '', provider: '' }
        }
      : initialValues
  );

  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormReset, setIsFormReset] = useState(false);
  const [prompts, setPrompts] = useState([
    {
      prompt_id: '1',
      prompt_name: 'Prompt 1',
      prompt_text: '',
      placeholder: '',
      prev_output_context: 0,
      level: 1,
      isSave: false
    }
  ]);
  const [ragVal, setRagval] = useState([]);
  const [placeholderList, setPlaceholderList] = useState([]);
  const [placeholderString, setPlaceholderString] = useState('');
  const [supervisorAgentIndex, setSupervisorAgentIndex] = useState<number | null>(null);
  // const { isOn } = useRagContext();
  const isOn = false;
  const [existingInitiativeNames, setExistingInitiativeNames] = useState<string[]>([]);

  const stepFields = [
    // Step 0: Initiative Details
    // ['name', 'cloud', 'global_model'],
    // Step 1: Guardrails
    [],
    // Step 2: Tags
    [],
    // Step 3: RAG Management
    [],
    // Step 4: Final Review
    []
  ];

  const updateFormValidity = useCallback(() => {
    // Ensure currentStep is within the bounds of stepFields
    if (currentStep >= stepFields.length) {
      setIsFormValid(false);
      return;
    }

    const requiredFields = stepFields[currentStep];

    // Check if all required fields for the current step are filled
    let isValid = requiredFields.every((field) => {
      const value = formValues[field];
      return value !== undefined && value !== null && value !== '';
    });

    // For step 0 (Initiative Details), validate agents
    if (currentStep === 0 && formValues.agents) {
      const agentsValid = formValues.agents.every((agent) => {
        // Check required fields for each agent
        const requiredAgentFields = ['agent_name', 'agent_description', 'agent_character', 'model'];
        const requiredFieldsValid = requiredAgentFields.every((field) => {
          const value = agent[field];
          return (
            value !== undefined && value !== null && value !== '' && value.toString().trim() !== ''
          );
        });

        // Check agent_character minimum length (40 characters)
        const characterValid = agent.agent_character && agent.agent_character.trim().length >= 40;

        return requiredFieldsValid && characterValid;
      });

      isValid = isValid && agentsValid;
    }

    // For multi-agent scenarios (when orchestration is visible), also validate orchestration fields
    if (currentStep === 0 && formValues.agents && formValues.agents.length > 1) {
      // Check orchestration type selection for multi-agent scenarios
      const hasOrchestrationType =
        formValues.orchestrationType !== undefined &&
        formValues.orchestrationType !== null &&
        formValues.orchestrationType !== '';

      isValid = isValid && hasOrchestrationType;

      // If supervisor orchestration is selected, validate supervisor selection
      if (formValues.orchestrationType === 'Supervisor') {
        const hasSupervisorSelected = supervisorAgentIndex !== null && supervisorAgentIndex >= 0;
        isValid = isValid && hasSupervisorSelected;
      }
    }

    // For step 3 (RAG Management), require documents only if RAG is ON
    if (currentStep === 3) {
      if (isOn) {
        // RAG is ON - documents are required
        const hasDocuments =
          formValues.knowledge_documents && formValues.knowledge_documents.length > 0;
        isValid = hasDocuments;
      } else {
        // RAG is OFF - documents are not required, step is always valid
        isValid = true;
      }
    }

    setIsFormValid(isValid);
  }, [formValues, currentStep, supervisorAgentIndex, isOn]);

  useEffect(() => {
    if (!editingInitiative) {
      setIsFormReset(true);
      setFormValues(initialValues);
    }
  }, [editingInitiative]);

  // Add a new state to store the initial agent names when editing an initiative
  const [initialAgentNames, setInitialAgentNames] = useState<string[]>([]);

  useEffect(() => {
    setIsFormReset(true);

    // Fetch initiatives data when page first loads
    const fetchInitiativesData = async () => {
      try {
        // const response = await apiService.getData('initiative/list');
        const response = await apiService.getData(
          `initiative/projects/${storedUserJSON?.project_id}/list`
        );

        // Extract agent names from all initiatives for validation
        if (response?.data && Array.isArray(response.data)) {
          const agentNames = [];
          response.data.forEach((initiative) => {
            if (initiative.Agents && Array.isArray(initiative.Agents)) {
              initiative.Agents.forEach((agent) => {
                if (agent.agent_name) {
                  agentNames.push(agent.agent_name);
                }
              });
            }
          });
          setExistingInitiativeNames(agentNames); // Reusing the same state for agent names

          // If editing an initiative, store the initial agent names
          if (editingInitiative) {
            const initialNames = editingInitiative.Agents.map((agent) => agent.agent_name);
            setInitialAgentNames(initialNames);
          }
        }
      } catch (error) {
        console.error('Error fetching initiatives:', error);
      }
    };

    fetchInitiativesData();
  }, []);

  useEffect(() => {
    updateFormValidity();
    setIsFormReset(false);
  }, [formValues, updateFormValidity]);

  const hasDuplicateKeys = useCallback(() => {
    const keys = formValues.tags.map((tag) => tag.key);
    const uniqueKeys = new Set(keys);
    return uniqueKeys.size !== keys.length;
  }, [formValues.tags]);

  const handleChange = (name, value, type, agentIndex = null) => {
    // Trim whitespace for agent_name, agent_description, agent_character
    const shouldTrim =
      name === 'agent_name' || name === 'agent_description' || name === 'agent_character';

    const trimmedValue = typeof value === 'string' && shouldTrim ? value.trim() : value;

    setFormValues((prevValues) => {
      const updatedFormValues = { ...prevValues };

      if (agentIndex !== null) {
        const updatedAgents = [...prevValues.agents];
        updatedAgents[agentIndex] = {
          ...updatedAgents[agentIndex],
          [name]: trimmedValue
        };
        updatedFormValues.agents = updatedAgents;
      } else {
        updatedFormValues[name] = trimmedValue;

        if (
          updatedFormValues.agents.length === 1 &&
          (name === 'agent_name' || name === 'agent_description' || name === 'agent_character')
        ) {
          updatedFormValues.agents[0][name] = trimmedValue;
        }
      }

      return updatedFormValues;
    });
  };

  const handleReset = () => {
    setFormValues(initialValues);
    setIsFormReset(true);
  };

 

  const handleSubmit = async (finalValues) => {
    try {
      setLoading(true);
      // Prepare the payload for single or multi-agent
      const data = {
        // ...(editingInitiative && { user_id: user_info?.id }),
        Initiative: {
          id: editingInitiative ? editingInitiative.id : null,
          type: 'Agent',
          cloud: finalValues.cloud,
          name: finalValues.name,
          multiagent_pattern: finalValues.orchestrationType || 'Sequential',
          is_multiagent: finalValues.agents.length > 1,
          termination_condition: finalValues.termination_condition || 'DONE',
          max_messages: Number(finalValues.max_messages) || 5, // <-- Ensure this is a number
          guardrails: finalValues.guardrails || [],
          guardrail_apply: finalValues.guardrailsApply,
          Agents: finalValues.agents.map((agent, idx) => ({
            is_supervisor: finalValues.agents.length > 1 ? idx === supervisorAgentIndex : false,
            agent_name: agent.agent_name,
            agent_description: agent.agent_description,
            agent_character: agent.agent_character,
            tools: [],
            model: agent.model,
            memory: agent.memory || false,
            guardrail: agent.guardrail || false,
            web_scrape: agent.web_scrape || false,
            ...(editingInitiative && editingInitiative.Agents[idx]?.agent_id
              ? { agent_id: editingInitiative.Agents[idx].agent_id }
              : {})
            // guardrail: agent.guardrail || false
          })),
          llms: {
            // name: editingInitiative ? finalValues.llms.name : finalValues.global_model,
            name: finalValues.global_model,
            provider: finalValues.cloud
          },
          // tags: Array.isArray(finalValues.tags) ? finalValues.tags : [] // Ensure tags is an array

          tags: [
            // ...initialValues.tags,
            ...finalValues.tags.filter(
              (tag) =>
                tag.key.trim() !== '' &&
                tag.value.trim() !== '' &&
                tag.key !== 'user_id' &&
                tag.key !== 'project_id' &&
                tag.key !== 'account_id'
            ),
            ...(editingInitiative
              ? [
                  {
                    key: 'user_id',
                    value: editingInitiative.tags.find((tag) => tag.key === 'user_id')?.value
                  },
                  {
                    key: 'account_id',
                    value: editingInitiative.tags.find((tag) => tag.key === 'account_id')?.value
                  },
                  {
                    key: 'project_id',
                    value: editingInitiative.tags.find((tag) => tag.key === 'project_id')?.value
                  }
                ]
              : [
                  // { key: 'user_id', value: user_info?.id },
                  { key: 'account_id', value: storedUserJSON?.account_id },
                  { key: 'project_id', value: storedUserJSON?.project_id }
                ])
          ],
          tools: [],
          files: [],
          ...(editingInitiative
            ? {
                created_on: editingInitiative.created_on,
                created_by: editingInitiative.created_by
              }
            : {
                created_on: getCurrentDateTime(),
                // created_by: user_info?.id
              }),
          modified_on: getCurrentDateTime(),
          // modified_by: user_info?.id
        }
      };

      let result;
      if (editingInitiative) {
        result = await apiService.postData(`initiative/update/${editingInitiative.id}`, data);
      } else {
        result = await apiService.postData('initiative/create', data);
      }

      const formData = new FormData();
      if (formValues.knowledge_documents?.length > 0) {
        formValues.knowledge_documents.forEach((file) => {
          formData.append('files', file);
        });
      }

      let ragApiResponse;

      if (result) {
        if (formValues.knowledge_documents?.length > 0) {
          ragApiResponse = await apiService.postFileData(
            `initiative/${result?.data?.id}/rag`,
            formData
          );
        }
      }

      if (formValues.knowledge_documents?.length > 0) {
        if (result && ragApiResponse) {
          notification(
            'success',
            `Initiative ${editingInitiative ? 'updated' : 'created'} successfully`
          );
          // fetchInitiatives();
          // fetchInitiatives(storedUserJSON?.project_id, true);

          setTimeout(() => {
            navigate(`/welcome`);
            window.location.reload();
          }, 1000);
        } else {
          notification('error', 'Failed to create RAG');
        }
      } else {
        if (result) {
          notification(
            'success',
            `Initiative ${editingInitiative ? 'updated' : 'created'} successfully`
          );
          // fetchInitiatives();
          // fetchInitiatives(storedUserJSON?.project_id, true);

          setTimeout(() => {
            navigate(`/welcome`);
            window.location.reload();
          }, 1000);
        } else {
          notification(
            'error',
            `Failed to ${editingInitiative ? 'updated' : 'created'} Initiative`
          );
        }
      }
    } catch (error) {
      // console.error(`Error ${editingInitiative ? 'updating' : 'creating'} Initiative:`, error);
      try {
        const errorDetails = error?.response?.data?.details;

        // Check if errorDetails is an object or can be parsed as JSON
        if (typeof errorDetails === 'string' || typeof errorDetails === 'object') {
          let parsedDetails;

          try {
            parsedDetails =
              typeof errorDetails === 'string' ? JSON.parse(errorDetails) : errorDetails;

            // Extract a message from parsedDetails
            let message;
            if (parsedDetails?.details) {
              // Handle nested details
              if (typeof parsedDetails.details === 'string') {
                const innerDetails = JSON.parse(parsedDetails.details);
                message = innerDetails?.message || parsedDetails.details || parsedDetails.detail;
              } else if (typeof parsedDetails.details === 'object') {
                message = parsedDetails.details.message || JSON.stringify(parsedDetails.details);
              } else {
                message = parsedDetails.details;
              }
            } else {
              message = parsedDetails?.message || JSON.stringify(parsedDetails);
            }

            notification('error', message);
          } catch (parseError) {
            console.error('Error parsing error details:', parseError);
            notification('error', errorDetails);
          }
        } else {
          const message = errorDetails || error?.response?.data?.detail || JSON.stringify(error);
          notification('error', message);
        }
      } catch (finalError) {
        console.error('Error handling failed:', finalError);
        const fallbackMessage =
          error?.response?.data?.details ||
          finalError ||
          error?.response?.data?.detail ||
          'An unexpected error occurred';
        notification('error', fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: 'Initiative Details',
      heading: 'UseCase_Definition',
      content: (
        <AgentDetails
          formValues={formValues}
          handleChange={handleChange}
          isFormReset={isFormReset}
          supervisorAgentIndex={supervisorAgentIndex}
          setSupervisorAgentIndex={setSupervisorAgentIndex}
          editingInitiative={editingInitiative}
        />
      )
    },
    // {
    //   label: 'Orchestration',
    //   heading: 'Orchestration',
    //   content: (
    //     <Orchestration
    //       formValues={formValues}
    //       handleChange={handleChange}
    //       isFormReset={isFormReset}
    //     />
    //   )
    // },
    // {
    //   label: 'Agent Instructions',
    //   heading: 'Input_Elements',
    //   content: (
    //     <AgentInstructions
    //       formValues={formValues}
    //       handleChange={handleChange}
    //       isFormReset={isFormReset}
    //       setSaveClicked={setSaveClicked}
    //     />
    //   )
    // },
    // {
    //   label: 'Guardrails',
    //   heading: 'Guardrails',
    //   content: (
    //     <Guardrails
    //       formValues={formValues}
    //       handleChange={handleChange}
    //       editingInitiative={editingInitiative}
    //     />
    //   )
    // },
    {
      label: 'Tags',
      heading: 'Tags',
      content: (
        <Tags
          formValues={formValues}
          handleChange={handleChange}
          editingInitiative={editingInitiative}
        />
      )
    },
    // {
    //   label: 'RAG Management',
    //   heading: 'knowledge_documents',
    //   content: (
    //     <RagManagement
    //       formValues={formValues}
    //       setFormValues={setFormValues}
    //       handleChange={handleChange}
    //       editingInitiative={editingInitiative}
    //     />
    //   )
    // },
    {
      label: 'Final Review',
      heading: 'Final_Review',
      content: (
        <ReviewInitiative
          formValues={formValues}
          handleChange={handleChange}
          isFormReset={isFormReset}
        />
      )
    }
  ];

  const goToPreviousStep = () => {
    if (hasDuplicateKeys()) {
      notification('error', 'Duplicate tag keys detected. Please resolve them before proceeding.');
      return;
    }
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const goToNextStep = () => {
    if (hasDuplicateKeys()) {
      notification('error', 'Duplicate tag keys detected. Please resolve them before proceeding.');
      return;
    }

    if (currentStep === 0 && formValues.agents) {
      const newAgentNames = formValues.agents.map((agent) => agent.agent_name.toLowerCase());

      for (let i = 0; i < formValues.agents.length; i++) {
        const agentName = formValues.agents[i].agent_name.toLowerCase();
        if (agentName) {
          // Check if the name has changed (only relevant for editing)
          const isNameChanged =
            editingInitiative && initialAgentNames[i]?.toLowerCase() !== agentName;

          // Check if the name is a duplicate in other initiatives
          const isDuplicateInOtherInitiatives = existingInitiativeNames.some(
            (existingAgentName) => {
              // Exclude current initiative's initial names from the duplicate check
              return (
                existingAgentName.toLowerCase() === agentName &&
                !(
                  editingInitiative &&
                  initialAgentNames.map((name) => name.toLowerCase()).includes(agentName)
                )
              );
            }
          );

          // Check if the name is a duplicate within the new agent list
          const isDuplicateInNewAgents =
            newAgentNames.filter((name) => name === agentName).length > 1;

          // For editing, check if name has changed and if it is a duplicate in other initiatives
          // For creating, simply check if it is a duplicate in other initiatives or within new agents
          if (
            (!editingInitiative && (isDuplicateInOtherInitiatives || isDuplicateInNewAgents)) ||
            (editingInitiative &&
              isNameChanged &&
              (isDuplicateInOtherInitiatives || isDuplicateInNewAgents))
          ) {
            notification(
              'error',
              `Agent name "${agentName}" already exists. Please choose a different name.`
            );
            return; // Prevent navigation
          }
        }
      }
    }

    // Validation for step 0 (Initiative Details) and step 3 (RAG Management)
    if ((currentStep === 0 || currentStep === 3) && !isFormValid) {
      if (currentStep === 3 && isOn) {
        notification('error', 'Please upload at least one RAG document before proceeding.');
      }
      return;
    }

    // Move to next step first
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }

    // Only process prompts and input elements when leaving step 3, but don't override knowledge_documents
    if (currentStep === 3) {
      const updatedPrompts = prompts.map(
        ({ prompt_id, prompt_name, prompt_text, placeholder, prev_output_context, level }) => ({
          prompt_id,
          prompt_name,
          prompt_text,
          placeholder,
          prev_output_context,
          level
        })
      );

      // Update formValues without overriding knowledge_documents
      setFormValues((prevValues) => ({
        ...prevValues,
        prompts: updatedPrompts,
        input_elements: [
          {
            element_label: '',
            element_type: 'Standard Input',
            element_value: '',
            element_placeholder: placeholderString
          }
        ]
      }));
    }
  };

  const handleStepChange = (targetStep) => {
    if (hasDuplicateKeys()) {
      notification('error', 'Duplicate tag keys detected. Please resolve them before proceeding.');
      return;
    }

    if (currentStep === 0 && formValues.agents) {
      const newAgentNames = formValues.agents.map((agent) => agent.agent_name?.toLowerCase());

      for (let i = 0; i < formValues.agents.length; i++) {
        const agentName = formValues.agents[i].agent_name?.toLowerCase();
        if (agentName) {
          // Check if the name has changed (only relevant for editing)
          const isNameChanged =
            editingInitiative && initialAgentNames[i]?.toLowerCase() !== agentName;

          // Check if the name is a duplicate in other initiatives
          const isDuplicateInOtherInitiatives = existingInitiativeNames.some(
            (existingAgentName) => {
              // Exclude current initiative's initial names from the duplicate check
              return (
                existingAgentName?.toLowerCase() === agentName &&
                !(
                  editingInitiative &&
                  initialAgentNames.map((name) => name?.toLowerCase()).includes(agentName)
                )
              );
            }
          );

          // Check if the name is a duplicate within the new agent list
          const isDuplicateInNewAgents =
            newAgentNames.filter((name) => name === agentName).length > 1;

          // For editing, check if name has changed and if it is a duplicate in other initiatives
          // For creating, simply check if it is a duplicate in other initiatives or within new agents
          if (
            (!editingInitiative && (isDuplicateInOtherInitiatives || isDuplicateInNewAgents)) ||
            (editingInitiative &&
              isNameChanged &&
              (isDuplicateInOtherInitiatives || isDuplicateInNewAgents))
          ) {
            notification(
              'error',
              `Agent name "${agentName}" already exists. Please choose a different name.`
            );
            return; // Prevent navigation
          }
        }
      }
    }

    if (targetStep > currentStep) {
      for (let i = currentStep; i < targetStep; i++) {
        const missingFields = getMissingFields(i);
        if (missingFields.length > 0) {
          notification(
            'error',
            `Please fill the following required fields in Step ${i + 1}: ${missingFields.join(', ')}`
          );
          return;
        }
      }
    }
    setCurrentStep(targetStep);
  };

  // const handleStepChange = (targetStep) => {
  //   if (hasDuplicateKeys()) {
  //     notification('error', 'Duplicate tag keys detected. Please resolve them before proceeding.');
  //     return;
  //   }

  //   // Check for duplicate agent names when navigating from step 0
  //   if (currentStep === 0 && formValues.agents) {
  //     for (let i = 0; i < formValues.agents.length; i++) {
  //       const agentName = formValues.agents[i].agent_name;
  //       if (agentName) {
  //         const isDuplicateAgentName = existingInitiativeNames.some(
  //           (existingAgentName) => existingAgentName.toLowerCase() === agentName.toLowerCase()
  //         );
  //         if (isDuplicateAgentName) {
  //           notification(
  //             'error',
  //             `Agent name "${agentName}" already exists. Please choose a different name.`
  //           );
  //           return; // Prevent navigation
  //         }
  //       }
  //     }
  //   }

  //   if (targetStep > currentStep) {
  //     for (let i = currentStep; i < targetStep; i++) {
  //       // Additional check for duplicate agent names when validating each step
  //       if (i === 0 && formValues.agents) {
  //         for (let j = 0; j < formValues.agents.length; j++) {
  //           const agentName = formValues.agents[j].agent_name;
  //           if (agentName) {
  //             const isDuplicateAgentName = existingInitiativeNames.some(
  //               (existingAgentName) => existingAgentName.toLowerCase() === agentName.toLowerCase()
  //             );
  //             if (isDuplicateAgentName) {
  //               notification(
  //                 'error',
  //                 `Agent name "${agentName}" already exists. Please choose a different name.`
  //               );
  //               return; // Prevent navigation
  //             }
  //           }
  //         }
  //       }

  //       const missingFields = getMissingFields(i);
  //       if (missingFields.length > 0) {
  //         notification(
  //           'error',
  //           `Please fill the following required fields in Step ${i + 1}: ${missingFields.join(', ')}`
  //         );
  //         return;
  //       }
  //     }
  //   }
  //   setCurrentStep(targetStep);
  // };

  const getMissingFields = (step) => {
    const requiredFields = stepFields[step];

    if (step === steps.length - 1) {
      return [];
    }

    const adjustedRequiredFields = isOn
      ? requiredFields
      : requiredFields.filter((field) => field !== 'knowledge_documents');

    if (step === 0) {
      const missingFields = [];

      // Check general form fields
      adjustedRequiredFields.forEach((field) => {
        const fieldValue = formValues[field];
        if (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === '' ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        ) {
          missingFields.push(field);
        }
      });

      // Check agent fields
      formValues.agents.forEach((agent, index) => {
        const requiredAgentFields = ['agent_name', 'agent_description', 'agent_character', 'model'];

        requiredAgentFields.forEach((field) => {
          const value = agent[field];
          if (!value || value.toString().trim() === '') {
            missingFields.push(`Agent ${index + 1} ${field.replace('agent_', '')}`);
          }
        });

        // Check character length
        if (!agent.agent_character || agent.agent_character.trim().length < 40) {
          missingFields.push(`Agent ${index + 1} character (min 40 chars)`);
        }
      });

      // Check orchestration for multi-agent
      if (formValues.agents.length > 1) {
        if (!formValues.orchestrationType) {
          missingFields.push('Orchestration Type');
        }
        if (
          formValues.orchestrationType === 'Supervisor' &&
          (supervisorAgentIndex === null || supervisorAgentIndex < 0)
        ) {
          missingFields.push('Supervisor Agent Selection');
        }
      }

      return missingFields;
    }

    // For step 3 (RAG Management), check for documents only if RAG is ON
    if (step === 3) {
      const missingFields = [];
      if (
        isOn &&
        (!formValues.knowledge_documents || formValues.knowledge_documents.length === 0)
      ) {
        missingFields.push('RAG Documents');
      }
      return missingFields;
    }

    const missingFields = adjustedRequiredFields.filter((field) => {
      const fieldValue = formValues[field];
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    });

    return missingFields;
  };

  const isStepValid = (step) => {
    const requiredFields = stepFields[step];

    if (step === steps.length - 1) {
      return true;
    }

    const adjustedRequiredFields = isOn
      ? requiredFields
      : requiredFields.filter((field) => field !== 'knowledge_documents');

    const generalValidity = adjustedRequiredFields.every((field) => {
      const fieldValue = formValues[field];
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== '' &&
        !(Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    });

    if (step === 0) {
      const agentsValidity =
        formValues.agents.length > 0 &&
        formValues.agents.every((agent) => {
          const requiredAgentFields = [
            'agent_name',
            'agent_description',
            'agent_character',
            'model'
          ];
          const allFieldsValid = requiredAgentFields.every((field) => {
            const value = agent[field];
            return (
              value !== undefined &&
              value !== null &&
              value !== '' &&
              value.toString().trim() !== ''
            );
          });
          const characterValid = agent.agent_character && agent.agent_character.trim().length >= 40;
          return allFieldsValid && characterValid;
        });

      // Multi-agent orchestration validation
      let orchestrationValid = true;
      if (formValues.agents.length > 1) {
        orchestrationValid =
          formValues.orchestrationType !== undefined &&
          formValues.orchestrationType !== null &&
          formValues.orchestrationType !== '';

        // If supervisor orchestration, check supervisor selection
        if (formValues.orchestrationType === 'Supervisor') {
          orchestrationValid =
            orchestrationValid && supervisorAgentIndex !== null && supervisorAgentIndex >= 0;
        }
      }

      return generalValidity && agentsValidity && orchestrationValid;
    }

    // For step 3 (RAG Management), require documents only if RAG is ON
    if (step === 3) {
      if (isOn) {
        // RAG is ON - documents are required
        const hasDocuments =
          formValues.knowledge_documents && formValues.knowledge_documents.length > 0;
        return hasDocuments;
      } else {
        // RAG is OFF - documents are not required, step is always valid
        return true;
      }
    }

    return generalValidity;
  };
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const handleSidebarToggle = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <Header />
      <div className={`content-wrapper ${isSidebarOpen ? '' : 'toggled'}`}>
        <Sidebar onToggle={handleSidebarToggle} />
        <div className="container-fluid">
          <div className="container-margin-left" style={{ display: 'flex', height: '100%' }}>
            <div className="row w-100">
              <div className="col-md-12">
                <div
                  className="card card-main"
                  style={{
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    width: '100%',
                    height: 'calc(100vh - 165px)'
                  }}>
                  <div className="card-header d-flex align-items-center ">
                    <h4 className="card-title card-adjust-headings align-items-start flex-column">
                      <img
                        className="mr-1 reviews-icon-small"
                        src="/dashboard_customize_24dp_005A82.svg"
                      />
                      <span className="heading font-weight-normal">{CardTitle}</span>
                    </h4>
                  </div>
                  <div
                    className="card-body"
                    style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      width: '100%',
                      height: '100%'
                    }}>
                    <div
                      className="card-header mb-2 rounded byouc-rounded-corners pb-5"
                      style={{ height: '80px' }}>
                      <InitiativeStepper currentStep={currentStep} />
                    </div>
                    <div
                      className="card-body byouc-bg-color rounded byouc-rounded-corners"
                      style={{
                        height: 'calc(100% - 90px)',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                      }}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit(formValues);
                        }}
                        onReset={handleReset}>
                        <div className="row">
                          <div className="col-md-6 fw-bold pr-3">{steps[currentStep].label}</div>
                        </div>
                        {stepDescriptions[currentStep] && (
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <p
                                className="text-muted mb-2"
                                style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                {showFullDescription ? (
                                  <>
                                    {stepDescriptions[currentStep].full}
                                    <span
                                      className="text-primary ms-2"
                                      style={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '13px'
                                      }}
                                      onClick={toggleDescription}>
                                      Read Less
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {stepDescriptions[currentStep].short}
                                    <span
                                      className="text-primary ms-2"
                                      style={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '13px'
                                      }}
                                      onClick={toggleDescription}>
                                      Read More
                                    </span>
                                                              </>
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {steps[currentStep].content}
                        <div className="mt-4 d-flex justify-content-end">
                          <div className="bg-white d-flex justify-content-end p-1 rounded-5">
                            {currentStep > 0 && (
                              <button
                                type="button"
                                className="btn fs-6 step-button-text rounded-pill px-2 d-flex align-items-center justify-content-center bg-step-button-inactive"
                                onClick={goToPreviousStep}
                                hidden={currentStep === 0}>
                                <span className="material-icons-round fs-5">arrow_back</span>
                                {currentStep === 0 ? 'Start' : 'Back'}
                              </button>
                            )}
                            {steps.map((step, index) => (
                              <span
                                key={index}
                                className={`mx-1 p-1 rounded-5 d-flex align-items-center justify-content-center cursor-pointer ${
                                  currentStep === index
                                    ? 'selected-button text-white'
                                    : index < currentStep
                                      ? 'bg-step-button-next text-white'
                                      : 'bg-step-button-inactive step-button-text'
                                }`}
                                style={{
                                  height: '36px',
                                  width: '36px'
                                  // marginTop: '2px'
                                }}
                                onClick={() => handleStepChange(index)}>
                                {index + 1}
                              </span>
                            ))}
                            {currentStep < steps.length - 1 && (
                              <button
                                type="button"
                                className="btn rounded-pill px-2 custom-button-byouc d-flex align-items-center justify-content-center step-button-text bg-step-button-inactive"
                                onClick={goToNextStep}
                                hidden={currentStep === steps.length - 1}
                                disabled={!isFormValid} // Disable the button if the form is not valid for the current step
                              >
                                {currentStep === steps.length - 1 ? 'Generate' : 'Next'}
                                <span className="material-icons-round fs-5">arrow_forward</span>
                              </button>
                            )}
                            {currentStep === steps.length - 1 && (
                              <button
                                type="submit"
                                className="btn rounded-pill px-4 custom-button-byouc step-button-text submit-button-hover"
                                // disabled={!isFormValid} // Disable the button if the form is not valid for the current step
                              >
                                Submit
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InitiativeWizard;
