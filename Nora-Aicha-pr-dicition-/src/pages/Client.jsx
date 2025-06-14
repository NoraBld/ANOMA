
// import React, { useState, useEffect } from "react";
// import { ProSidebarProvider } from "react-pro-sidebar";
// import CustomSidebar from "../components/CustomSidebar";
// import SearchAddBar from "../components/listClient/SearchAddBar";
// import AddClientModal from "../components/listClient/AddClientModal";
// import ClientTable from "../components/listClient/ClientTable";
// import ModifierModal from "../components/listClient/ModifierModal";
// import SelectionnerClient from "../components/listClient/SelectionnerClient";
// import RenouvelerModele from "../components/listClient/renouvelerModele";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const Client = () => {
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [addClientOpen, setAddClientOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [clientToEdit, setClientToEdit] = useState(null);
//   const [selectedClients, setSelectedClients] = useState([]);
//   const [consommationData, setConsommationData] = useState([]);

//   const fetchClients = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/clients");
//       if (!res.ok) throw new Error("Erreur lors de la récupération");
//       const data = await res.json();
//       setClients(data);
//       setFilteredClients(data);
//     } catch (err) {
//       alert("Erreur chargement des clients");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const handleSearch = (query) => {
//     if (!query) {
//       setFilteredClients(clients);
//       return;
//     }
//     const q = query.toLowerCase();
//     const filtered = clients.filter(
//       (c) =>
//         c.nom.toLowerCase().includes(q) ||
//         c.prenom.toLowerCase().includes(q) ||
//         c.codeClient.toString().includes(q)
//     );
//     setFilteredClients(filtered);
//   };

//   const handleEditClick = (client) => {
//     setClientToEdit(client);
//     setEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setClientToEdit(null);
//     setEditModalOpen(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Confirmer suppression ?")) return;
//     try {
//       const res = await fetch(`http://localhost:8000/clients/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Erreur suppression");
//       setClients((prev) => prev.filter((c) => c.id !== id));
//       setFilteredClients((prev) => prev.filter((c) => c.id !== id));
//       setSelectedClients((prev) => prev.filter((sid) => sid !== id));
//     } catch (err) {
//       alert("Erreur suppression");
//       console.error(err);
//     }
//   };

//   const handleSelectClient = (id, checked) => {
//     if (checked) {
//       setSelectedClients((prev) => [...prev, id]);
//     } else {
//       setSelectedClients((prev) => prev.filter((sid) => sid !== id));
//     }
//   };

//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedClients(filteredClients.map((c) => c.id));
//     } else {
//       setSelectedClients([]);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (
//       selectedClients.length === 0 ||
//       !window.confirm("Confirmer la suppression des clients sélectionnés ?")
//     )
//       return;

//     try {
//       for (const id of selectedClients) {
//         const res = await fetch(`http://localhost:8000/clients/${id}`, {
//           method: "DELETE",
//         });
//         if (!res.ok) throw new Error(`Erreur suppression client ${id}`);
//       }
//       setClients((prev) => prev.filter((c) => !selectedClients.includes(c.id)));
//       setFilteredClients((prev) =>
//         prev.filter((c) => !selectedClients.includes(c.id))
//       );
//       setSelectedClients([]);
//     } catch (err) {
//       alert("Erreur lors de la suppression des clients sélectionnés");
//       console.error(err);
//     }
//   };

//   const openConsumptionModal = async (client) => {
//     setSelectedClient(client);
//     setModalOpen(true);
//     try {
//       const res = await fetch(`http://localhost:8000/clients/${client.id}/consommations`);
//       if (!res.ok) throw new Error("Erreur récupération consommation");
//       const data = await res.json();

//       // Format "MM/YYYY"
//       const formatted = data.map((item) => ({
//         ...item,
//         date: `${String(item.mois).padStart(2, "0")}/${item.annee}`,
//       }));

//       setConsommationData(formatted);
//     } catch (err) {
//       alert("Impossible de récupérer les données de consommation.");
//       console.error(err);
//       setConsommationData([]);
//     }
//   };

//   const closeConsumptionModal = () => {
//     setSelectedClient(null);
//     setModalOpen(false);
//   };

//   return (
//     <ProSidebarProvider>
//       <div className="flex min-h-screen bg-[#E5E5E5]">
//         <CustomSidebar />
//         <div className="flex flex-col flex-1 overflow-hidden">
//           <main className="flex flex-col p-4 sm:p-6 h-full">
//             <SearchAddBar onAdd={() => setAddClientOpen(true)} onSearch={handleSearch} />
//             <div className="flex items-center justify-between mt-4">
//               <SelectionnerClient
//                 selectedCount={selectedClients.length}
//                 totalCount={filteredClients.length}
//                 onSelectAll={() => handleSelectAll(selectedClients.length !== filteredClients.length)}
//                 onDeleteSelected={handleDeleteSelected}
//               />
//               <div className="ml-auto">
//                 <RenouvelerModele />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto mt-4">
//               {loading ? (
//                 <div className="text-center py-10">Chargement des clients...</div>
//               ) : (
//                 <ClientTable
//                   clients={filteredClients}
//                   selectedClients={selectedClients}
//                   onSelectClient={handleSelectClient}
//                   onEdit={handleEditClick}
//                   onDelete={handleDelete}
//                   onViewConsumption={openConsumptionModal}
//                   onSelectAll={handleSelectAll}
//                 />
//               )}
//             </div>
//           </main>
//         </div>

//         <AddClientModal
//           isOpen={addClientOpen}
//           onClose={() => setAddClientOpen(false)}
//           setClients={setClients}
//         />

//         <ModifierModal
//           isOpen={editModalOpen}
//           onClose={closeEditModal}
//           clientToEdit={clientToEdit}
//           setClients={setClients}
//         />

//         {modalOpen && (
//   <div
//     className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg max-w-6xl w-full z-50 h-[80vh] overflow-y-auto"
//   >

//             <h2 className="text-xl font-semibold text-[#0F1A3C] mb-4">
//               Consommation de {selectedClient?.prenom} {selectedClient?.nom}
//             </h2>
//             <div className="w-full h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={consommationData}>
//                   <CartesianGrid stroke="#ccc" />
//                   <XAxis
//                     dataKey="date"
//                     angle={-45}
//                     textAnchor="end"
//                     interval={0}
//                     type="category"
//                     tickFormatter={(tick) => tick}
//                   />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="valeur"
//                     stroke="#8884d8"
//                     name="Réelle"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="prediction"
//                     stroke="#82ca9d"
//                     name="Prédite"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//             <button
//               onClick={closeConsumptionModal}
//               className="mt-4 px-4 py-2 bg-[#FCB17A] rounded text-white hover:bg-[#e99a5a]"
//             >
//               Fermer
//             </button>
//           </div>
//         )}
//       </div>
//     </ProSidebarProvider>
//   );
// };

// export default Client;





// import React, { useState, useEffect } from "react";
// import { ProSidebarProvider } from "react-pro-sidebar";
// import CustomSidebar from "../components/CustomSidebar";
// import SearchAddBar from "../components/listClient/SearchAddBar";
// import AddClientModal from "../components/listClient/AddClientModal";
// import ClientTable from "../components/listClient/ClientTable";
// import ModifierModal from "../components/listClient/ModifierModal";
// import SelectionnerClient from "../components/listClient/SelectionnerClient";
// import RenouvelerModele from "../components/listClient/renouvelerModele";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const Client = () => {
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [addClientOpen, setAddClientOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [clientToEdit, setClientToEdit] = useState(null);
//   const [selectedClients, setSelectedClients] = useState([]);
//   const [consommationData, setConsommationData] = useState([]);

//   const fetchClients = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/clients");
//       if (!res.ok) throw new Error("Erreur lors de la récupération");
//       const data = await res.json();
//       setClients(data);
//       setFilteredClients(data);
//     } catch (err) {
//       alert("Erreur chargement des clients");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const handleSearch = (query) => {
//     if (!query) {
//       setFilteredClients(clients);
//       return;
//     }
//     const q = query.toLowerCase();
//     const filtered = clients.filter(
//       (c) =>
//         c.nom.toLowerCase().includes(q) ||
//         c.prenom.toLowerCase().includes(q) ||
//         c.codeClient.toString().includes(q)
//     );
//     setFilteredClients(filtered);
//   };

//   const handleEditClick = (client) => {
//     setClientToEdit(client);
//     setEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setClientToEdit(null);
//     setEditModalOpen(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Confirmer suppression ?")) return;
//     try {
//       const res = await fetch(`http://localhost:8000/clients/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Erreur suppression");
//       setClients((prev) => prev.filter((c) => c.id !== id));
//       setFilteredClients((prev) => prev.filter((c) => c.id !== id));
//       setSelectedClients((prev) => prev.filter((sid) => sid !== id));
//     } catch (err) {
//       alert("Erreur suppression");
//       console.error(err);
//     }
//   };

//   const handleSelectClient = (id, checked) => {
//     if (checked) {
//       setSelectedClients((prev) => [...prev, id]);
//     } else {
//       setSelectedClients((prev) => prev.filter((sid) => sid !== id));
//     }
//   };

//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedClients(filteredClients.map((c) => c.id));
//     } else {
//       setSelectedClients([]);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (
//       selectedClients.length === 0 ||
//       !window.confirm("Confirmer la suppression des clients sélectionnés ?")
//     )
//       return;

//     try {
//       for (const id of selectedClients) {
//         const res = await fetch(`http://localhost:8000/clients/${id}`, {
//           method: "DELETE",
//         });
//         if (!res.ok) throw new Error(`Erreur suppression client ${id}`);
//       }
//       setClients((prev) => prev.filter((c) => !selectedClients.includes(c.id)));
//       setFilteredClients((prev) =>
//         prev.filter((c) => !selectedClients.includes(c.id))
//       );
//       setSelectedClients([]);
//     } catch (err) {
//       alert("Erreur lors de la suppression des clients sélectionnés");
//       console.error(err);
//     }
//   };

//   const openConsumptionModal = async (client) => {
//     setSelectedClient(client);
//     setModalOpen(true);
//     try {
//       const res = await fetch(`http://localhost:8000/clients/${client.id}/consommations`);
//       if (!res.ok) throw new Error("Erreur récupération consommation");
//       const data = await res.json();

//       const formatted = data.map((item) => ({
//         ...item,
//         date: `${String(item.mois).padStart(2, "0")}/${item.annee}`,
//       }));

//       setConsommationData(formatted);
//     } catch (err) {
//       alert("Impossible de récupérer les données de consommation.");
//       console.error(err);
//       setConsommationData([]);
//     }
//   };

//   const closeConsumptionModal = () => {
//     setSelectedClient(null);
//     setModalOpen(false);
//   };

//   return (
//     <ProSidebarProvider>
//       <div className="flex min-h-screen bg-[#E5E5E5]">
//         <CustomSidebar />
//         <div className="flex flex-col flex-1 overflow-hidden">
//           <main className="flex flex-col p-4 sm:p-6 h-full">
//             <SearchAddBar onAdd={() => setAddClientOpen(true)} onSearch={handleSearch} />
//             <div className="flex items-center justify-between mt-4">
//               <SelectionnerClient
//                 selectedCount={selectedClients.length}
//                 totalCount={filteredClients.length}
//                 onSelectAll={() => handleSelectAll(selectedClients.length !== filteredClients.length)}
//                 onDeleteSelected={handleDeleteSelected}
//               />
//               <div className="ml-auto">
//                 <RenouvelerModele />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto mt-4">
//               {loading ? (
//                 <div className="text-center py-10">Chargement des clients...</div>
//               ) : (
//                 <ClientTable
//                   clients={filteredClients}
//                   selectedClients={selectedClients}
//                   onSelectClient={handleSelectClient}
//                   onEdit={handleEditClick}
//                   onDelete={handleDelete}
//                   onViewConsumption={openConsumptionModal}
//                   onSelectAll={handleSelectAll}
//                 />
//               )}
//             </div>
//           </main>
//         </div>

//         <AddClientModal
//           isOpen={addClientOpen}
//           onClose={() => setAddClientOpen(false)}
//           setClients={setClients}
//         />

//         <ModifierModal
//           isOpen={editModalOpen}
//           onClose={closeEditModal}
//           clientToEdit={clientToEdit}
//           setClients={setClients}
//         />

//         {modalOpen && (
//           <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg max-w-6xl w-full z-50 h-[80vh] overflow-y-auto">
//             <h2 className="text-2xl font-semibold text-[#0F1A3C] mb-6 text-center">
//               Consommation de {selectedClient?.prenom} {selectedClient?.nom}
//             </h2>
//             <div className="w-full h-[60vh]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={consommationData}>
//                   <CartesianGrid stroke="#ccc" />
//                   <XAxis
//                     dataKey="date"
//                     angle={-45}
//                     textAnchor="end"
//                     interval={0}
//                     height={80}
//                     tick={{ fontSize: 12 }}
//                   />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="valeur"
//                     stroke="#8884d8"
//                     name="Réelle"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="prediction"
//                     stroke="#82ca9d"
//                     name="Prédite"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={closeConsumptionModal}
//                 className="px-6 py-2 bg-[#FCB17A] text-white rounded-xl hover:bg-[#e99a5a] transition"
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </ProSidebarProvider>
//   );
// };

// export default Client;
import React, { useState, useEffect } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import CustomSidebar from "../components/CustomSidebar";
import SearchAddBar from "../components/listClient/SearchAddBar";
import AddClientModal from "../components/listClient/AddClientModal";
import ClientTable from "../components/listClient/ClientTable";
import ModifierModal from "../components/listClient/ModifierModal";
import SelectionnerClient from "../components/listClient/SelectionnerClient";
import RenouvelerModele from "../components/listClient/renouvelerModele";
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
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const [consommationData, setConsommationData] = useState([]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/clients");
      if (!res.ok) throw new Error("Erreur lors de la récupération");
      const data = await res.json();
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      alert("Erreur chargement des clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredClients(clients);
      return;
    }
    const q = query.toLowerCase();
    const filtered = clients.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        c.codeClient.toString().includes(q)
    );
    setFilteredClients(filtered);
  };

  const handleEditClick = (client) => {
    setClientToEdit(client);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setClientToEdit(null);
    setEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer suppression ?")) return;
    try {
      const res = await fetch(`http://localhost:8000/clients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setClients((prev) => prev.filter((c) => c.id !== id));
      setFilteredClients((prev) => prev.filter((c) => c.id !== id));
      setSelectedClients((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      alert("Erreur suppression");
      console.error(err);
    }
  };

  const handleSelectClient = (id, checked) => {
    if (checked) {
      setSelectedClients((prev) => [...prev, id]);
    } else {
      setSelectedClients((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(filteredClients.map((c) => c.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (
      selectedClients.length === 0 ||
      !window.confirm("Confirmer la suppression des clients sélectionnés ?")
    )
      return;

    try {
      for (const id of selectedClients) {
        const res = await fetch(`http://localhost:8000/clients/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(`Erreur suppression client ${id}`);
      }
      setClients((prev) => prev.filter((c) => !selectedClients.includes(c.id)));
      setFilteredClients((prev) =>
        prev.filter((c) => !selectedClients.includes(c.id))
      );
      setSelectedClients([]);
    } catch (err) {
      alert("Erreur lors de la suppression des clients sélectionnés");
      console.error(err);
    }
  };

  const openConsumptionModal = async (client) => {
    setSelectedClient(client);
    setModalOpen(true);
    try {
      const res = await fetch(`http://localhost:8000/clients/${client.id}/consommations`);
      if (!res.ok) throw new Error("Erreur récupération consommation");
      const data = await res.json();

      const formatted = data.map((item) => ({
        ...item,
        date: `${String(item.mois).padStart(2, "0")}/${item.annee}`,
      }));

      setConsommationData(formatted);
    } catch (err) {
      alert("Impossible de récupérer les données de consommation.");
      console.error(err);
      setConsommationData([]);
    }
  };

  const closeConsumptionModal = () => {
    setSelectedClient(null);
    setModalOpen(false);
  };

  return (
    <ProSidebarProvider>
      <div className="flex min-h-screen bg-[#E5E5E5]">
        <CustomSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex flex-col p-4 sm:p-6 h-full">
            <SearchAddBar onAdd={() => setAddClientOpen(true)} onSearch={handleSearch} />
            <div className="flex items-center justify-between mt-4">
              <SelectionnerClient
                selectedCount={selectedClients.length}
                totalCount={filteredClients.length}
                onSelectAll={() => handleSelectAll(selectedClients.length !== filteredClients.length)}
                onDeleteSelected={handleDeleteSelected}
              />
              <div className="ml-auto">
                <RenouvelerModele />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              {loading ? (
                <div className="text-center py-10">Chargement des clients...</div>
              ) : (
                <ClientTable
                  clients={filteredClients}
                  selectedClients={selectedClients}
                  onSelectClient={handleSelectClient}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onViewConsumption={openConsumptionModal}
                  onSelectAll={handleSelectAll}
                />
              )}
            </div>
          </main>
        </div>

        <AddClientModal
          isOpen={addClientOpen}
          onClose={() => setAddClientOpen(false)}
          setClients={setClients}
        />

        <ModifierModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          clientToEdit={clientToEdit}
          setClients={setClients}
        />

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay flouté */}
            <div
  className="absolute inset-0 backdrop-blur-sm bg-transparent z-40"
  onClick={closeConsumptionModal}
/>

            {/* Modal */}
            <div className="relative z-50 bg-white p-6 rounded-xl shadow-xl max-w-6xl w-[95%] h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-[#0F1A3C] mb-6 text-center">
                Consommation de {selectedClient?.prenom} {selectedClient?.nom}
              </h2>

              <div className="w-full h-[60vh]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consommationData}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="valeur" stroke="#8884d8" name="Réelle" />
                    <Line type="monotone" dataKey="prediction" stroke="#82ca9d" name="Prédite" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeConsumptionModal}
                  className="px-6 py-2 bg-[#FCB17A] text-white rounded-xl hover:bg-[#e99a5a] transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProSidebarProvider>
  );
};

export default Client;
