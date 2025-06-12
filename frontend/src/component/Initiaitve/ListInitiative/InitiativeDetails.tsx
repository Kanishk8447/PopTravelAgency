import { Link, useNavigate, useParams } from 'react-router-dom';
// import { useInitiativeStore } from '../../store/InitiativeStore';
import apiService from '../../../service/apiService';
import { notification } from '../../../service/notification-Service';
import { useApi } from '../../../context/ApiContext';
// import { useGeneric } from '../../contexts/GenericContext';
// import ModalPopup from '../../Modals/ModalPopup';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
// import { useUserStore } from '../../store/userStore';
import 'bootstrap/dist/css/bootstrap.min.css';

const InitiativeDetails = () => {
  const { initiativeId } = useParams();
//   const { initiatives, fetchInitiatives } = useInitiativeStore();

  const [initiatives, setInitiatives] = useState<any[]>([]);
   useEffect(()=>{
        const fetchData= async ()=>{
          try {
            const response = await apiService.getData('initiatives');
            if (response) {
                      setInitiatives(response);
  
              notification('success', 'Search successful!');
            }
          } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            notification('error', 'Failed to search. Try again!');
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, []);

  const storedUser = localStorage.getItem('userConfig');
  const storedUserJSON = storedUser ? JSON.parse(storedUser) : null;

  const initiative = initiatives.find((item) => item.id === initiativeId);
  // Find the specific agent from the matched initiative
  const agents = initiative?.Agents || [];
  const { setLoading } = useApi();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [newInitiativeName, setNewInitiativeName] = useState('');
  const [cloneCount, setCloneCount] = useState(1);
//   const { user_info } = useUserStore();

  useEffect(() => {
    if (initiative) {
      setNewInitiativeName(
        initiative.name || agents.map((agent) => agent.agent_name).join(', ') || ''
      );
      // Reset clone count when initiative changes
      setCloneCount(1);
    }
  }, [initiative, agents]);

  const { setSelectedInitiative, selectedInitiative, setSelectedAgent } = useApi();

  const [allModels, setAllModels] = useState([]);

  useEffect(() => {
    const fetchModelList = async () => {
      try {
        setLoading(true);
        const response = await apiService.getData('model/list');
        if (response) {
          setAllModels(response);
        }
      } catch (error) {
        console.error('Error fetching Models List:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModelList();
  }, []);

  // Find the current model's label
  const currentModel = allModels.find((model) => model.name === initiative?.llms?.name);
  const modelLabel = currentModel ? currentModel.label : initiative?.llms?.name;

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitModal = () => {
    setShowModal(false);
    handleDeleteInitiative(initiativeId);
  };

  function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().split('.')[0]; // Remove milliseconds
  }

  const handleClone = () => {
    setNewInitiativeName((prevName) => {
      const baseName = initiative.name || agents.map((agent) => agent.agent_name).join(', ') || '';
      return `${baseName}-${cloneCount}`;
    });
    setShowCloneModal(true);
  };

  const handleCloseCloneModal = () => {
    setShowCloneModal(false);
  };

  const handleCloneSubmit = async () => {
    // Check if the initiative name already exists
    const trimmedNewInitiativeName = newInitiativeName.trim();

    if (!trimmedNewInitiativeName) {
      notification('warning', 'Initiative name cannot be empty.');
      return;
    }

    const isNameTaken = initiatives.some(
      (existingInitiative) => existingInitiative.name === trimmedNewInitiativeName
    );

    if (isNameTaken) {
      // Show notification if the name is already taken
      notification('warning', 'Initiative name already exists. Please choose a different name.');
      return; // Exit the function early if the name is taken
    }

    // Define the data format for the new initiative
    const newInitiativeData = {
      Initiative: {
        id: null,
        name: trimmedNewInitiativeName,
        type: 'Agent',
        is_multiagent: initiative.is_multiagent,
        multiagent_pattern: initiative.multiagent_pattern || 'Sequential',
        cloud: initiative.cloud,
        termination_condition: initiative.termination_condition || 'DONE',
        max_messages: initiative.max_messages || 5,
        Agents: agents.map((agent) => ({
          is_supervisor: agent.is_supervisor || false,
          // agent_id: agent.agent_id,
          agent_description: agent.agent_description,
          agent_name: agent.agent_name,
          agent_character: agent.agent_character,
          tools: agent.tools || [],
          model: agent.model || initiative.llms.name,
          memory: agent.memory || false,
          guardrail: agent.guardrail || false,
          web_scrape: agent.web_scrape || false
        })),
        tags: initiative.tags || [],
        llms: {
          name: initiative.llms.name,
          provider: initiative.llms.provider
        },
        tools: initiative.tools || [],
        files: initiative.files || [],
        guardrails: initiative.guardrails || [],
        guardrail_apply: initiative.guardrail_apply || 'input',
        created_on: initiative.created_on,
        created_by: initiative.created_by,
        modified_on: getCurrentDateTime(),
        // modified_by: user_info?.id
      }
    };

    try {
      handleCloseCloneModal();
      setLoading(true);
      // Send the POST request to create a new initiative
      const result = await apiService.postData('initiative/clone', newInitiativeData);
      if (result?.status === 'success') {
        // fetchInitiatives(storedUserJSON?.project_id, true); // Refresh the initiatives list
        notification('success', 'Initiative cloned successfully.');

        // setTimeout(() => {
        //   window.location.reload();
        // }, 400);
      } else {
        notification('error', 'Failed to clone initiative.');
      }
    } catch (error) {
      notification('error', 'Error cloning initiative');
      console.error('Error cloning initiative:', error);
    } finally {
      setLoading(false);
      setCloneCount((prevCount) => prevCount + 1); // Increment clone count
      setShowCloneModal(false); // Close the clone modal
    }
  };
  const handleDeleteInitiative = async (initiaitveID: any) => {
    try {
      setLoading(true);
      const result = await apiService.deleteData(`initiative/delete/${initiaitveID}`);
      if (result?.status === 'success') {
        notification('success', 'Initiative deleted successfully.');
        // fetchInitiatives(storedUserJSON?.project_id, true);
        navigate(`../../initiativeManagement`);
      }
    } catch (error) {
      setLoading(false);
      notification('error', 'Error deleting Initiative');
      console.error('Error deleting Initiative:', error);
    } finally {
      setLoading(false);
    }
  };

  const modalClass = showCloneModal
    ? 'modal high-zindex-blur-background fade show'
    : 'modal high-zindex-blur-background fade';



  return (
    <div className="col-md-9">
      <div className="row">
        <div className="col-md-12 ">
          <div className="std-background std-border-radius ml-3 pl-4 pr-3 py-4">
            {initiatives ? (
              <>
                <div className="col-md-12">
                  <div className="">
                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <span className="fw-bold std-color-active fs-6">Initiative Details</span>
                      <div className="d-flex justify-content-end">
                        {/* <Link to={`/post`}>
                          <button
                            type="button"
                            className="btn btn-fill mr-3 fw-normal details-button">
                            Test
                          </button>
                        </Link> */}
                        {/* <button
                          type="button"
                          className="btn btn-fill mr-3 fw-normal details-button"
                          onClick={() => {
                            if (initiative) {
                              const initiativeJson = JSON.stringify(initiative, null, 2); // Convert initiative to JSON
                              const blob = new Blob([initiativeJson], { type: 'application/json' }); // Create a Blob
                              const url = URL.createObjectURL(blob); // Create a URL for the Blob
                              const link = document.createElement('a'); // Create a temporary anchor element
                              link.href = url;
                              link.download = `initiative_${initiative.id}.json`; // Set the file name
                              link.click(); // Trigger the download
                              URL.revokeObjectURL(url); // Clean up the URL object
                            } else {
                              console.error('No initiative data available to download.');
                            }
                          }}>
                          Download
                        </button> */}
                        {/* <button
                          type="button"
                          className="btn d-flex align-items-center justify-content-center mr-3 details-button"
                          onClick={() => {
                            setSelectedInitiative(initiative || null);
                            setSelectedAgent(agents[0]);
                            navigate(`/initiative/run-initiative`);
                          }}>
                          Interact
                        </button> */}
                        {/* {(userID?.value === user_info?.id || user_info?.is_superadmin) && ( */}
                          {/* <button
                            type="button"
                            className="btn d-flex align-items-center justify-content-center mr-3 details-button"
                            onClick={() => {
                              setSelectedInitiative(initiative || null);
                              navigate(`/update-initiative-wizard`, { state: { initiative } });
                            }}>
                            Edit
                          </button> */}
                        {/* )} */}
                        {/* <Dropdown>
                          <Dropdown.Toggle
                            variant="secondary"
                            className="btn btn-light rounded-circle p-2 custom-dropdown-toggle"
                            id="dropdown-basic"
                            style={{
                              backgroundColor: 'transparent', // Makes the background transparent
                              border: 'none', // Removes the border
                              boxShadow: 'none', // Removes the default shadow
                              padding: '0', // Adjusts padding for a cleaner look
                              display: 'flex', // Ensures proper alignment
                              alignItems: 'center', // Centers the content vertically
                              justifyContent: 'center' // Centers the content horizontally
                            }}>
                            <span className="material-symbols-outlined">more_vert</span>{' '}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  handleShowModal();
                                }}>
                                <span className="d-flex align-items-center">
                                  <span className="material-symbols-outlined mr-2">delete</span>
                                  <span>Delete</span>
                                </span>
                              </Dropdown.Item>
                             )} 

                            <Dropdown.Item
                              onClick={() => {
                                if (initiative) {
                                  const initiativeJson = JSON.stringify(initiative, null, 2); // Convert initiative to JSON
                                  const blob = new Blob([initiativeJson], {
                                    type: 'application/json'
                                  }); // Create a Blob
                                  const url = URL.createObjectURL(blob); // Create a URL for the Blob
                                  const link = document.createElement('a'); // Create a temporary anchor element
                                  link.href = url;
                                  link.download = `initiative_${initiative.id}.json`; // Set the file name
                                  link.click(); // Trigger the download
                                  URL.revokeObjectURL(url); // Clean up the URL object
                                } else {
                                  console.error('No initiative data available to download.');
                                }
                              }}>
                              <span className="d-flex align-items-center">
                                <span className="material-symbols-outlined mr-2">download</span>
                                <span>Download JSON</span>
                              </span>
                            </Dropdown.Item>

                            <Dropdown.Item onClick={handleClone}>
                              <span className="d-flex align-items-center">
                                <span className="material-symbols-outlined mr-2">content_copy</span>
                                <span>Clone</span>
                              </span>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                          <style>
                            {`
                              .custom-dropdown-toggle::after {
                                display: none !important;
                              }
                            `}
                          </style>
                        </Dropdown> */}
                        {/* <ModalPopup
                          showModal={showModal}
                          handleClose={handleCloseModal}
                          ModalTitle="Delete Confirmation"
                          ModalData={`Are you sure want to Delete Initiative`}
                          handleSubmitModal={handleSubmitModal}
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 col-md-12 mt-3">
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Initiative Name:</span>
                      <span>
                        {initiative?.name ? (
                          <span>{initiative.name}</span>
                        ) : (
                          agents?.map((agent, index) => <span key={index}>{agent.agent_name}</span>)
                        )}
                      </span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Initiative Id:</span>
                      <span>{initiative?.id}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Max messages:</span>
                      <span>{initiative?.max_messages || '5'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Multiagent:</span>
                      <span>{initiative?.is_multiagent ? 'True' : 'False'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Multiagent Pattern:</span>
                      <span>
                        {initiative?.multiagent_pattern === ' ' ||
                        initiative?.multiagent_pattern === ''
                          ? 'None' // 'Sequential'
                          : initiative?.multiagent_pattern}
                      </span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Type:</span>
                      <span>{initiative?.type}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Termination Condition:</span>
                      <span>{initiative?.termination_condition || 'DONE'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Cloud:</span>
                      <span>{initiative?.cloud}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Model:</span>
                      <span>
                        {/* {initiative?.llms?.name} */}
                        {modelLabel}
                      </span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">RAG:</span>
                      <span>
                        {initiative?.files?.length > 0 ? <span>On</span> : <span>Off</span>}
                      </span>
                    </div>
                    <div className="col-md-8 mt-2">
                      <span className="std-color-active mr-2">Agents:</span>
                      <span>
                        {agents?.map((agent, index) => (
                          <span key={index}>
                            {agent.agent_name}
                            {index < agents.length - 1 && ' , '}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading or No Initiative Found...</p>
            )}
          </div>
        </div>
      </div>

      {/* Clone Initiative Modal */}
      <div
        className={`modal ${modalClass} ${showCloneModal ? 'show' : ''}`}
        style={{ display: showCloneModal ? 'block' : 'none' }}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="cloneModalLabel"
        aria-hidden="true"
        data-bs-keyboard="false"
        data-bs-backdrop="static">
        <div className="modal-dialog-centered" role="document">
          <div className="modal-content" style={{ borderRadius: '24px', width: '30%' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="cloneModalLabel">
                New Initiative name
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseCloneModal}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Enter new initiative name"
                value={newInitiativeName}
                onChange={(e) => setNewInitiativeName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary btn d-flex align-items-center justify-content-center mr-1 rounded-5"
                style={{ padding: '7px 22px 7px 22px' }}
                onClick={handleCloseCloneModal}>
                Cancel
              </button>
              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center details-button"
                disabled={!newInitiativeName.trim()}
                onClick={handleCloneSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default InitiativeDetails;
