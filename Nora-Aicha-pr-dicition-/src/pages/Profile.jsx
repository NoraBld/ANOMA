
  import React, { useState, useEffect } from 'react';
  import CustomSidebar from '../components/CustomSidebar';
  import { ProSidebarProvider } from 'react-pro-sidebar';
  import { FaPen } from 'react-icons/fa';

  const Profile = () => {
    const [adminData, setAdminData] = useState({
      id: '',
      nom_Entreprise: '',
      email: '',
      secteur: '',
      telephone: '',
      mot_de_passe: '********',
      logo: null,
    });

    const [editableFields, setEditableFields] = useState({
      email: false,
      telephone: false,
      secteur: false,
      mot_de_passe: false,
    });

    const [passwords, setPasswords] = useState({
      current: '',
      new: '',
      confirm: '',
    });

    useEffect(() => {
      const fetchAdminData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await fetch('http://localhost:8000/admin/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
          }

          const data = await response.json();
          setAdminData({
            id: data.id || '',
            nom_Entreprise: data.nom_Entreprise || '',
            email: data.email || '',
            secteur: data.secteur || '',
            telephone: data.telephone || '',
            mot_de_passe: '********',
            logo: data.logo || null,
          });

          localStorage.setItem("admin", JSON.stringify(data));
        } catch (error) {
          console.error(error);
          alert("Impossible de récupérer les données de l'administrateur.");
        }
      };

      fetchAdminData();
    }, []);

    const toggleEdit = (field) => {
      setEditableFields({ ...editableFields, [field]: !editableFields[field] });
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (['current', 'new', 'confirm'].includes(name)) {
        setPasswords({ ...passwords, [name]: value });
      } else {
        setAdminData({ ...adminData, [name]: value });
      }
    };

    const handleLogoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAdminData({ ...adminData, logo: file });
      }
    };

    const validateInputs = () => {
      const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
      const phoneRegex = /^(05|06|07)\d{8}$|^\+213\d{9}$/;

      if (!emailRegex.test(adminData.email)) {
        alert("Email invalide. Utilisez une adresse se terminant par @gmail.com en minuscules.");
        return false;
      }

      if (!phoneRegex.test(adminData.telephone)) {
        alert("Numéro de téléphone invalide.");
        return false;
      }

      if (editableFields.mot_de_passe && passwords.new !== passwords.confirm) {
        alert("Les nouveaux mots de passe ne correspondent pas.");
        return false;
      }

      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateInputs()) return;

      const formData = new FormData();
      formData.append('id', adminData.id);
      formData.append('email', adminData.email);
      formData.append('secteur', adminData.secteur);
      formData.append('telephone', adminData.telephone);

      if (editableFields.mot_de_passe) {
        formData.append('currentPassword', passwords.current);
        formData.append('newPassword', passwords.new);
      }

      if (adminData.logo && typeof adminData.logo !== 'string') {
        formData.append('logo', adminData.logo);
      }

      const token = localStorage.getItem('token');

      try {
        const response = await fetch("http://localhost:8000/admin/update", {
         method: 'PUT',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.detail || "Erreur lors de la mise à jour");
          return;
        }

        const result = await response.json();
        alert("Profil mis à jour avec succès");

        localStorage.setItem("admin", JSON.stringify(result.admin));
        setAdminData({
          ...adminData,
          email: result.admin.email,
          secteur: result.admin.secteur,
          telephone: result.admin.telephone,
          mot_de_passe: '********',
          logo: result.admin.logo,
        });

        setPasswords({ current: '', new: '', confirm: '' });
        setEditableFields({
          email: false,
          telephone: false,
          secteur: false,
          mot_de_passe: false,
        });

      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la mise à jour");
      }
    };

    const inputClass = "flex-1 p-3 rounded outline-none text-base bg-[#E8F0FE] text-[#162556] border border-[#E5E5E5]";

    return (
      <div className="flex w-full h-screen overflow-hidden" style={{ backgroundColor: '#E5E5E5' }}>
        <ProSidebarProvider>
          <CustomSidebar />
        </ProSidebarProvider>

        <div className="flex-1 h-full overflow-y-auto p-6" style={{ backgroundColor: '#E5E5E5' }}>
          <div className="max-w-4xl mx-auto rounded-xl shadow-md p-6" style={{ backgroundColor: '#FFFFFF', border: '2px solid #1D2D66' }}>

            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-bold text-[#162556]">
                {adminData.nom_Entreprise}
              </div>
              <div className="relative w-32 h-32">
                {adminData.logo ? (
                  


                 <img
      src={
    typeof adminData.logo === 'string'
      ? `http://localhost:8000${adminData.logo}`
      : URL.createObjectURL(adminData.logo)
  }
  alt="Logo entreprise"
  className="w-full h-full rounded-full object-cover border"
/>

                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                    Pas de logo
                  </div>
                )}
                <label
                  htmlFor="logo-upload"
                  className="absolute bottom-1 right-1 bg-white border rounded-full p-1 cursor-pointer shadow hover:bg-gray-100"
                  title="Changer le logo"
                >
                  <FaPen size={20} className="text-[#FCB17A]" />
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-[#2D3250]">Nom de l'entreprise</label>
                <span className="p-3 rounded text-base bg-[#E8F0FE] text-[#162556] border border-[#E5E5E5]">
                  {adminData.nom_Entreprise}
                </span>
              </div>

              {[
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'telephone', label: 'Téléphone', type: 'text' },
                { name: 'secteur', label: 'Secteur', type: 'text' },
              ].map(({ name, label, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="mb-1 text-sm text-[#2D3250]">{label}</label>
                  <div className="flex items-center space-x-2">
                    {editableFields[name] ? (
                      <input
                        type={type}
                        name={name}
                        value={adminData[name]}
                        onChange={handleChange}
                        autoFocus
                        className={inputClass}
                      />
                    ) : (
                      <>
                        <span className={inputClass}>
                          {adminData[name]}
                        </span>
                        <FaPen className="cursor-pointer" color="#FCB17A" onClick={() => toggleEdit(name)} />
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 text-sm text-[#2D3250]">Mot de passe</label>
                {editableFields.mot_de_passe ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="password"
                      name="current"
                      placeholder="Mot de passe actuel"
                      value={passwords.current}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <input
                      type="password"
                      name="new"
                      placeholder="Nouveau mot de passe"
                      value={passwords.new}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <input
                      type="password"
                      name="confirm"
                      placeholder="Confirmer le mot de passe"
                      value={passwords.confirm}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className={inputClass}>********</span>
                    <FaPen className="cursor-pointer" color="#FCB17A" onClick={() => toggleEdit("mot_de_passe")} />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded hover:brightness-110 text-white text-base"
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

  export default Profile;  
  


