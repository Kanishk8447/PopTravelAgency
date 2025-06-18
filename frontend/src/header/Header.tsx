import React, { useState, useEffect, use } from 'react';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleTravel = () => {
    navigate('/travel-agency');
  };

  const handleManufacturing = () => {
    navigate('/manufacturing-agency');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  navigate('/login');
};

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light navbar-margin navbar-img"
        style={{ borderRadius: '24px', paddingBottom: '2px', paddingTop: '2px' }}>
        <div className="container-fluid">
          {/* <div className="navbar-brand m-3" >
            <img src="./GenAIFoundation.svg" className="logo w-auto" alt="GenAI Logo" onClick={navigatetoHomePage}/>
          </div> */}
          <Link className="navbar-brand m-3" to="/welcome">
            <img src="/GenAIFoundation.svg" className="logo w-auto" alt="GenAI Logo" />
          </Link>

          <div className="d-flex align-items-center">
            <div
              className="navbar-menu navbar-dropdown rounded-circle p-3 bg-white mr-1"
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <button
                className="hover-button btn btn-white rounded-circle"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={handleTravel}>
                <span className="profile-icon material-icons-round menu-text custom-icon" style={{marginTop: '-5px'}}>
                    travel_explore
                  </span>
              </button>
            </div>
            <div
              className="navbar-menu navbar-dropdown rounded-circle p-3 bg-white mr-1 ml-2"
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <button
                className="hover-button btn btn-white rounded-circle"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={handleManufacturing}>
                <span className="profile-icon material-icons-round menu-text custom-icon" style={{marginTop: '-5px'}}>
                    precision_manufacturing
                  </span>
              </button>
            </div>
            <div className="navbar-menu navbar-dropdown rounded-circle p-3 bg-white ml-2">
              <div className="">
                <div className="navbar-profile">
                  <span className="profile-icon material-icons-round menu-text custom-icon">
                    face_unlock
                  </span>
                </div>
                <div
                  className="border-0 dropdown-content dropdown-menu-right min-w-15"
                  style={{ cursor: 'default' }}>
                  <div>
                    <div className="mx-2 d-flex justify-content-between">
                      {/* <p className="fw-bold fs-6 mt-2">{name}</p> */}
                      <span
                        className="profile-icon material-icons-round menu-text custom-icon mt-3 mr-2"
                        style={{ marginRight: '12px' }}>
                        face_unlock
                      </span>
                    </div>
                  </div>
                  <div>
                  </div>

                  <div
                    className="mt-3 custom-button rounded-pill ml-4 mb-3"
                    style={{ maxWidth: '60%', cursor: 'default' }}>
                     <button
                     onClick={handleLogout}
                      className="rounded-link-button custom-button d-flex align-items-center justify-content-center">
                      Logout
                      <span
                        className="material-symbols-outlined"
                        style={{ marginLeft: '10px', color: '#e8eaed', fontSize: '22px' }}>
                        logout
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
