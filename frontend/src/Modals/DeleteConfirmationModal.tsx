import React from 'react';

interface DeleteConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onCancel,
  onConfirm
}) => (
  <div
    className={`modal fade ${show ? 'd-block show' : ''}`}
    tabIndex={-1}
    role="dialog"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Add overlay effect
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content" style={{ borderRadius: '8px', padding: '20px' }}>
        <div className="modal-body text-center">
          <h5 className="modal-title mb-3">Are you sure you want to delete this?</h5>
          <div className="d-flex justify-content-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{
                borderRadius: '20px',
                padding: '10px 20px',
                fontWeight: 'bold',
                border: '2px solid #007bff',
                color: '#007bff'
              }}
              onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                borderRadius: '20px',
                padding: '10px 20px',
                fontWeight: 'bold',
                backgroundColor: '#007bff',
                border: 'none'
              }}
              onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteConfirmationModal;
