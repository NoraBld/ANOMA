import React, { useState } from 'react';
import CustomSidebarCl from '../components/CustomSidebarCl';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { FaPen } from 'react-icons/fa';


const ProfileCl = () => {
  const [userData, setUserData] = useState({
    nom: 'Belaid',
    prenom: 'Nora',
    id: '123456789',
    email: 'nora@example.com',
    telephone: '0550 123 456',
    adresse: 'Alger, Algérie',
    motdepasse: '********',
  });

  const [editableFields, setEditableFields] = useState({
    email: false,
    telephone: false,
    adresse: false,
    motdepasse: false,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const toggleEdit = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['current', 'new', 'confirm'].includes(name)) {
      setPasswords({ ...passwords, [name]: value });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editableFields.motdepasse) {
      if (passwords.new !== passwords.confirm) {
        alert("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
      setUserData({ ...userData, motdepasse: '********' });
      setPasswords({ current: '', new: '', confirm: '' });
    }
    alert("Informations enregistrées !");
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#E5E5E5' }}>
      <ProSidebarProvider>
        <CustomSidebarCl />
      </ProSidebarProvider>

      <div className="flex-1 p-10 overflow-auto" style={{ backgroundColor: '#E5E5E5' }}>
        <div className="max-w-4xl mx-auto rounded-xl shadow-md p-8" style={{ backgroundColor: '#8D91AB' }}>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#162556' }}>Mon profil</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Champs non modifiables */}
            {[
              { name: 'nom', label: 'Nom' },
              { name: 'prenom', label: 'Prénom' },
              { name: 'id', label: 'ID' },
            ].map(({ name, label }) => (
              <div key={name} className="flex flex-col">
                <label className="mb-1 text-sm" style={{ color: '#2D3250' }}>{label}</label>
                <span className="p-2 rounded bg-[#8D91AB]" style={{ color: '#162556' }}>{userData[name]}</span>
              </div>
            ))}

            {/* Champs modifiables avec stylo */}
            {[
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'telephone', label: 'Téléphone', type: 'text' },
              { name: 'adresse', label: 'Adresse', type: 'text' },
            ].map(({ name, label, type }) => (
              <div key={name} className="flex flex-col">
                <label className="mb-1 text-sm" style={{ color: '#2D3250' }}>{label}</label>
                <div className="flex items-center space-x-2">
                  {editableFields[name] ? (
                    <input
                      type={type}
                      name={name}
                      value={userData[name]}
                      onChange={handleChange}
                      onBlur={() => toggleEdit(name)}
                      autoFocus
                      className="flex-1 p-2 rounded bg-[#8D91AB] outline-none placeholder-[#162556]"
                      style={{ color: '#162556' }}
                    />
                  ) : (
                    <>
                      <span className="flex-1 p-2 rounded bg-[#8D91AB]" style={{ color: '#162556' }}>{userData[name]}</span>
                      <FaPen
                        className="cursor-pointer"
                        color="#FCB17A"
                        onClick={() => toggleEdit(name)}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Champ mot de passe */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-sm" style={{ color: '#2D3250' }}>Mot de passe</label>
              {editableFields.motdepasse ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handleChange}
                    placeholder="Mot de passe actuel"
                    className="p-2 rounded bg-[#8D91AB] outline-none placeholder-[#162556]"
                    style={{ color: '#162556' }}
                  />
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handleChange}
                    placeholder="Nouveau mot de passe"
                    className="p-2 rounded bg-[#8D91AB] outline-none placeholder-[#162556]"
                    style={{ color: '#162556' }}
                  />
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handleChange}
                    placeholder="Confirmer le mot de passe"
                    className="p-2 rounded bg-[#8D91AB] outline-none placeholder-[#162556]"
                    style={{ color: '#162556' }}
                    onBlur={() => toggleEdit('motdepasse')}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="p-2 rounded bg-[#8D91AB]" style={{ color: '#162556' }}>{userData.motdepasse}</span>
                  <FaPen
                    className="cursor-pointer"
                    color="#FCB17A"
                    onClick={() => toggleEdit('motdepasse')}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded hover:brightness-110 text-white"
                style={{ backgroundColor: '#FCB17A' }}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCl;
