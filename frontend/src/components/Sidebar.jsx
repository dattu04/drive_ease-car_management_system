import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/drivee.jpg';

const Sidebar = ({
  activeSection,
  setActiveSection,
  user,
  handleLogout,
  sidebarExpanded,
  toggleSidebar
}) => {
  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { id: 'locations', label: 'Showrooms', icon: '📍' }
    ];

    const customerItems = [
      { id: 'featured', label: 'Featured Vehicles', icon: '🚗' },
      { id: 'testdrive', label: 'Schedule Test Drive', icon: '🔑' },
      { id: 'bookings', label: 'My Bookings', icon: '📅' },
      { id: 'services', label: 'Book a Service', icon: '🔧' }
    ];

    const employeeItems = [
      { id: 'approve-bookings', label: 'Manage Bookings', icon: '✓' },
      { id: 'car-management', label: 'Manage Vehicles', icon: '🚗' },
      { id: 'parts', label: 'Parts Inventory', icon: '🔩' }
    ];

    const supervisorItems = [
      { id: 'manage-locations', label: 'Manage Locations', icon: '🏢' }
    ];

    let roleSpecificItems = [];
    if (user) {
      if (user.role === 'customer') roleSpecificItems = customerItems;
      else if (user.role === 'employee') roleSpecificItems = employeeItems;
      else if (user.role === 'supervisor') roleSpecificItems = [...employeeItems, ...supervisorItems];
    }

    return [...commonItems, ...roleSpecificItems];
  };

  const getUserInitial = () => {
    if (!user) return '?';
    if (user.name?.length > 0) return user.name.charAt(0).toUpperCase();
    if (user.email?.length > 0) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const getDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || user.email || 'User';
  };

  const getUserPhoto = () => {
    return user?.photoURL || 'https://webstockreview.net/images/male-clipart-professional-man-3.jpg'; // Replace with actual user photo URL
  };

  return (
    <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {sidebarExpanded && (
          <div className="logo-container">
            <img src={logo} alt="DriveEase" className="logo" />
            <h2 className="logo-text">DriveEase</h2>
          </div>
        )}

        <button
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <span className="toggle-icon">
            {sidebarExpanded ? '❮' : '❯'}
          </span>
        </button>
      </div>

      {user && (
        <div className="user-info">
          <div className="avatar-container">
            <img
              src={getUserPhoto()}
              alt="User avatar"
              className="user-avatar"
            />
            {sidebarExpanded && (
              <div className="user-details">
                <span className="user-name">{getDisplayName()}</span>
                <span className="role-badge">
                  {user.role === 'customer'
                    ? 'Customer'
                    : user.role === 'employee'
                    ? 'Employee'
                    : user.role === 'supervisor'
                    ? 'Supervisor'
                    : 'User'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="menu-nav">
        <ul>
          {getMenuItems().map(item => (
            <li key={item.id}>
              <Link
                to="#"
                className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                {sidebarExpanded && <span className="menu-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} style={{ backgroundColor: '#000' }} className="logout-btn">
          <span className="logout-icon">⤴</span>
          {sidebarExpanded && <span style={{ color: '#fff' }}>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
