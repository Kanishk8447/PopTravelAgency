import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { notification } from '../../../service/notification-Service';
import apiService from '../../../service/apiService';

const InitiativeManagement = () => {
  const navigate = useNavigate();
  // const { updateCardTitle } = useCardTitle();
  // const { initiatives } = useInitiativeStore();
  const [selectedInitiativeValue, setSelectedInitiativeValue] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);
 const [initiatives, setInitiatives] = useState<any[]>([]);
 useEffect(()=>{
      const fetchData= async ()=>{
        try {
          const response = await apiService.getData('initiatives');
          if (response) {
                    setInitiatives(response);

            notification('success', 'Search successful!');
          }
        } catch (error) {
          setLoading(false);
          console.error('Error:', error);
          notification('error', 'Failed to search. Try again!');
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []);

  // useEffect(() => {
  //   updateCardTitle('Initiative Details');
  // }, [updateCardTitle]);

  // useEffect(() => {
  //   fetch('/listInitiative.json')
  //     .then((response) => response.json())
  //     .then((data) => setInitiativeList(data))
  //     .catch((error) => console.error('Error fetching initiative data:', error));
  // }, []);

  useEffect(() => {
    // Set loading to false if initiatives are loaded
    if (initiatives && initiatives.length > 0) {
      setLoading(false);
    }

    // Set a timeout to stop loading after 30 seconds regardless
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 40000); // 40 seconds in milliseconds

    // Clean up the timeout if component unmounts or initiatives load before timeout
    return () => clearTimeout(timeoutId);
  }, [initiatives]);

  // Create filtered list before returning JSX
  const filteredInitiatives = initiatives.filter((initiative) => {
    const name =
      initiative.name || (initiative.Agents?.length > 0 ? initiative.Agents[0].agent_name : '');
    return name.toLowerCase().includes(filterText.toLowerCase());
  });

  const [hoveredInitiativeId, setHoveredInitiativeId] = useState(null);

  return (
    <>
      <div className="row ml-1">
        <div className="col-md-3">
          <div className="d-flex justify-content-between mb-2">
            <span className="stepper-heading fw-bold">Initiatives</span>
          </div>
          <div>
            <div className="row">
              <div className="std-background std-border-radius py-3 mb-3 mt-2 px-2">
                {/* Initiative List */}
                <div className="input-container mt-3 mb-4 d-flex align-items-center justify-content-center">
                  <span
                    className="material-icons-round search-icon mt-1 p-2 "
                    style={{ marginLeft: '22px' }}>
                    search
                  </span>
                  <input
                    type="text"
                    className="ml-4"
                    placeholder="Search initiative here . . ."
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div
                    className="projectListContainer d-flex align-items-center justify-content-center"
                    style={{ minHeight: '280px', overflow: 'hidden' }}>
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <div className="col-md-12 pt-2 usecasescroll-model std-background px-2">
                    {/* {initiatives.length > 0 ? (
                    initiatives.map((initiative) => ( */}
                    {filteredInitiatives.length > 0 ? (
                      filteredInitiatives.map((initiative) => (
                        <div key={initiative.id}>
                          <div
                            className={`white-bg-color pl-5 std-border-radius cursor-pointer model-list std-color-active position-relative
      ${selectedInitiativeValue?.id === initiative.id ? 'active' : 'model-hover'}`}
                            style={{
                              margin: '8px',
                              padding: '12px',
                              transition: 'background-color 0.3s ease',
                              minWidth: '100px',
                              minHeight: '50px',
                              overflowWrap: 'break-word', // Ensures text breaks within container
                              wordBreak: 'break-word', // Forces line breaking for long words
                              display: 'flex',
                              flexDirection: 'column',
                              width: '100%' // Bootstrap class to make the width responsive
                            }}
                            onClick={() => {
                              setSelectedInitiativeValue((prev) =>
                                prev?.id === initiative.id ? null : initiative
                              );
                              setIsOpen((prev) =>
                                selectedInitiativeValue?.id === initiative.id ? !prev : true
                              );
                              navigate(`initiative-details/${initiative.id}`);
                            }}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div
                                className={`${selectedInitiativeValue?.id === initiative.id ? 'fw-bold' : ''}`}>
                                {initiative.name ||
                                  (initiative.Agents?.length > 0
                                    ? initiative.Agents[0].agent_name
                                    : 'Unnamed Initiative')}
                              </div>
                              <div
                                className="d-flex align-items-center justify-content-end ms-auto disable-text-selection"
                                style={{ marginRight: '5px' }}>
                                <span
                                  className="material-icons-round menu-icon-size dropdown-icon mr-1"
                                  style={
                                    selectedInitiativeValue?.id === initiative.id
                                      ? {
                                          transform: 'rotate(-180deg)',
                                          transition: '300ms linear all',
                                          color: '#adadad',
                                          borderRadius: '24px'
                                        }
                                      : {}
                                  }>
                                  arrow_drop_down
                                </span>
                              </div>
                            </div>
                            <div className="ml-n2">
                              {selectedInitiativeValue?.id === initiative.id &&
                                initiative.Agents?.length > 0 && (
                                  <div className="mt-2">
                                    {initiative.Agents.map((agent) => (
                                      <Link
                                        to={`./initiative-details/${initiative.id}/${agent.agent_id}`}
                                        className="text-decoration-none"
                                        key={agent.agent_name}
                                        onClick={(e) => e.stopPropagation()}>
                                        <div
                                          className="pl-2 mr-5 p-1 std-border-radius cursor-pointer text-white model-list std-color-active initiaitve-hover"
                                          style={{
                                            borderRadius: '4px',
                                            whiteSpace: 'nowrap'
                                          }}>
                                          <span className="fw-normal ml-1">{agent.agent_name}</span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center mt-3">No Initiatives Found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default InitiativeManagement;
