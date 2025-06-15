// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Menu } from 'lucide-react'; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="sm:hidden fixed top-0 left-0 z-50 text-white bg-gray-800 p-2 rounded"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-55 bg-gray-800 text-white p-4 transform transition-transform duration-300 z-40 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:static sm:block`}>
        
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <ul className="space-y-4">
          <li><a href="#" className="hover:text-blue-400">Dashboard</a></li>
          <li><a href="#" className="hover:text-blue-400">Historique</a></li>
          <li><a href="#" className="hover:text-blue-400">Prédiction</a></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
