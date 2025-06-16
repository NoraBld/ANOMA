import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const AddClientModal = ({ isOpen, onClose, setClients }) => {
  const [form, setForm] = useState({
    codeClient: "",
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    date_naissance: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consommationFile, setConsommationFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const phoneRegex = /^(05|06|07)\d{8}$|^\+213\d{9}$/;
  const emailRegex = /^[\w.-]+@gmail\.com$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", global: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.codeClient.trim()) newErrors.codeClient = "Le code client est obligatoire.";
    if (!form.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";
    if (!form.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire.";
    if (!form.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire.";
    } else if (!phoneRegex.test(form.telephone)) {
      newErrors.telephone =
        "Le téléphone doit commencer par 05, 06, 07 ou être au format +213 suivi de 9 chiffres.";
    }
    if (!form.date_naissance.trim()) newErrors.date_naissance = "La date de naissance est obligatoire.";
    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "L'email doit être au format '@gmail.com'.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setConsommationFile(null);
      setFileError("");
      return;
    }
    const validExtensions = [".csv", ".xlsx"];
    const isValid = validExtensions.some((ext) => file.name.endsWith(ext));
    if (!isValid) {
      setFileError("Veuillez sélectionner un fichier CSV ou Excel (.xlsx).");
      setConsommationFile(null);
    } else {
      setFileError("");
      setConsommationFile(file);
    }
  };

  const handleAddClient = async () => {
    if (!validateForm()) return;
    if (!consommationFile) {
      setFileError("Veuillez sélectionner un fichier de consommation.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("codeClient", form.codeClient);
      formData.append("nom", form.nom);
      formData.append("prenom", form.prenom);
      formData.append("adresse", form.adresse);
      formData.append("telephone", form.telephone);
      formData.append("date_naissance", form.date_naissance);
      formData.append("email", form.email);
      formData.append("file", consommationFile);

      const response = await fetch("http://localhost:8000/clients/with-consommation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ global: errorData.detail || "Erreur serveur." });
        return;
      }

      const newClient = await response.json();
      setClients((prev) => [...prev, newClient]);

      setForm({
        codeClient: "",
        nom: "",
        prenom: "",
        adresse: "",
        telephone: "",
        date_naissance: "",
        email: "",
      });
      setConsommationFile(null);
      setFileError("");
      onClose();
      window.location.reload(); // optionnel
    } catch (error) {
      setErrors({ global: "Erreur réseau. Veuillez vérifier votre connexion." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (value, error) =>
    `w-full p-2 rounded-xl text-[#0F1A3C] border ${
      error ? "border-red-600" : "border-gray-300"
    } ${value ? "bg-[#E8F0FE]" : "bg-transparent"} 
    focus:outline-none focus:ring-2 focus:ring-[#FCB17A] transition-colors duration-200`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4 text-[#0F1A3C]">
            Ajouter un client avec consommation
          </Dialog.Title>

          {errors.global && <div className="mb-4 text-red-600 font-semibold">{errors.global}</div>}

          <div className="space-y-4">
            {["codeClient", "nom", "prenom", "adresse", "telephone", "email"].map((field) => (
              <div key={field}>
                <input
                  type={field === "email" ? "email" : field === "telephone" ? "tel" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "email"
                      ? "nom@gmail.com"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  className={inputClass(form[field], errors[field])}
                  disabled={isSubmitting}
                  required
                />
                {errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <input
                type="date"
                name="date_naissance"
                value={form.date_naissance}
                onChange={handleChange}
                className={inputClass(form.date_naissance, errors.date_naissance)}
                disabled={isSubmitting}
                required
              />
              {errors.date_naissance && (
                <p className="text-red-600 text-sm mt-1">{errors.date_naissance}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[#0F1A3C]">
                Fichier de consommation (CSV ou Excel)
              </label>
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="w-full p-2 border rounded-xl mt-1"
              />
              {consommationFile && (
                <p className="text-green-600 text-sm mt-1">{consommationFile.name}</p>
              )}
              {fileError && <p className="text-red-600 text-sm mt-1">{fileError}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleAddClient}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#FCB17A] text-white rounded-xl hover:bg-[#e89a52] transition"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddClientModal;
