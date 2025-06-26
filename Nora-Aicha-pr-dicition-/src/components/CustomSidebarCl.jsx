import React, { useState, useEffect } from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {
  FaBars,
  FaHome,
  FaUser,

  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa';
import '../assets/css/CustomSidebar.css';
import { Link, useNavigate } from 'react-router-dom';

function CustomSidebarCl() {
  const { collapseSidebar } = useProSidebar();
  const navigate = useNavigate();


  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  const handleResize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setIsCollapsed(mobile);
    if (mobile) {
      collapseSidebar();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    collapseSidebar();
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };


  const menuStyles = {
    button: {
      color: '#F9B17A',
      '&:hover': {
        backgroundColor: '#424762',
        color: '#F9B17A',
      },
    },
    icon: {
      color: '#F9B17A',
      '&:hover': {
        color: '#2D3250',
      },
    },
  };

  return (
    <>
      {isMobile && (
        <button 
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded sm:hidden"
        >
          <FaBars />
        </button>
      )}

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <Menu menuItemStyles={menuStyles}>
          <div style={{ height: '60px' }}></div>

          <MenuItem 

            component={<Link to="/profileCl" />} 
            icon={<FaUser />}

          >
            Profil
          </MenuItem>

          <MenuItem icon={<FaHome />} component={<Link to="/visualisationCl" />}>
            Visualisation
          </MenuItem>


          

        </Menu>

        <div style={{ flexGrow: 1 }}></div>

        <Menu menuItemStyles={menuStyles}>

          <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
            Déconnexion
          </MenuItem>

        </Menu>
      </div>
    </>
  );
}

export default CustomSidebarCl;
