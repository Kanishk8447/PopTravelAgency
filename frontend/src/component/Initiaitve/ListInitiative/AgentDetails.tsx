import { Link, useNavigate, useParams } from 'react-router-dom';
import apiService from '../../../service/apiService';
// import { useInitiativeStore } from '../../store/InitiativeStore';
import { useApi } from '../../../context/ApiContext';
import { useEffect, useState } from 'react';
import { notification } from '../../../service/notification-Service';

const AgentDetails = () => {
  const { id } = useParams();
  const { setLoading } = useApi();
  // const { initiatives } = useInitiativeStore();
  const navigate = useNavigate();

  interface Agent {
    agent_id: string;
    agent_name: string;
    model: string;
    memory: boolean;
    guardrail: boolean;
    is_supervisor: boolean;
    agent_description?: string;
    agent_character: string;
    web_scrape: boolean;
  }

  // interface Initiative {
  //   id: string;
  //   Agents?: Agent[];
  // }

  const [initiatives, setInitiatives] = useState<any[]>([]);
 useEffect(()=>{
      const fetchData= async ()=>{
        try {
        const response = await apiService.getData('api/initiative/list');
          if (response) {
            setInitiatives(response?.data);

            // notification('success', 'Search successful!');
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


 

  // Find the initiative that contains the given agent_id
  const initiative = initiatives.find((item) =>
    item.Agents?.some((agent) => agent.agent_id === id)
  );

  // Find the specific agent from the matched initiative
  const agent = initiative?.Agents?.find((a) => a.agent_id === id);
  //   // Find the initiative by ID
  //   const initiative = initiatives.find((item) => item.id === id);

  // const filteredTags =
  //   initiative?.tags &&
  //   initiative?.tags.filter((tag) => tag.key.trim() !== '' || tag.value.trim() !== '');
  const filteredTags =
    initiative?.tags &&
    initiative?.tags.filter(
      (tag) =>

        tag.key !== 'user_id' &&
        tag.key !== 'project_id' &&
        tag.key !== 'account_id'
    );


  // const handleInteract = (agentId) => {
  //   navigate(`/initiative/interact`);
  //   setSelectedInitiative(agentId);
  //   console.log('selectedInitiative agent ID:', selectedInitiative);
  // };
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

  return (
    <div className="col-md-9">
      <div className="row">
        <div className="col-md-12 ">
          <div className="std-background std-border-radius ml-3 pl-4 pr-3 py-4">
            {agent ? (
              <>
                <div className="col-md-12">
                  <div className="">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold std-color-active fs-6">Agent Details</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 col-md-12">
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Agent Name:</span>
                      <span>{agent.agent_name}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Agent Id:</span>
                      <span>{agent.agent_id}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Model:</span>
                      <span>
                        {agent.model}
                        {/* {modelLabel} */}
                      </span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Memory:</span>
                      <span>{agent.memory ? 'True' : 'False'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Guardrail:</span>
                      <span>{agent.guardrail ? 'True' : 'False'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Supervisor:</span>
                      <span>{agent.is_supervisor ? 'True' : 'False'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Agent Description:</span>
                      <span>{agent.agent_description || 'N/A'}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Agent Prompt:</span>
                      <span>{agent.agent_character}</span>
                    </div>
                    <div className="col-md-4 mt-2">
                      <span className="std-color-active mr-2">Tool:</span>
                      <span>{agent?.web_scrape ? 'Web Scrape' : 'False'}</span>
                    </div>
                    {filteredTags && filteredTags.length > 0 && (
                      <div className="col-md-12 mt-2 d-flex align-items-center">
                        <span className="std-color-active mr-2">Tags:</span>
                        <div className="d-flex flex-wrap" style={{ maxWidth: '30%' }}>
                          {filteredTags.map((tag, index) => (
                            <span
                              key={index}
                              className={`badge bg-secondary mr-2 ${filteredTags.length > 3 ? 'mb-1' : ''}`}
                              style={{ display: 'inline-block' }}>
                              {tag.key && tag.value
                                ? `${tag.key}: ${tag.value}`
                                : tag.key || tag.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>Loading or No Agent Found...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
