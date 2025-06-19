import './initiative.css';

interface InitiativeStepperProps {
  currentStep: number;
}

const InitiativeStepper = ({ currentStep }: InitiativeStepperProps) => {
  const stepsData = [
    { stepNumber: 1, heading: 'Initiative Details', status: 'In Progress' },
    // { stepNumber: 2, heading: 'Orchestration', status: 'Pending' },
    // { stepNumber: 2, heading: 'Settings', status: 'Pending' },
    // { stepNumber: 3, heading: 'Cloud Provider, Model Selection and Guardrails', status: 'Pending' },
    // { stepNumber: 2, heading: 'Guardrails', status: 'Pending' }, // Add Guardrails step
    { stepNumber: 2, heading: 'Tags', status: 'Pending' },
    // { stepNumber: 4, heading: 'RAG Management', status: 'Pending' },
    { stepNumber: 3, heading: 'Final Review', status: 'Pending' }
  ];
  const dictLength = Object.keys(stepsData).length;

  return (
    <ul className="progressStep ">
      {stepsData.map((item, index) => (
        <li
          style={{ width: '40%' }}
          key={index}
          className={currentStep >= item.stepNumber ? 'completed' : ''}>
          {index < dictLength - 1 && (
            <div className="progress-bar-container2">
              <div
                className={`progress-bar ${currentStep >= item.stepNumber ? 'completed' : item.status}`}></div>
            </div>
          )}
          <div>
            <div className={`check ${currentStep >= item.stepNumber ? 'completed' : item.status}`}>
              <span className="material-icons-round">done</span>
            </div>
            <p
              className={`custom-label ${item.heading === 'Cloud Provider, Model Selection and Guardrails' && 'mr-3'}`}>
              {item.heading}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default InitiativeStepper;
