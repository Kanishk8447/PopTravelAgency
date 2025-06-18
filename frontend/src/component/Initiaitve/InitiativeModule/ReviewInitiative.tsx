import { useState } from 'react';
import * as bootstrap from 'bootstrap';
import { useEffect } from 'react';
import apiService from '../../../service/apiService';
import { useApi } from '../../../context/ApiContext';

interface FormValues {
  cloud: string;
  model: string;
  guardrail?: string;
  memory?: string;
  is_marketplace?: number;
  input_type?: string;
  tags: { key: string; value: string }[];
  knowledge_documents: ArrayBuffer | String[] | File | any[];
  agents: {
    agent_name: string;
    agent_description: string;
    agent_character: string;
    model: string;
    guardrail?: boolean;
    memory?: boolean;
    cloud?: string;
    web_scrape?: boolean;
  }[];
}
interface Model {
  name: string;
  label: string;
  provider: string;
}
interface ReviewInitiativeProps {
  formValues: FormValues;
  handleChange: (name: string, value: any) => void;
}

const ReviewInitiative = ({ formValues, handleChange }: ReviewInitiativeProps) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const { setLoading } = useApi();



  // useEffect(() => {
  //     fetch('/models.json')
  //       .then((response) => response.json())
  //       .then((data) => setAllModels(data))
  //       .catch((error) => console.error('Error fetching menu data:', error));
  //   }, []);



  // Find the current model's label
  const currentModel = allModels.find((model) => model.name === formValues.model);
  const modelLabel = currentModel ? currentModel.label : formValues.model;

  const filteredTags = formValues.tags.filter(
    (tag) => tag.key.trim() !== '' || tag.value.trim() !== ''
  );

  const handleReadMore = () => {
    setShowMore(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="row px-0">
      {/* Common Fields Section */}
      <div className="row">
        <div className="card-header col-lg-12 px-2 mt-4 ml-4">
          <div className="card-main col-lg-12 px-0">
            <div
              className="card-body"
              style={{ height: 'calc(100% - 10px)', overflowY: 'hidden', borderRadius: '20px' }}>
              <label className="custom-label mt-3 ml-2" style={{ fontSize: '1.2rem' }}>
                Initiative Details
              </label>
              <div
                className="card-header mt-3"
                style={{
                  borderRadius: '24px',
                  width: '100%',
                  backgroundColor: '#f8f9fa',
                  padding: '20px'
                }}>
                <div className="col-md-12 d-flex d-row align-items-top mt-3">
                  <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                    Initiative Name:
                  </label>
                  <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                    {formValues.name}
                  </label>
                </div>

                <div className="col-md-12 d-flex d-row align-items-top mt-3">
                  <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                    Cloud:
                  </label>
                  <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                    {formValues.cloud}
                  </label>
                </div>
                <div className="col-md-12 d-flex d-row align-items-top mt-3">
                  <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                    Model:
                  </label>
                  <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                    {formValues.global_model}
                  </label>
                </div>
                <div className="col-md-12 d-flex  d-row align-items-top mt-3">
                  <label className="col-md-6  custom-label me-2" style={{ fontSize: '1.2rem' }}>
                    RAG :
                  </label>
                  <label className="col-md-6  custom-label" style={{ fontSize: '1.2rem' }}>
                    {Array.isArray(formValues.knowledge_documents) &&
                    formValues.knowledge_documents.length > 0
                      ? 'true'
                      : 'false'}
                  </label>
                </div>
                {filteredTags.length > 0 && (
                  <div className="col-md-12 d-flex flex-row align-items-top mt-3">
                    <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                      Tags:
                    </label>
                    <div className="col-md-6">
                      {filteredTags.map((tag, index) => (
                        <div
                          key={index}
                          className="badge bg-secondary me-2 mb-1"
                          style={{ display: 'inline-block', fontSize: '1rem' }}>
                          {tag.key && tag.value ? `${tag.key}: ${tag.value}` : tag.key || tag.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Agent Details Section */}
      <div className="row">
        <div className="card-header col-lg-12 px-2 mt-4 ml-4">
          <div className="card-main col-lg-12 px-0">
            <div
              className="card-body"
              style={{ height: 'calc(100% - 10px)', overflowY: 'hidden', borderRadius: '20px' }}>
              <label className="custom-label mt-3 ml-2" style={{ fontSize: '1.2rem' }}>
                Agent Details
              </label>
              {formValues.agents.map((agent, index) =>
                agent.agent_name && agent.agent_description ? (
                  <div
                    key={index}
                    className="card-header mt-3"
                    style={{
                      borderRadius: '24px',
                      width: '100%',
                      backgroundColor: '#f8f9fa',
                      padding: '20px'
                    }}>
                    <div className="col-md-12 d-flex d-row align-items-top mt-3">
                      <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                        Agent Name:
                      </label>
                      <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                        {agent.agent_name}
                      </label>
                    </div>
                    <div className="col-md-12 d-flex d-row align-items-top mt-3">
                      <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                        Agent Description:
                      </label>
                      <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                        {agent.agent_description}
                      </label>
                    </div>
                    <div className="col-md-12 d-flex d-row align-items-top mt-3">
                      <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                        Agent Instructions:
                      </label>
                      <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                        {agent.agent_character}
                      </label>
                    </div>
                    <div className="col-md-12 d-flex d-row align-items-top mt-3">
                      <label className="col-md-6 custom-label me-2" style={{ fontSize: '1.2rem' }}>
                        Agent Model:
                      </label>
                      <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                        {agent.model || 'Not selected'}
                      </label>
                    </div>
                    
                    {formValues.cloud === 'AWS' && (
                      <>
                        <div className="col-md-12 d-flex d-row align-items-top mt-3">
                          <label
                            className="col-md-6 custom-label me-2"
                            style={{ fontSize: '1.2rem' }}>
                            Guardrails:
                          </label>
                          <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                            {agent.guardrail ? 'true' : 'false'}
                          </label>
                        </div>
                        <div className="col-md-12 d-flex d-row align-items-top mt-3">
                          <label
                            className="col-md-6 custom-label me-2"
                            style={{ fontSize: '1.2rem' }}>
                            Memory:
                          </label>
                          <label className="col-md-6 custom-label" style={{ fontSize: '1.2rem' }}>
                            {agent.memory ? 'true' : 'false'}
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewInitiative;
