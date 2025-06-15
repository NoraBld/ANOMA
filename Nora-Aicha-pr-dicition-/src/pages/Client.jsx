import React, { useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import CustomSidebar from "../components/CustomSidebar";
import SearchAddBar from "../components/listClient/SearchAddBar";

import { Dialog } from "@headlessui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Client = () => {
  const [clients, setClients] = useState([
    { id: 1, nom: "Belaid", prenom: "Nora", adresse: "Alger", telephone: "0555 123 456", email: "nora@example.com" },
    { id: 2, nom: "Belloul", prenom: "Kaci", adresse: "Alger", telephone: "0666 789 012", email: "kaci@example.com" },
    { id: 3, nom: "Chaffi", prenom: "Aicha Manel", adresse: "Oran", telephone: "0666 789 012", email: "aicha@example.com" },
    { id: 4, nom: "Ibrir", prenom: "Walid", adresse: "Oran", telephone: "0666 789 012", email: "walid@example.com" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Exemple données réelles + prédictions par client
  const consommationDataByClient = {
    1: [
      { date: "2024-01", valeur: 120 },
      { date: "2024-02", valeur: 130 },
      { date: "2024-03", valeur: 125 },
      { date: "2024-04", valeur: 135 },
      { date: "2024-05", valeur: 140 },
      { date: "2024-06", valeur: 138 },
      { date: "2024-07", valeur: 142 },
      { date: "2024-08", valeur: 145 },
      { date: "2024-09", prediction: 148 },
      { date: "2024-10", prediction: 152 },
      { date: "2024-11", prediction: 158 },
      { date: "2024-12", prediction: 161 },
    ],
    2: [
      { date: "2024-01", valeur: 110 },
      { date: "2024-02", valeur: 115 },
      { date: "2024-03", valeur: 117 },
      { date: "2024-04", valeur: 120 },
      { date: "2024-05", valeur: 118 },
      { date: "2024-06", valeur: 122 },
      { date: "2024-07", valeur: 125 },
      { date: "2024-08", valeur: 128 },
      { date: "2024-09", prediction: 130 },
      { date: "2024-10", prediction: 133 },
      { date: "2024-11", prediction: 135 },
      { date: "2024-12", prediction: 138 },
    ],
   3: [ // Aicha Manel
    { date: "2024-01", valeur: 95 },
    { date: "2024-02", valeur: 100 },
    { date: "2024-03", valeur: 105 },
    { date: "2024-04", valeur: 103 },
    { date: "2024-05", valeur: 108 },
    { date: "2024-06", valeur: 110 },
    { date: "2024-07", valeur: 112 },
    { date: "2024-08", valeur: 114 },
    { date: "2024-09", prediction: 117 },
    { date: "2024-10", prediction: 120 },
    { date: "2024-11", prediction: 122 },
    { date: "2024-12", prediction: 125 },
  ],
  4: [ // Walid
    { date: "2024-01", valeur: 150 },
    { date: "2024-02", valeur: 145 },
    { date: "2024-03", valeur: 148 },
    { date: "2024-04", valeur: 152 },
    { date: "2024-05", valeur: 149 },
    { date: "2024-06", valeur: 151 },
    { date: "2024-07", valeur: 155 },
    { date: "2024-08", valeur: 158 },
    { date: "2024-09", prediction: 160 },
    { date: "2024-10", prediction: 162 },
    { date: "2024-11", prediction: 165 },
    { date: "2024-12", prediction: 168 },
  ],
};

  const openModal = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
  };

  const data = selectedClient ? consommationDataByClient[selectedClient.id] || [] : [];

  // Table avec bouton Visualiser
  const ClientTableWithVisualize = ({ clients, onVisualize }) => (
    <div className="bg-white p-4 rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#8D91AB] text-white">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Prénom</th>
            <th className="px-4 py-2">Adresse</th>
            <th className="px-4 py-2">Téléphone</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2 text-center">Visualiser</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{client.id}</td>
              <td className="px-4 py-2">{client.nom}</td>
              <td className="px-4 py-2">{client.prenom}</td>
              <td className="px-4 py-2">{client.adresse}</td>
              <td className="px-4 py-2">{client.telephone}</td>
              <td className="px-4 py-2">{client.email}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onVisualize(client)}
                  className="bg-[#162556] text-white px-3 py-1 rounded-xl hover:bg-[#1d2d66] transition"
                >
                  Visualiser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ProSidebarProvider>
      <div className="flex bg-[#E5E5E5] min-h-screen">
        <CustomSidebar />
        <div className="p-6 w-full">
          <SearchAddBar onAdd={() => alert("Ajouter un client")} onSearch={(q) => console.log("Recherche :", q)} />

          <ClientTableWithVisualize clients={clients} onVisualize={openModal} />
        </div>

        {/* Modal graphique */}
        <Dialog open={modalOpen} onClose={closeModal} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Consommations & Prédictions - {selectedClient?.prenom} {selectedClient?.nom}
              </Dialog.Title>

              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <CartesianGrid stroke="#878fad" />
                    <XAxis dataKey="date" stroke="#424769" />
                    <YAxis stroke="#424769" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="valeur"
                      name="Valeur réelle"
                      stroke="#424769"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      name="Prédiction"
                      stroke="#f9b17a"
                      strokeWidth={2}
                      dot={{ r: 3, strokeDasharray: "5 5" }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-sm text-black italic mt-4 ml-2">
                🔶 La ligne orange représente les valeurs prédites pour les prochaines périodes.
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#FCB17A] text-white rounded-xl"
                >
                  Fermer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </ProSidebarProvider>
  );
};

export default Client;
