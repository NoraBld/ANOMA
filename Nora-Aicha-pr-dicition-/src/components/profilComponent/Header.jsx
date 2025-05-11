import React from 'react';

const Header = ({ title, username }) => (
  <div className="flex justify-between items-center mb-6 rounded p-4 bg-white shadow">
    <h5 className="text-lg font-bold" style={{ color: '#4A5565' }}>{title}</h5>
    <h5 className="text-lg font-bold" style={{ color: '#4A5565' }}>{username}</h5>
  </div>
);

export default Header;
