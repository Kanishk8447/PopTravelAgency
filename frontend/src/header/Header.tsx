import React, { useState, useEffect, use } from 'react';
import './header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const handleModelManagement = () => {
    navigate('/initiative/modelManagement');
  };

  const handleVoiceIT = () => {
    console.log('VoiceIT clicked');
  };

  const handleSecondButton = () => {
    navigate('/travel');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
                onClick={handleSecondButton}>
                <span className="profile-icon material-icons-round menu-text custom-icon mt-n1">
                    face_unlock
                  </span>
              </button>
            </div>
            {/* <div
              className="navbar-menu navbar-dropdown rounded-circle p-3 bg-white mr-3"
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
                  alignItems: 'center',
                  paddingBottom: '34px'
                }}>
                <span
                  className="material-symbols-rounded campaign-icon custom-icon-campaign"
                  style={{
                    color: '#6499B1',
                    fontSize: '32px' // Increased font size for better visibility
                    // paddingBottom: '500px'
                  }}>
                  campaign
                </span>
              </button>
              {location.pathname === '/welcome' && (
                <div className="message">
                  <p className="fw-bold welcome-heading fs-5 Ubuntu fw-normal">
                    Your Feedback Matters
                  </p>
                  <img className="topArrow" alt="" src="/arrowup.svg" />
                  <p className="mt-n1 font-size-18 Ubuntu fw-normal">
                    Help us enhance your experience by sharing your thoughts or reporting any
                    issues. Your insights shape our progress.
                  </p>
                  <p className="mt-n3 font-size-18 Ubuntu fw-normal">Share your voice!</p>
                </div>
              )}
              <div className="border-0 dropdown-content dropdown-menu dropdown-menu-right">
                <form
                  className="form-container-feedback rounded mt-n3"
                  onSubmit={handleSubmit}
                  style={{
                    padding: '15px', // Reduced padding for a smaller box
                    width: '350px' // Reduced width for a smaller box
                  }}>
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold fs-5 mr-2 mt-2">Feedback and Bug Reporting</p>
                    <span className="disabled material-symbols-rounded progress-icon-output-dim mt-2 mr-1">
                      <span className={`custom-icon-campaign`}>campaign</span>
                    </span>
                  </div>
                  <p className="fw-6">
                    <b>Ready to share your thoughts or report an issue?</b>
                  </p>
                  <div
                    className="text-center d-flex justify-content-start"
                    style={{ marginLeft: '-14px' }}>
                    <a
                      href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wq6idgCfa0-V7V0z13xNYb8JsYfZpydPk-tyaH7VHytUNUdJME9SU0YySFZMNEowUFhWSkpCWDhCMyQlQCN0PWcu"
                      target="blank">
                      <button
                        className="btn rounded-pill custom-button text-white mr-2"
                        type="button"
                        onClick={handleVoiceIT}>
                        <span className="d-flex justify-content-between">
                          Take me there!{'  '}
                          <span className="material-symbols-outlined ml-2">open_in_new</span>
                        </span>
                      </button>
                    </a>
                  </div>
                </form>
              </div>
            </div> */}
            {/* <div className="navbar-menu navbar-dropdown rounded-circle p-3 bg-white ml-3">
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
                      <p className="fw-bold fs-6 mt-2">{name}</p>
                      <span
                        className="profile-icon material-icons-round menu-text custom-icon mt-2 mr-2"
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
                    <Link
                      to="/logout"
                      className="rounded-link-button custom-button d-flex align-items-center justify-content-center">
                      Logout
                      <span
                        className="material-symbols-outlined"
                        style={{ marginLeft: '10px', color: '#e8eaed', fontSize: '22px' }}>
                        logout
                      </span>
                    </Link>
                  </div>
                  <div
                    className="text-left text-bold text-dark-grey ml-2 mb-1"
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'darkgrey'
                    }}>
                    VERSION {import.meta.env.VITE_APP_VERSION}
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}
        </div>
      </nav>
    </>
  );
};

export default Header;
