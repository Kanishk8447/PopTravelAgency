import { useState } from 'react';
// import Header from '../../components/header/Header';
import '../TravelAgency/travel.css';
// import Sidebar from '../../components/sidebar/Sidebar';
import ScrollToTop from './ScrollToTop';
import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Recommend from './Recommend';
import Testimonials from './Testimonials';
import Footer from './Footer';

export default function TravelAgency() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const handleSidebarToggle = (isOpen: any) => {
    if (isOpen === undefined) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(isOpen);
    }
  };
  return (
    <>
      {/* <Header /> */}
      <div className="position-fixed w-100 h-100">
        <div
          className={`welcome-content-wrapper ${isSidebarOpen ? '' : 'toggled'}`}
          style={{ overflowY: 'auto', height: '100vh' }}>
          {/* <Sidebar onToggle={handleSidebarToggle} /> */}
          <div className="container-fluid">
            <div className="d-flex vh-100">
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="card welcome-card mb-5">
                    <div className="card-body position-relative mr-5">
                      <ScrollToTop />
                      <Navbar />
                      <Hero />
                      <Services />
                      {/* <Recommend /> */}
                      <Testimonials />
                      <Footer />
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
