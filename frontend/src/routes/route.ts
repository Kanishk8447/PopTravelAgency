import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import Layout from './Layout';
import WelcomePage from '../component/Welcome/WelcomePage';
import React from 'react';
import Hero from '../component/TravelAgency/Hero';
import MainModule from '../MainModule'; // Ensure MainModule is a valid React component
import ErrorBoundaryPopUp from '../Modals/ErrorBoundaryPopUp';
import InitiativeWizard from '../component/Initiaitve/InitiativeModule/InitiativeWizard';

const router = createBrowserRouter([
 
      // { path: '', element: React.createElement(WelcomePage) },
      // { path:'/travel', element: React.createElement(Hero) },
      // { path: '/create-Initiative', element: React.createElement(CreateInitiative) },

      // { path: '', element: React.createElement(Navigate, { to: "welcome" }) },

      // { path: '/', element: React.createElement(Navigate, { to: "welcome" }) },

      { path: '/welcome', element: React.createElement(WelcomePage) },
      { path: '/create-initiative-wizard', element: React.createElement(InitiativeWizard) },


      {
            path: '',
            element: React.createElement(MainModule),
            errorElement: React.createElement(ErrorBoundaryPopUp),
            children: [
                  { path:'/travel', element: React.createElement(Hero) },
            ]
          },
]);

export default router;
