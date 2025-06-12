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
import ProtectedRoute from './ProtectedRoute';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';
import RunInitiative from '../component/Interact/RunInitiative';
import { RunInitiativeSource } from '../component/Interact/RunInitiativeSourceEnum';

const router = createBrowserRouter([
 

{ 
    path: '/', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(LoginPage) })
  },
  { 
    path: '/login', 
    element: React.createElement(RedirectIfAuthenticated, { children: React.createElement(LoginPage) })
  },
    { path: '/create-initiative-wizard', element: React.createElement(ProtectedRoute, { element: React.createElement(InitiativeWizard) }) },
  { path: '/welcome', element: React.createElement(ProtectedRoute, { element: React.createElement(WelcomePage) }) },
  { 
    path: '',
    element: React.createElement(ProtectedRoute, { element: React.createElement(MainModule) }),
    errorElement: React.createElement(ErrorBoundaryPopUp),
    children: [
      
      { path: '/travel', element: React.createElement(Hero) },
      { path: 'travel-agency', element: React.createElement(RunInitiative, {
                source: RunInitiativeSource.Native,
                isExpanded: false,
                interactHeight: false
              })},
              { path: 'manufacturing-agency', element: React.createElement(RunInitiative, {
                source: RunInitiativeSource.Native,
                isExpanded: false,
                interactHeight: false
              })},
      { path: 'run-initiative', element: React.createElement(RunInitiative, {
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


      // { path: '/welcome', element: React.createElement(WelcomePage) },
      // { path: '/create-initiative-wizard', element: React.createElement(InitiativeWizard) },


      // {
      //       path: '',
      //       element: React.createElement(MainModule),
      //       errorElement: React.createElement(ErrorBoundaryPopUp),
      //       children: [
      //             { path:'/travel', element: React.createElement(Hero) },
      //             {
      //                   path: 'initiative/initiativeManagement',
      //                   element: React.createElement(InitiativeManagement),
      //                   children: [
      //                   { path: 'initiative-details/:initiativeId', element: React.createElement(InitiativeDetails) },
      //                   { path: 'initiative-details/:initiaitveId/:id', element: React.createElement(AgentDetails) }
      //                   ]
      //             }
      //       ]
      // },
]);

export default router;
