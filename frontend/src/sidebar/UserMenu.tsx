import React, { useState, useEffect, useRef, MouseEvent, ReactNode, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useCardTitle } from '../../contexts/CardTitleContext';
import { useApi } from '../context/ApiContext';
// import { useUserStore } from '../../store/userStore';

// --- Menu Data Types ---

export interface MenuItem {
  label: string;
  iconName?: string;
  icon?: string;
  is_enabled?: boolean;
  is_disabled?: boolean;
  default_model_id?: number | null;
  scenario_id?: number | null;
  path?: string;
  adminOnly?: boolean;
  usecase_menu_id?: string | number;
  submenu?: MenuItem[];
}

export interface ToggleState {
  [label: string]: boolean;
}

export interface ActiveToggle {
  usecase_menu_id: string | number;
  label: string;
  is_enabled: boolean;
}

export interface UserMenuComponentProps {
  passCloseMenuToSubmenu: (closeFn: () => void) => void;
  toggleUsecase?: boolean;
  activeToggles: ActiveToggle[];
  setActiveToggles: (toggles: ActiveToggle[]) => void;
  resetToggles: number;
  menuItems: MenuItem[];
  setSidebarWidth: (width: number) => void;
  defaultWidth: number;
  expandedWidth: number;
  closeSidebar: () => void;
  openSidebar: boolean;
  handleMenuHover: () => void;
  disabledItemLabels: string[];
  setSelectedUsecaseDefaultModel: (model: string | number | null) => void;
  setSelectedUsecaseLabel: (label: string) => void;
  setSelectedScenarioId: (id: number | null) => void;
  context: string;
}

const UserMenuComponent: React.FC<UserMenuComponentProps> = ({
  passCloseMenuToSubmenu,
  toggleUsecase = false,
  activeToggles,
  setActiveToggles,
  resetToggles,
  menuItems,
  setSidebarWidth,
  defaultWidth,
  expandedWidth,
  closeSidebar,
  openSidebar,
  handleMenuHover,
  disabledItemLabels,
  setSelectedUsecaseDefaultModel,
  setSelectedUsecaseLabel,
  setSelectedScenarioId,
  context
}) => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<Record<string, boolean>>({});
  const [toggleState, setToggleState] = useState<ToggleState>({});
  const [openLevels, setOpenLevels] = useState<Set<number>>(new Set());
  const [labelToUsecaseId, setLabelToUsecaseId] = useState<Record<string, string | number>>({});
  const [navigatingLocation, setNavigatingLocation] = useState<string>(useLocation().pathname);

  const { UpdateStartOver, startOver } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
