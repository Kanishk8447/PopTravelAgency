import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SingleCard from './card/SingleCard';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

const MainModule = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <Header />
      <div className={`content-wrapper ${isSidebarOpen ? '' : 'toggled'}`}>
        <Sidebar onToggle={handleSidebarToggle} />
        <div className="container-fluid">
          <SingleCard>
            <Outlet />
          </SingleCard>
        </div>
      </div>
    </>
  );
};

export default MainModule;
