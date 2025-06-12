import React, { useState, useEffect, useRef, MutableRefObject, MouseEvent } from 'react';
import UserMenuComponent from './UserMenu';
import './sidebar.css';

interface SidebarProps {
  onToggle?: (closed: boolean) => void;
}

const initialWidth = 70;
const defaultWidth = 250;
const expandedWidth = 350;

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [closeAllMenu, setCloseAllMenu] = useState<(() => void) | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch menu items ---
  useEffect(() => {
    fetch('/sidebar-menu.json')
      .then((response) => response.json())
      .then((data: MenuItem[]) => setMenuItems(data))
      .catch((error) => console.error('Error fetching menu data:', error));
  }, []);

  // --- Handle click outside sidebar ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (event.target.closest('.code-block')) return;
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenSidebar(false);
        if (onToggle) onToggle(true);
        handleMenuLeave();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [onToggle]);

  // --- Sidebar open/close handlers ---
  const handleMenuHover = () => {
    setOpenSidebar(true);
    if (onToggle) onToggle(false);
  };

  const handleMenuLeave = () => {
    setOpenSidebar(false);
    if (onToggle) onToggle(true);
    if (closeAllMenu) closeAllMenu();
  };

  // --- Receive closeAllMenus from UserMenuComponent ---
  const handleCloseMenuFunction = (closeFunction: () => void) => {
    setCloseAllMenu(() => closeFunction);
  };

  // --- UserMenuComponent state for toggles ---
  const [activeToggles, setActiveToggles] = useState<ActiveToggle[]>([]);
  const [resetToggles, setResetToggles] = useState<number>(0);

  // --- Dummy handlers for required props ---
  const setSelectedUsecaseDefaultModel = (model: string | number | null) => {};
  const setSelectedUsecaseLabel = (label: string) => {};
  const setSelectedScenarioId = (id: number | null) => {};

  return (
    <div id="wrapper" className={`test ${openSidebar ? '' : 'toggled'} invisibleScrollbar`}>
      <div
        id="sidebar-wrapper"
        className="sidebar-scroll"
        style={{
          borderRadius: '24px',
          width: `${!openSidebar ? initialWidth : sidebarWidth}px`
        }}
        ref={sidebarRef}>
        <div
          className="container-fluid h-100 menu-container scroll-content"
          onClick={handleMenuHover}>
          <div style={{ height: '90%' }}>
            <ul className="sidebar-nav nav navbar-nav ml-0">
              <li className="sidebar-brand">
                <div className="menu" id="menu-toggle">
                  <span
                    className="menu-text pull-left mr-3 material-icons-round iconbar fs-3"
                    style={{ fontWeight: 'normal' }}
                    aria-hidden="true">
                    menu_open
                  </span>
                  {openSidebar ? (
                    <i
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuLeave();
                      }}
                      className="fa fa-times iconbar menu-icon-right"
                      aria-hidden="true"></i>
                  ) : (
                    <i
                      onClick={handleMenuHover}
                      className="fa fa-bars iconbar menu-icon-size"
                      aria-hidden="true"></i>
                  )}
                </div>
              </li>
              <UserMenuComponent
                passCloseMenuToSubmenu={handleCloseMenuFunction}
                menuItems={menuItems}
                setSidebarWidth={setSidebarWidth}
                defaultWidth={defaultWidth}
                expandedWidth={expandedWidth}
                handleMenuHover={handleMenuHover}
                closeSidebar={() => {
                  setOpenSidebar(false);
                  if (closeAllMenu) closeAllMenu();
                  if (onToggle) onToggle(true);
                }}
                toggleUsecase={false}
                activeToggles={activeToggles}
                setActiveToggles={setActiveToggles}
                resetToggles={resetToggles}
                disabledItemLabels={[]}
                setSelectedUsecaseDefaultModel={setSelectedUsecaseDefaultModel}
                setSelectedUsecaseLabel={setSelectedUsecaseLabel}
                setSelectedScenarioId={setSelectedScenarioId}
                context=""
                openSidebar={openSidebar}
              />
            </ul>
          </div>
          <div
            className={`navbar-amp-logo d-flex align-items-center justify-content-center`}
            style={{ height: '10%' }}>
            <img style={{ color: '#025A82' }} src="/auto_awesome_24dp.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
