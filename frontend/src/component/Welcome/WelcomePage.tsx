import { useState } from 'react';
// import { useUserStore } from '../store/userStore';
import Header from '../../header/Header';
import Sidebar from '../../sidebar/Sidebar';

export default function Welcome() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // const { user_role } = useUserStore();
  // const isAdmin = user_role === 'admin';

  const handleSidebarToggle = (isOpen: any) => {
    if (isOpen === undefined) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(isOpen);
    }
  };
  return (
    <>
      <Header />
      <div className="position-fixed w-100 h-100 overflow-hidden ">
        <div className={`welcome-content-wrapper ${isSidebarOpen ? '' : 'toggled'}`}>
          <Sidebar onToggle={handleSidebarToggle} />
          <div className="container-fluid ">
            <div className="container-margin-left d-flex vh-100">
              <div className="row justify-content-center">
                <div className="col-md-11">
                  <div className="card welcome-card mb-5">
                    <div className="card-body position-relative">
                      <div className="top-message mt-2">
                      </div>
                      <div className="row justify-content-center mt-5 pt-5">
                        <div className="col-md-10 ">
                              <div className="mt-70 d-flex flex-column">
                                <h3 className="welcome-heading mb-4 font-weight-bold Ubuntu">
                                  Welcome to Foundations!
                                </h3>
                                <h3 className="mb-4 text-left lh-base Ubuntu">
                                  <b>Foundations</b> is dedicated to advancing scalable Gen AI
                                  application development, leveraging the Gen AI Platform as a
                                  pivotal asset.
                                </h3>
                                <h3 className="Ubuntu">Let&rsquo;s get started!</h3>
                              </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
