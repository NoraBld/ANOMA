import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    email: "",
    motdepasse: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newClient = {
      ...form,
      id: Date.now(),
    };
    onSave(newClient);
    onClose();
  };

  const inputClass = (value) =>
    `w-full p-2 border rounded-xl text-[#0F1A3C] ${
      value ? "bg-[#E8F0FE]" : "bg-transparent"
    }`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-transparent backdrop-blur-md border border-white p-6 rounded-xl shadow-xl w-full max-w-lg">
          <Dialog.Title className="text-xl font-semibold mb-4 text-[#0F1A3C]">
            Ajouter un client
          </Dialog.Title>
          <div className="space-y-4">
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Nom"
              className={inputClass(form.nom)}
            />
            <input
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              className={inputClass(form.prenom)}
            />
            <input
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              placeholder="Adresse"
              className={inputClass(form.adresse)}
            />
            <input
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="Téléphone"
              className={inputClass(form.telephone)}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass(form.email)}
            />
            <input
              type="password"
              name="motdepasse"
              value={form.motdepasse}
              onChange={handleChange}
              placeholder="Mot de passe"
              className={inputClass(form.motdepasse)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-[#0F1A3C] rounded-xl"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#FCB17A] text-white rounded-xl"
            >
              Enregistrer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddClientModal;
