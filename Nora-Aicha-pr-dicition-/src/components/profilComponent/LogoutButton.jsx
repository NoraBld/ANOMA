import React from 'react';

const LogoutButton = () => (
  <div className="mt-6 flex justify-center">
    <button
      onClick={() => alert('Déconnexion')}
      className="px-6 py-2 rounded text-white"
      style={{ backgroundColor: '#000229' }}
    >
      Déconnexion
    </button>
  </div>
);

export default LogoutButton;