//   const { user_role } = useUserStore();
//   const isAdmin = user_role === 'admin';
const isAdmin = 'admin';


  // Refs for initial state
  const initialToggleStateRef = useRef<ToggleState>({});
  const initialStructuredDataRef = useRef<ActiveToggle[]>([]);

  // --- Helper: Handle click for model selection ---
  const handleClick = useCallback(
    (
      default_model_id: string | number | null | undefined,
      label: string,
      scenario_id: number | null | undefined
    ) => {
      if (context === 'ChangeDefaultModel') {
        setSelectedUsecaseDefaultModel(default_model_id ?? 'None');
        setSelectedUsecaseLabel(label);
        setSelectedScenarioId(scenario_id ?? null);
      }
    },
    [context, setSelectedUsecaseDefaultModel, setSelectedUsecaseLabel, setSelectedScenarioId]
  );

  // --- Helper: Filter menu items based on admin and is_enabled ---
  const filterMenuItems = useCallback(
    (items: MenuItem[], checkIsEnabled: boolean): MenuItem[] => {
      return items
        .filter((item) => {
          if (item.adminOnly) return isAdmin;
          return checkIsEnabled ? item.is_enabled !== false : true;
        })
        .map((item) => ({
          ...item,
          submenu: item.submenu ? filterMenuItems(item.submenu, checkIsEnabled) : undefined
        }));
    },
    [isAdmin]
  );

  // --- Effect: Set menu data from props ---
  useEffect(() => {
    setMenuData(menuItems);
  }, [menuItems]);

  // --- Compute current menu items (memoized) ---
  // Recursively filter out adminOnly items for non-admins
  const filterMenuItemsForRole = (items: MenuItem[], isAdmin: boolean): MenuItem[] => {
    if (isAdmin) {
      // Only top-level items with adminOnly: true, but include all their submenus
      return items
        .filter((item) => item.adminOnly)
        .map((item) =>
          item.submenu
            ? { ...item, submenu: item.submenu } // include all submenus as-is
            : item
        );
    } else {
      // Only items where adminOnly is not true, recursively
      return items
        .filter((item) => !item.adminOnly)
        .map((item) =>
          item.submenu ? { ...item, submenu: filterMenuItemsForRole(item.submenu, false) } : item
        );
    }
  };

  const currentMenuItems: MenuItem[] = React.useMemo(() => {
    return filterMenuItemsForRole(menuData, isAdmin);
  }, [menuData, isAdmin]);

  // --- Effect: Initialize toggles and label-to-id map ---
  useEffect(() => {
    const initialToggleState: ToggleState = {};
    const initialStructuredData: ActiveToggle[] = [];
    const labelToIdMap: Record<string, string | number> = {};

    const initializeToggles = (menu: MenuItem[]) => {
      menu.forEach((item) => {
        const isEnabled = item.is_enabled !== false;
        initialToggleState[item.label] = toggleUsecase ? isEnabled : true;
        initialStructuredData.push({
          label: item.label,
          usecase_menu_id: item.usecase_menu_id ?? item.label,
          is_enabled: isEnabled
        });
        if (item.usecase_menu_id) {
          labelToIdMap[item.label] = item.usecase_menu_id;
        }
        if (item.submenu) {
          initializeToggles(item.submenu);
        }
      });
    };

    initializeToggles(currentMenuItems);

    setToggleState(initialToggleState);
    setLabelToUsecaseId(labelToIdMap);
    initialToggleStateRef.current = initialToggleState;
    initialStructuredDataRef.current = initialStructuredData;

    if (setActiveToggles && initialStructuredData) {
      setActiveToggles(initialStructuredData);
    }
  }, [currentMenuItems, setActiveToggles, toggleUsecase]);

  // --- Effect: Reset toggles when resetToggles changes ---
  useEffect(() => {
    if (resetToggles !== 0) {
      setToggleState(initialToggleStateRef.current);
      if (setActiveToggles) {
        setActiveToggles(initialStructuredDataRef.current);
      }
    }
  }, [resetToggles, setActiveToggles]);

  // --- Menu open/close handlers ---
  const handleMenuClick = (index: number) => {
    setOpenMenu(openMenu === index ? null : index);
    setIsSubMenuOpen({});
    setOpenLevels(new Set());
  };

  const handleSubMenuToggle = (
    event: MouseEvent,
    parentIndex: string | number,
    subIndex: string | number,
    subItem: MenuItem,
    level: number
  ) => {
    event.stopPropagation();
    if (subItem.path && !toggleUsecase) return;

    setIsSubMenuOpen((prev) => {
      const key = `${parentIndex}-${subIndex}`;
      const newState = { ...prev, [key]: !prev[key] };
      // Close other submenus at this level
      Object.keys(newState).forEach((k) => {
        if (k.startsWith(`${parentIndex}-`) && k !== key) {
          newState[k] = false;
        }
      });
      return newState;
    });

    setOpenLevels((prev) => {
      const newLevels = new Set(prev);
      const submenuLevel = level + 1;
      const key = `${parentIndex}-${subIndex}`;
      if (!isSubMenuOpen[key]) {
        newLevels.add(submenuLevel);
      } else {
        newLevels.delete(submenuLevel);
      }
      return newLevels;
    });
  };

  const closeAllMenus = () => {
    setOpenMenu(null);
    setIsSubMenuOpen({});
    setOpenLevels(new Set());
    closeSidebar();
  };

  useEffect(() => {
    passCloseMenuToSubmenu(closeAllMenus);
    // eslint-disable-next-line
  }, []);

  // --- Toggle handler ---
  const handleToggle = (
    event: MouseEvent,
    key: string,
    label: string,
    submenu: MenuItem[] = []
  ) => {
    event.stopPropagation();
    event.preventDefault();

    setToggleState((prevState) => {
      const isToggledOn = !prevState[key];
      const newState: ToggleState = { ...prevState, [key]: isToggledOn };

      // Recursively toggle submenus
      const toggleSubmenus = (subItems: MenuItem[], parentState: boolean) => {
        subItems.forEach((subItem) => {
          const subItemKey = subItem.label;
          if (!disabledItemLabels.includes(subItem.label)) {
            newState[subItemKey] = parentState;
          }
          if (subItem.submenu) {
            toggleSubmenus(subItem.submenu, parentState);
          }
        });
      };
      if (submenu.length > 0) {
        toggleSubmenus(submenu, isToggledOn);
      }

      // Recursively toggle parents
      const toggleParents = (items: MenuItem[], targetKey: string, toggledOn: boolean): boolean => {
        for (const item of items) {
          const itemKey = item.label;
          if (itemKey === targetKey) return true;
          let foundInSubmenu = false;
          if (item.submenu) {
            foundInSubmenu = toggleParents(item.submenu, targetKey, toggledOn);
          }
          if (foundInSubmenu) {
            if (!disabledItemLabels.includes(item.label)) {
              newState[itemKey] =
                toggledOn ||
                (item.submenu ? item.submenu.some((subItem) => newState[subItem.label]) : false);
            }
            return true;
          }
        }
        return false;
      };
      toggleParents(currentMenuItems, key, isToggledOn);

      // Update active toggles
      const updatedActiveToggles: ActiveToggle[] = Object.entries(newState)
        .filter(([_, value]) => value)
        .map(([activeKey]) => ({
          usecase_menu_id: labelToUsecaseId[activeKey] ?? activeKey,
          label: activeKey,
          is_enabled: true
        }));

      setActiveToggles(updatedActiveToggles);

      return newState;
    });
  };

  // --- Effect: Clear toggles if activeToggles is empty ---
  useEffect(() => {
    if (activeToggles.length === 0) {
      setToggleState({});
    }
  }, [activeToggles]);

  // --- Effect: Adjust sidebar width based on open levels ---
  useEffect(() => {
    const hasDeepLevelOpen = Array.from(openLevels).some((level) => level > 0);
    setSidebarWidth(hasDeepLevelOpen ? expandedWidth : defaultWidth);
  }, [openLevels, setSidebarWidth, defaultWidth, expandedWidth]);

  // --- Render submenu (recursive) ---
  const renderSubMenu = (
    submenu: MenuItem[],
    parentIndex: string | number,
    level = 0
  ): ReactNode => {
    const hasNestedSubmenu = submenu.some((subItem) => subItem.submenu);

    return (
      <ul
        className={`list-unstyled ${
          level > 0 ? 'has-nestedsubmenu nested-scrollbar' : 'submenu'
        } ${hasNestedSubmenu ? 'parent-with-nestedsubmenu' : ''}`}>
        {submenu.map((subItem, subIndex) => {
          const isOpen = isSubMenuOpen[`${parentIndex}-${subIndex}`];
          const nestedSubmenuStyle =
            isOpen && hasNestedSubmenu && level === 0 ? 'nestedsubmenu-container pt-1' : '';
          const toggleKey = subItem.label;

          return (
            <li key={`${parentIndex}-${subIndex}`}>
              <div className={`${nestedSubmenuStyle}  ${level > 0 ? 'ml-2' : ''}`}>
                <div
                  className={`has-submenu ${isOpen ? 'open' : ''}`}
                  onClick={(event) =>
                    handleSubMenuToggle(event, parentIndex, subIndex, subItem, level)
                  }
                  style={{ fontWeight: 'normal', margin: '2px' }}>
                  <div>
                    {/* Level 0, no submenu, has path */}
                    {level === 0 && !subItem.submenu && subItem.path ? (
                      <div
                        onClick={() => {
                          if (!toggleUsecase && !subItem.is_disabled) {
                            setNavigatingLocation(subItem.path!);
                            closeSidebar();
                          }
                        }}
                        style={{
                          cursor: subItem.is_disabled ? 'not-allowed' : 'pointer',
                          opacity: subItem.is_disabled ? 0.6 : 1,
                          pointerEvents: subItem.is_disabled ? 'none' : 'auto'
                        }}>
                        <span className="d-flex justify-content-end disable-text-selection align-items-center mr-2">
                          <Link
                            to={toggleUsecase ? '#' : subItem.path!}
                            onClick={() =>
                              handleClick(
                                subItem.default_model_id,
                                subItem.label,
                                subItem.scenario_id
                              )
                            }
                            style={{
                              pointerEvents: subItem.is_disabled ? 'none' : 'auto',
                              opacity: subItem.is_disabled ? 0.6 : 1
                            }}>
                            <span className="d-flex align-items-center "
                            style={{
                              
                            }}>{subItem.iconName ?  <span className="material-icons-round mr-2 " style={{color:subItem.is_disabled?'#6499B1':'#025A82'}}>{subItem.iconName}</span> : ''}{subItem.label}</span>
                          </Link>
                          {toggleUsecase && (
                            <span
                              className={`material-icons-round disable-text-selection ${
                                toggleState[toggleKey] ? 'welcome-heading' : 'disabled-color'
                              }`}
                              style={{
                                cursor: disabledItemLabels.includes(subItem.label)
                                  ? 'not-allowed'
                                  : 'pointer',
                                pointerEvents: disabledItemLabels.includes(subItem.label)
                                  ? 'none'
                                  : 'auto'
                              }}
                              onClick={(event) => {
                                if (!disabledItemLabels.includes(subItem.label)) {
                                  handleToggle(
                                    event,
                                    toggleKey,
                                    subItem.label,
                                    subItem.submenu || []
                                  );
                                }
                              }}>
                              {toggleState[toggleKey] ? 'toggle_on' : 'toggle_off'}
                            </span>
                          )}
                        </span>
                      </div>
                    ) : level === 0 ? (
                      // Level 0, has submenu
                      <Link
                        to="#"
                        className={`d-flex justify-content-between align-items-center disable-text-selection submenu-level-0 ${
                          isOpen ? 'nested-submenu-open submenu-level-0-open' : ''
                        }`}
                        style={{
                          backgroundColor: '#F5F5F7',
                          cursor: subItem.is_disabled ? 'not-allowed' : 'pointer',
                          opacity: subItem.is_disabled ? 0.6 : 1,
                          pointerEvents: subItem.is_disabled ? 'none' : 'auto'
                        }}>
                        <div className="d-flex justify-content-center">
                          <span>
                            <img
                              className="topArrow mr-1"
                              style={{
                                marginTop: '2px',
                                marginBottom: '2px',
                                height: '16px',
                                width: '16px'
                              }}
                              alt=""
                              src="/submenu_icon.svg"
                            />{' '}
                            {subItem.label}
                          </span>
                        </div>
                        <span className="d-flex justify-content-end align-items-center">
                          <div
                            className={`material-icons-round ${
                              isOpen ? 'submenu-dropdown-icon-open' : ''
                            } ${toggleUsecase ? 'mr-1-5' : 'mr-0'}`}
                            style={{ color: '#ADADAD' }}>
                            arrow_drop_down
                          </div>
                          {toggleUsecase && (
                            <span
                              className={`material-icons-round disable-text-selection ${
                                toggleState[toggleKey] ? 'welcome-heading' : 'disabled-color'
                              }`}
                              style={{
                                cursor: disabledItemLabels.includes(subItem.label)
                                  ? 'not-allowed'
                                  : 'pointer',
                                pointerEvents: disabledItemLabels.includes(subItem.label)
                                  ? 'none'
                                  : 'auto'
                              }}
                              onClick={(event) => {
                                if (!disabledItemLabels.includes(subItem.label)) {
                                  handleToggle(
                                    event,
                                    toggleKey,
                                    subItem.label,
                                    subItem.submenu || []
                                  );
                                }
                              }}>
                              {toggleState[toggleKey] ? 'toggle_on' : 'toggle_off'}
                            </span>
                          )}
                        </span>
                      </Link>
                    ) : subItem.submenu && !subItem.path ? (
                      // Nested submenu, no path
                      <div
                        className="d-flex justify-content-between align-items-center disable-text-selection p-1 mb-1 cursor-pointer-hover small-font"
                        style={{
                          fontWeight: 'bold',
                          backgroundColor: '#F9F9F9',
                          cursor: subItem.is_disabled ? 'not-allowed' : 'pointer',
                          opacity: subItem.is_disabled ? 0.6 : 1,
                          pointerEvents: subItem.is_disabled ? 'none' : 'auto'
                        }}>
                        <div className="d-flex justify-content-center">
                          <img
                            className="topArrow mr-1"
                            style={{
                              marginTop: '2px',
                              marginBottom: '2px',
                              height: '16px',
                              width: '16px'
                            }}
                            alt=""
                            src="/submenu_icon.svg"
                          />
                          <span>{subItem.label}</span>
                        </div>
                        <span className="d-flex justify-content-end align-items-center">
                          <div
                            className={`material-icons-round ${
                              isOpen ? 'submenu-dropdown-icon-open' : ''
                            }`}
                            style={{
                              color: '#ADADAD',
                              marginRight: level > 0 ? '4px' : '0'
                            }}>
                            arrow_drop_down
                          </div>
                          {toggleUsecase && (
                            <span
                              className={`material-icons-round disable-text-selection mr-1 ${
                                toggleState[toggleKey] ? 'welcome-heading' : 'disabled-color'
                              }`}
                              style={{
                                cursor: disabledItemLabels.includes(subItem.label)
                                  ? 'not-allowed'
                                  : 'pointer',
                                pointerEvents: disabledItemLabels.includes(subItem.label)
                                  ? 'none'
                                  : 'auto'
                              }}
                              onClick={(event) => {
                                if (!disabledItemLabels.includes(subItem.label)) {
                                  handleToggle(
                                    event,
                                    toggleKey,
                                    subItem.label,
                                    subItem.submenu || []
                                  );
                                }
                              }}>
                              {toggleState[toggleKey] ? 'toggle_on' : 'toggle_off'}
                            </span>
                          )}
                        </span>
                      </div>
                    ) : (
                      // Deepest submenu item
                      <div
                        className="nestedsubmenu-list mb-2 p-1 d-flex justify-content-between small-font mr-2"
                        onClick={() => {
                          handleClick(subItem.default_model_id, subItem.label, subItem.scenario_id);
                          setNavigatingLocation(subItem.path!);
                          if (subItem.path) {
                            navigate(subItem.path);
                          }
                          if (subItem.path === location.pathname) {
                            UpdateStartOver(startOver + 1);
                          }
                          closeSidebar();
                        }}
                        style={{
                          cursor: subItem.is_disabled ? 'not-allowed' : 'pointer',
                          opacity: subItem.is_disabled ? 0.6 : 1,
                          pointerEvents: subItem.is_disabled ? 'none' : 'auto'
                        }}>
                        <div className="d-flex justify-content-center inner-submenu">
                          <img
                            className="topArrow mr-1"
                            style={{
                              marginBottom: '2px',
                              marginTop: '4px',
                              height: '14px',
                              width: '14px'
                            }}
                            alt=""
                            src="/submenu_icon.svg"
                          />
                          <span>{subItem.label}</span>
                        </div>
                        <span className="d-flex justify-content-end align-items-center mr-n1">
                          {toggleUsecase && (
                            <span
                              className={`material-icons-round disable-text-selection ${
                                toggleState[toggleKey] ? 'welcome-heading' : 'disabled-color'
                              }`}
                              style={{
                                cursor: disabledItemLabels.includes(subItem.label)
                                  ? 'not-allowed'
                                  : 'pointer',
                                pointerEvents: disabledItemLabels.includes(subItem.label)
                                  ? 'none'
                                  : 'auto'
                              }}
                              onClick={(event) => {
                                if (!disabledItemLabels.includes(subItem.label)) {
                                  handleToggle(
                                    event,
                                    toggleKey,
                                    subItem.label,
                                    subItem.submenu || []
                                  );
                                }
                              }}>
                              {toggleState[toggleKey] ? 'toggle_on' : 'toggle_off'}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {subItem.submenu && <span className="caret"></span>}
                  </div>
                </div>
                {subItem.submenu &&
                  isOpen &&
                  renderSubMenu(subItem.submenu, `${parentIndex}-${subIndex}`, level + 1)}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // --- Render main menu ---
  return (
    <>
      {currentMenuItems.map((menuItem, index) => {
        const toggleKey = menuItem.label;
        return (
          <li
            key={index}
            className={`has-submenu ${openMenu === index ? 'open' : ''}`}
            onClick={() => handleMenuClick(index)}>
            <div
              className="menu main-menu-hover"
              style={{
                color: openMenu === index ? '#025A82' : '',
                cursor: menuItem.is_disabled ? 'not-allowed' : 'pointer',
                opacity: menuItem.is_disabled ? 0.6 : 1,
                pointerEvents: menuItem.is_disabled ? 'none' : 'auto'
              }}
              onClick={(e) => {
                handleClick(menuItem.default_model_id, menuItem.label, menuItem.scenario_id);
                if (!openSidebar && !toggleUsecase) {
                  handleMenuHover();
                }
              }}>
              <span
                className={`material-icons-round menu-icon-size`}
                onClick={(e) => {
                  if (!openSidebar && !toggleUsecase && !menuItem.is_disabled) {
                    handleMenuHover();
                  }
                }}>
                {menuItem.iconName}
              </span>
              <span className="menu-text text-start ms-1">
                {menuItem.label}
                {menuItem.submenu && <span className="caret"></span>}
              </span>
              <div
                className="d-flex align-items-center justify-content-end ms-auto disable-text-selection"
                style={{ marginRight: '5px' }}>
                <span className="material-icons-round menu-icon-size dropdown-icon mr-1">
                  expand_more
                </span>
                <span>
                  {toggleUsecase && (
                    <span
                      className={`material-icons-round disable-text-selection ${
                        toggleState[toggleKey] ? 'welcome-heading' : 'disabled-color'
                      }`}
                      style={{
                        cursor: disabledItemLabels.includes(menuItem.label)
                          ? 'not-allowed'
                          : 'pointer',
                        pointerEvents: disabledItemLabels.includes(menuItem.label) ? 'none' : 'auto'
                      }}
                      onClick={(event) => {
                        if (!disabledItemLabels.includes(menuItem.label)) {
                          handleToggle(event, toggleKey, menuItem.label, menuItem.submenu || []);
                        }
                      }}>
                      {toggleState[toggleKey] ? 'toggle_on' : 'toggle_off'}
                    </span>
                  )}
                </span>
              </div>
            </div>
            {menuItem.submenu && openMenu === index && renderSubMenu(menuItem.submenu, index)}
          </li>
        );
      })}
    </>
  );
};

export default UserMenuComponent;
