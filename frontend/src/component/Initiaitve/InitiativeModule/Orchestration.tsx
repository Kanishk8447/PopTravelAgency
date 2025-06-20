import React, { useEffect } from 'react';

interface OrchestrationProps {
  formValues: any;
  handleChange: (name: string, value: any, type?: string, agentIndex?: number) => void;
  isFormReset: boolean;
  editingInitiative: boolean; // Add this prop to check if it's an editing scenario
}

const Orchestration = ({
  formValues,
  handleChange,
  isFormReset,
  editingInitiative
}: OrchestrationProps) => {
  useEffect(() => {
    // Set default orchestration role based on editingInitiative and is_multiagent
    if (editingInitiative) {
      
      const defaultRole = formValues.is_multiagent ? 'Supervisor' : 'User';
      handleChange('orchestration', defaultRole, 'select');
    }
  }, [formValues.is_multiagent, handleChange, editingInitiative]);

  const handleOrchestrationChange = (value: string) => {
    // Update the orchestration field
    handleChange('orchestration', value, 'select');

    // Update the is_supervisor field for the first agent
    const isSupervisor = value === 'Supervisor';
    handleChange('is_supervisor', isSupervisor, 'select', 0); // Update the first agent
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <p>Select Orchestration</p>
        <div className="form-group">
          <label htmlFor="orchestrationSetting">Orchestration Role</label>
          <select
            id="orchestrationSetting"
            className="form-control"
            style={{ width: '50%' }}
            value={formValues.orchestration || ''}
            onChange={(e) => handleOrchestrationChange(e.target.value)}>
            <option value="">Select Role</option>
            <option value="Supervisor">Supervisor</option>
            <option value="User">Sequential</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Orchestration;
