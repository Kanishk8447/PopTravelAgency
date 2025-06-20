import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import WelcomePage from '../component/Welcome/WelcomePage';
import React from 'react';
import Hero from '../component/TravelAgency/Hero';
import MainModule from '../MainModule'; // Ensure MainModule is a valid React component
import ErrorBoundaryPopUp from '../Modals/ErrorBoundaryPopUp';
import InitiativeWizard from '../component/Initiaitve/InitiativeModule/InitiativeWizard';
import InitiativeManagement from '../component/Initiaitve/ListInitiative/InitiativeManagement';
import InitiativeDetails from '../component/Initiaitve/ListInitiative/InitiativeDetails';
import AgentDetails from '../component/Initiaitve/ListInitiative/AgentDetails';
import LoginPage from '../../auth/LoginPage';
import Callback from '../../auth/Callback';
import OAuthRedirect from '../../auth/OAuthRedirect';
import OAuthCallback from '../../auth/OAuthCallback';

import ProtectedRoute from './ProtectedRoute';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';
import RunInitiative from '../component/Interact/RunInitiative';
import { RunInitiativeSource } from '../component/Interact/RunInitiativeSourceEnum';
import TravelRunInitiative from '../component/Interact/TravelRunInitiative';
import ManufacturingInitiative from '../component/Interact/ManufacturingInitiative';
import { Logout } from '../component/Logout';

const router = createBrowserRouter([
 
      // { path: '/welcome', element: <WelcomePage /> },

{ 
    path: '/', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(LoginPage) })
  },
 
    { path: '/create-initiative-wizard', element: React.createElement(ProtectedRoute, { element: React.createElement(InitiativeWizard) }) },
      { path: '', element: React.createElement(ProtectedRoute, { element: React.createElement(WelcomePage) }) },

  { path: '/welcome', element: React.createElement(ProtectedRoute, { element: React.createElement(WelcomePage) }) },
  { 
    path: '',
    element: React.createElement(ProtectedRoute, { element: React.createElement(MainModule) }),
    errorElement: React.createElement(ErrorBoundaryPopUp),
    children: [
      
      { path: '/travel', element: React.createElement(Hero) },
      { path: 'run-initiative', element: React.createElement(RunInitiative, {
                source: RunInitiativeSource.Native,
                isExpanded: false,
                interactHeight: false
              })},
              { path: 'travel-agency', element: React.createElement(TravelRunInitiative, {
                source: RunInitiativeSource.Native,
                isExpanded: false,
                interactHeight: false
              })},
              { path: 'manufacturing-agency', element: React.createElement(ManufacturingInitiative, {
                source: RunInitiativeSource.Native,
                isExpanded: false,
                interactHeight: false
              })},
      {
        path: 'initiative/initiativeManagement',
        element: React.createElement(InitiativeManagement),
        children: [
          { path: 'initiative-details/:initiativeId', element: React.createElement(InitiativeDetails) },
          { path: 'initiative-details/:initiaitveId/:id', element: React.createElement(AgentDetails) },
          
        ]
      }
    ]
  },



 { 
    path: '/login', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(LoginPage) })
  },
  { path: '/logout', element: React.createElement(Logout) },
  // { 
  //   path: '/logout', 
  //   element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(Logout) })
  // },
   { 
    path: '/redirect', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(Callback) })
  },
   { 
    path: '/oauth-redirect', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(OAuthRedirect) })
  },
   { 
    path: '/oauth-callback', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(OAuthCallback) })
  },


  // { path: '/oauth-callback-aws', element: <OAuthCallbackAWS /> }
]);

export default router;
