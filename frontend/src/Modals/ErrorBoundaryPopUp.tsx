import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useEffect } from 'react';
import * as bootstrap from 'bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorBoundaryPopUp = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Unknown error occurred.';
  let statusText = '';

  if (isRouteErrorResponse(error)) {
    statusText = `${error.status} ${error.statusText}`;
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  useEffect(() => {
    const modalElement = document.getElementById('errorboundary-info');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    }
  }, []);

  return (
    <div
      className="modal fade high-zindex-blur-background"
      id="errorboundary-info"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      data-bs-backdrop="static"
      aria-hidden="true">
      <div
        className="modal-dialog modal-lg modal-dialog-centered d-flex justify-content-center align-items-center"
        role="document">
        <div className="modal-content" style={{ width: '26vw', color: '#000000' }}>
          <div className="modal-body mt-3 pt-4">
            <div className="">
              <div className="fs-4 fw-bold d-flex justify-content-center align-items-center">
                <span>
                  <img className="mb-1 mr-1" src="/errorboundary.svg" alt="Error" />
                </span>
                Oops!
              </div>
              <div className="semi-thick fs-4 d-flex justify-content-center align-items-center mt-4">
                We encountered an unexpected issue.
              </div>
              {statusText && (
                <div className="fs-5 d-flex justify-content-center align-items-center text-center mt-2">
                  {statusText}
                </div>
              )}
              <div className="fs-5 d-flex justify-content-center align-items-center text-center mt-2">
                Error: {errorMessage}
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-center pb-4 mb-2">
            <button
              type="button"
              className="fs-5 rounded-pill px-4 text-center text-white"
              data-bs-dismiss="modal"
              onClick={() => navigate('/welcome')}
              style={{
                backgroundColor: '#005A82',
                paddingTop: '13px',
                paddingBottom: '13px'
              }}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryPopUp;
