import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import LogoProfil from '../../assets/images/portrait.jpg';
import FileTable from './FileTable';  // Import du composant FileTable

const ProfileImage = ({ onImageChange }) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [username, setUsername] = useState('Nom utilisateur');
  const [email, setEmail] = useState('email@example.com');
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

// Données simulées pour les fichiers
  const files = [
    { name: 'Dataset1.csv', type: 'CSV', date: '2025-01-01' },
    { name: 'Dataset2.xlsx', type: 'XLSX', date: '2025-03-15' },
    { name: 'Dataset3.json', type: 'JSON', date: '2025-04-10' },
  ];

  const handlePasswordToggle = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
    } else {
      alert("Informations mises à jour !");
      // Ici, tu peux envoyer les données à un backend ou stocker dans localStorage
    }
  };

  return (
    <div className="relative flex flex-col items-center mb-8 p-6 rounded shadow-md w-full" style={{ backgroundColor: '#8D91AB', minHeight: '500px' }}>
      {/* Image de profil */}
      <div className="relative w-32 h-32 mb-4">
        <img src={LogoProfil} alt="Profil" className="w-full h-full rounded-full object-cover" />
        <div onClick={() => document.getElementById('fileInput').click()} className="absolute bottom-0 right-0 bg-[#000229] p-2 rounded-full cursor-pointer">
          <FaPen size={16} color="#FCB17A" />
        </div>
      </div>
      <input type="file" id="fileInput" onChange={onImageChange} style={{ display: 'none' }} />

      {/* Infos utilisateur */}
      <div className="mt-6 w-full px-4 space-y-4 text-white">
        {/* Nom */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm custom-label">Nom</label>
          <div className="flex items-center justify-between">
            {editUsername ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setEditUsername(false)}
                className="flex-1 p-2 rounded text-black"
                autoFocus
              />
            ) : (
              <span className="flex-1">{username}</span>
            )}
            <FaPen className="ml-2 cursor-pointer" color="#FCB17A" onClick={() => setEditUsername(true)} />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm custom-label">Email</label>
          <div className="flex items-center justify-between">
            {editEmail ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEditEmail(false)}
                className="flex-1 p-2 rounded text-black"
                autoFocus
              />
            ) : (
              <span className="flex-1">{email}</span>
            )}
            <FaPen className="ml-2 cursor-pointer" color="#FCB17A" onClick={() => setEditEmail(true)} />
          </div>
        </div>

        {/* Mot de passe */}
        <button onClick={handlePasswordToggle} className="mt-4 text-white px-4 py-2 rounded hover:brightness-110" style={{ backgroundColor: '#FCB17A' }}>
          Modifier le mot de passe
        </button>

        {showPasswordFields && (
          <div className="space-y-2">
            <div className="flex flex-col mt-4">
              <label className="mb-1 text-sm custom-label">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded text-black"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm custom-label">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded text-black"
              />
            </div>
            <button onClick={handleSubmit} className="text-white px-4 py-2 mt-2 rounded hover:brightness-110" style={{ backgroundColor: '#FCB17A' }}>
              Valider
            </button>
          </div>
        )}
      </div>

      {/* Tableau des fichiers (Composant FileTable) */}
      <FileTable files={files} />
      <style>{`
        .custom-label {
          color: #2D3250;
          font-size: 1.1rem; /* Augmentation de la taille de la police */
        }
      `}</style>
    </div>
  );
};

export default ProfileImage;
