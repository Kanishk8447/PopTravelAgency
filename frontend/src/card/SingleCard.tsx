import React, { useState } from 'react';
import './card.css';
// import { useCardTitle } from '../contexts/CardTitleContext';
import { useLocation } from 'react-router-dom';
import { useApi } from '../context/ApiContext';

const SingleCard = ({ children }: { children: React.ReactNode }) => {
  const { cardTitle } = useApi();
  const [card1Size, setCard1Size] = useState({ width: '100%', height: 'calc(100vh - 160px)' });
  //   const {isGenericChat } = useGenericChat();
  const location = useLocation();
  const exclusionForButton = ['/initiative/interact'];
  const isExcluded = exclusionForButton.some((exclusion) => location.pathname.includes(exclusion));

  //   useEffect(() => {
  //     // if (!stepData) {
  //     //   setCard1Size({ ...card1Size, height: 'calc(100vh - 160px)' });
  //     // } else {
  //       setCard1Size({ ...card1Size, height: 'calc(100vh - 280px)' });
  //     // }
  //   }, []);

  return (
    <div className="container-margin-left" style={{ display: 'flex', height: '100%' }}>
      <div className="row w-100">
        {/* <div className='col-md-12' 
        style={{marginTop : exclusionForButton.some(exclusion => location.pathname.includes(exclusion)) ? '16px' : null}}> 
        {stepData && ( <ProgressSteps /> )} 
        </div> */}
        <div className="col-md-12">
          <div
            className={`card card-main `}
            style={{
              overflow: 'hidden',
              transition: 'all 0.3s',
              width: card1Size.width,
              height: card1Size.height
            }}>
            <div className="card-header">
              <h4 className="card-title card-adjust-headings d-flex align-items-center justify-content-center">
                <span className="material-symbols-outlined icon text-primary-th">
                  format_image_right
                </span>
                <span className=" stepper-heading heading font-weight-normal">{cardTitle}</span>
              </h4>
            </div>
            <div
              className={`usecasescroll card-container pb-0 card-body ${isExcluded ? 'margin-padding-zero' : ''}`}
              style={{
                backgroundColor: isExcluded ? '#f5f5f7' : ''
              }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
