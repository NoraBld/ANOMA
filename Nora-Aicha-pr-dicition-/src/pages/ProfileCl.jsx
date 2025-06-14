
import React, { useState, useEffect } from 'react';
import CustomSidebarCl from '../components/CustomSidebarCl';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { FaPen } from 'react-icons/fa';

const ProfileCl = () => {
  const [userData, setUserData] = useState({
    id: '',
    nom: '',
    prenom: '',
    codeClient: '',
    email: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
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

  useEffect(() => {
    const storedClient = localStorage.getItem('client');
    if (storedClient) {
      const client = JSON.parse(storedClient);
      setUserData({
        id: client.id || '',
        nom: client.nom || '',
        prenom: client.prenom || '',
        codeClient: client.codeClient || '',
        email: client.email || '',
        telephone: client.telephone || '',
        date_naissance: client.date_naissance || '',
        adresse: client.adresse || '',
        motdepasse: '********',
      });
    }
  }, []);

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

  const validateInputs = () => {
    // Email : doit être en minuscules, se terminant par @gmail.com
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    // Téléphone : commence par 05,06,07 + 8 chiffres ou +213 + 9 chiffres
    const phoneRegex = /^(05|06|07)\d{8}$|^\+213\d{9}$/;

    if (!emailRegex.test(userData.email)) {
      alert("Email invalide. Utilisez une adresse se terminant par @gmail.com en minuscules.");
      return false;
    }

    if (!phoneRegex.test(userData.telephone)) {
      alert("Numéro de téléphone invalide. Il doit commencer par 05, 06, 07 suivi de 8 chiffres, ou +213 suivi de 9 chiffres.");
      return false;
    }

    if (editableFields.motdepasse && passwords.new !== passwords.confirm) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const updateData = {
      id: userData.id,
      codeClient: userData.codeClient,
      email: userData.email,
      telephone: userData.telephone,
      adresse: userData.adresse,
      currentPassword: passwords.current || null,
      newPassword: passwords.new || null,
    };

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/client/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "Erreur lors de la mise à jour");
        return;
      }

      const result = await response.json();
      alert("Profil mis à jour avec succès");

      localStorage.setItem("client", JSON.stringify(result.client));
      setUserData({
        ...userData,
        email: result.client.email,
        telephone: result.client.telephone,
        date_naissance: result.client.date_naissance,
        adresse: result.client.adresse,
        motdepasse: '********',
      });
      setPasswords({ current: '', new: '', confirm: '' });
      setEditableFields({
        email: false,
        telephone: false,
        adresse: false,
        motdepasse: false,
      });
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="flex w-full overflow-hidden" style={{ backgroundColor: '#E5E5E5', height: '100vh' }}>
      <ProSidebarProvider>
        <CustomSidebarCl />
      </ProSidebarProvider>

      <div className="flex-1 p-10" style={{ backgroundColor: '#E5E5E5' }}>
        <div className="max-w-4xl mx-auto rounded-xl shadow-md p-6" style={{ backgroundColor: '#FFFFFF', border: '2px solid #1D2D66' }}>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#162556' }}>Mon profil</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {["nom", "prenom", "codeClient"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 text-sm" style={{ color: '#2D3250' }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <span
                  className="p-2 rounded text-sm"
                  style={{ backgroundColor: '#E8F0FE', color: '#162556', border: '1.5px solid #E5E5E5' }}
                >
                  {field === "codeClient"
                    ? (userData.codeClient !== null && userData.codeClient !== undefined
                        ? userData.codeClient.toString()
                        : '')
                    : userData[field]
                  }
                </span>
              </div>
            ))}

            {[{ name: 'email', label: 'Email', type: 'email' }, { name: 'telephone', label: 'Téléphone', type: 'text' }, { name: 'adresse', label: 'Adresse', type: 'text' }].map(({ name, label, type }) => (
              <div key={name} className="flex flex-col">
                <label className="mb-1 text-sm" style={{ color: '#2D3250' }}>{label}</label>
                <div className="flex items-center space-x-2">
                  {editableFields[name] ? (
                    <input
                      type={type}
                      name={name}
                      value={userData[name]}
                      onChange={handleChange}
                      autoFocus
                      className="flex-1 p-2 rounded outline-none text-sm placeholder-[#162556]"
                      style={{ backgroundColor: '#E8F0FE', color: '#162556', border: '1.5px solid #E5E5E5' }}
                    />
                  ) : (
                    <>
                      <span className="flex-1 p-2 rounded text-sm" style={{ backgroundColor: '#E8F0FE', color: '#162556', border: '1.5px solid #E5E5E5' }}>
                        {userData[name]}
                      </span>
                      <FaPen className="cursor-pointer" color="#FCB17A" onClick={() => toggleEdit(name)} />
                    </>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col">
              <label className="mb-1 text-sm" style={{ color: '#2D3250' }}>Date de naissance</label>
              <span className="p-2 rounded text-sm" style={{ backgroundColor: '#E8F0FE', color: '#162556', border: '1.5px solid #E5E5E5' }}>
                {userData.date_naissance}
              </span>
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
