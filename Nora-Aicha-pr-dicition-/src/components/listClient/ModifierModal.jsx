import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

const ModifierModal = ({ isOpen, onClose, clientToEdit, setClients }) => {
  const [form, setForm] = useState({
    codeClient: "",
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    date_naissance: "",
    email: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(""); // "csv" ou "excel"
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      const dateFormatted = clientToEdit.date_naissance?.split("T")[0] || "";
      setForm({
        codeClient: clientToEdit.codeClient || "",
        nom: clientToEdit.nom || "",
        prenom: clientToEdit.prenom || "",
        adresse: clientToEdit.adresse || "",
        telephone: clientToEdit.telephone || "",
        date_naissance: dateFormatted,
        email: clientToEdit.email || "",
      });
      setErrors({});
    }
  }, [clientToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", global: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isExcel = selectedType === "excel" && file.name.endsWith(".xlsx");
    const isCSV = selectedType === "csv" && file.name.endsWith(".csv");

    if (!isExcel && !isCSV) {
      setFileError("Format de fichier invalide pour le type sélectionné.");
      setSelectedFile(null);
    } else {
      setFileError("");
      setSelectedFile(file);
    }
  };

  const validateForm = () => {
    const phoneRegex = /^(05|06|07)\d{8}$|^\+213\d{9}$/;
    const emailRegex = /^[\w.-]+@gmail\.com$/;

    const newErrors = {};
    if (!form.codeClient || isNaN(form.codeClient)) newErrors.codeClient = "Le code client est obligatoire et doit être un nombre.";
    if (!form.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";
    if (!form.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire.";
    if (!form.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire.";
    } else if (!phoneRegex.test(form.telephone)) {
      newErrors.telephone = "Téléphone invalide.";
    }
    if (!form.date_naissance.trim()) newErrors.date_naissance = "La date de naissance est obligatoire.";
    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "L'email doit être un @gmail.com";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailExists = async () => {
    try {
      const res = await fetch(`http://localhost:8000/clients/email-exists?email=${encodeURIComponent(form.email)}`);
      if (!res.ok) return false;
      const data = await res.json();
      if (data.exists && form.email !== clientToEdit.email) {
        setErrors((prev) => ({ ...prev, email: "Cette adresse e-mail est déjà utilisée." }));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateClient = async () => {
    if (!validateForm()) return;

    if (selectedType && !selectedFile) {
      setFileError("Veuillez sélectionner un fichier.");
      return;
    }

    setIsSubmitting(true);
    const emailExists = await checkEmailExists();
    if (emailExists) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(`http://localhost:8000/clients/${clientToEdit.id}/with-consommation`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la mise à jour");
      }

      const updatedClient = await response.json();
      setClients((prevClients) =>
        prevClients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      setErrors((prev) => ({ ...prev, global: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (value, error) =>
    `w-full p-2 rounded-xl text-[#0F1A3C] border ${error ? "border-red-600" : "border-gray-300"} ${value ? "bg-[#E8F0FE]" : "bg-transparent"} focus:outline-none focus:ring-2 focus:ring-[#FCB17A] transition-colors duration-200`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg sm:max-w-md max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4 text-[#0F1A3C]">
            Modifier le client
          </Dialog.Title>

          {errors.global && (
            <div className="mb-4 text-red-600 font-semibold">{errors.global}</div>
          )}

          <div className="space-y-4">
            {["codeClient", "nom", "prenom", "adresse", "telephone", "email"].map((field) => (
              <div key={field}>
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "telephone"
                      ? "tel"
                      : field === "codeClient"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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

            {/* Fichier CSV/Excel */}
            <div className="mt-6 space-y-2">
              <label className="font-medium text-[#0F1A3C]">Importer un fichier :</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border rounded-xl text-[#0F1A3C]"
              >
                <option value="">-- Sélectionner un type --</option>
                <option value="csv">Fichier CSV</option>
                <option value="excel">Fichier Excel</option>
              </select>
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-xl text-[#0F1A3C]"
              />
              {fileError && <p className="text-red-600 text-sm">{fileError}</p>}
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
              onClick={handleUpdateClient}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#FCB17A] text-white rounded-xl hover:bg-[#e89a52] transition"
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModifierModal;
