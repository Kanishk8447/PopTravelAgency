import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../../service/apiService';
import { notification } from '../../../service/notification-Service';
import { useApi } from '../../../context/ApiContext';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const InitiativeDetails = () => {
  const { initiativeId } = useParams();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  
   useEffect(()=>{
        const fetchData= async ()=>{
          try {
        const response = await apiService.getData('api/initiative/list');
            if (response) {
              setInitiatives(response?.data);
              // notification('success', 'Initiatives fetched successfully!');
            }
          } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            notification('error', 'Failed to fetch Initiatives. Try again!');
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, []);

  const initiative = initiatives.find((item) => item.id === initiativeId);
  // Find the specific agent from the matched initiative
  const agents = initiative?.Agents || [];
  const { setLoading } = useApi();




  const [allModels, setAllModels] = useState([]);

  useEffect(() => {
    const fetchModelList = async () => {
      try {
        setLoading(true);
        const response = await apiService.getData('api/model/list');
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
  const currentModel = allModels?.find((model) => model.name === initiative?.llms?.name);
  const modelLabel = currentModel ? currentModel.label : initiative?.llms?.name;

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

    </div>
  );

};

export default InitiativeDetails;
