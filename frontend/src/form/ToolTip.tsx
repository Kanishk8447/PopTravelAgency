import { useState } from 'react';

interface ToolTipProps {
  message: string;
}

const ToolTip = ({ message }: ToolTipProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <span
        style={{ position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              rigth: '90%',
              padding: '5px 10px',
              width: '15vw',
              backgroundColor: '#FFFFFF',
              color: 'black',
              borderRadius: '16px',
              border: '1px solid #00000031'
            }}>
            {message === 'input_token_cost' && (
              <>
                <span className="fw-bold">Input Token Cost -</span>{' '}
                <span className="fw-normal">
                  For more details on token cost, please visit &nbsp;
                  <a
                    href="https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/?msockid=30619438db8063eb3e2a8751da326264"
                    target="_blank"
                    rel="noopener noreferrer">
                    Microsoft
                  </a>
                  &nbsp;or&nbsp;
                  <a
                    href="https://aws.amazon.com/bedrock/pricing/"
                    target="_blank"
                    rel="noopener noreferrer">
                    AWS
                  </a>{' '}
                  documentation as applicable.
                </span>
              </>
            )}
            {message === 'output_token_cost' && (
              <>
                {' '}
                <span className="fw-bold">Output Token Cost -</span>{' '}
                <span className="fw-normal">
                  For more details on token cost, please visit &nbsp;
                  <a
                    href="https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/?msockid=30619438db8063eb3e2a8751da326264"
                    target="_blank"
                    rel="noopener noreferrer">
                    Microsoft
                  </a>
                  &nbsp;or&nbsp;
                  <a
                    href="https://aws.amazon.com/bedrock/pricing/"
                    target="_blank"
                    rel="noopener noreferrer">
                    AWS
                  </a>{' '}
                  documentation as applicable.
                </span>
              </>
            )}

            {message === 'name' && (
              <>
                {' '}
                <span className="fw-bold">Model Name - </span>{' '}
                <span className="fw-normal">
                  The model name must match the name specified during model deployment.
                </span>
              </>
            )}
          </div>
        )}
        <img
          className="tokeninfo cursor-pointer"
          src="/tokeninfo.svg"
          style={{ marginLeft: '3px', marginBottom: '3px', color: '#6499B1' }}
        />
      </span>
    </>
  );
};

export default ToolTip;
