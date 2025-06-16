import React from "react";
import { Pencil, Trash2, BarChart2 } from "lucide-react";


const ClientTable = ({
  clients,
  onEdit,
  onDelete,
  onViewConsumption,
  selectedClients,
  onSelectClient,
  onSelectAll,
}) => {
  const allSelected = clients.length > 0 && selectedClients.length === clients.length;

  return (
    <div className="max-h-[60vh] overflow-y-auto bg-white rounded-2xl shadow-md">
      <table className="min-w-full border-collapse text-[#0F1A3C] text-base">
        <thead className="bg-[#8D91AB] text-white sticky top-0 z-10 font-semibold">
          <tr>
            <th className="px-4 py-4 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                title="Sélectionner tous"
                className="accent-[#FCB17A]"
              />
            </th>
            <th className="px-4 py-4 text-left min-w-[50px]">ID</th>
            <th className="px-4 py-4 text-left min-w-[50px]">Code Client</th>
            <th className="px-4 py-4 text-left min-w-[100px]">Nom</th>
            <th className="px-4 py-4 text-left min-w-[100px]">Prénom</th>
            <th className="px-4 py-4 text-left min-w-[180px]">Adresse</th>
            <th className="px-4 py-4 text-left min-w-[120px]">Téléphone</th>
            <th className="px-4 py-4 text-left min-w-[140px]">Date naissance</th>
            <th className="px-4 py-4 text-left min-w-[180px]">Email</th>
            <th className="px-4 py-4 text-center">Modifier</th>
            <th className="px-4 py-4 text-center">Supprimer</th>
            <th className="px-4 py-4 text-center">Consommation</th>
          </tr>
        </thead>
        <tbody className="text-base">
          {clients.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-6 text-gray-500 italic">

                Aucun client trouvé.
              </td>
            </tr>
          ) : (
            clients.map((client) => (

              <tr
                key={client.id}
                className="hover:bg-gray-100 transition-colors rounded-xl"
              >
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={(e) => onSelectClient(client.id, e.target.checked)}
                    title={`Sélectionner ${client.prenom} ${client.nom}`}
                    className="accent-[#FCB17A]"
                  />
                </td>
                <td className="px-4 py-4">{client.id}</td>
                <td className="px-4 py-4">{client.codeClient}</td>
                <td className="px-4 py-4">{client.nom}</td>
                <td className="px-4 py-4">{client.prenom}</td>
                <td className="px-4 py-4">{client.adresse}</td>
                <td className="px-4 py-4">{client.telephone}</td>
                <td className="px-4 py-4">{client.date_naissance}</td>
                <td className="px-4 py-4">{client.email}</td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onEdit(client)}
                    title="Modifier"
                    className="text-orange-500 hover:text-orange-700 transition"
                  >
                    <Pencil size={22} />
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onDelete(client.id)}
                    title="Supprimer"
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={22} />
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onViewConsumption(client)}
                    title="Voir consommation"
                    className="text-blue-600 hover:text-blue-800 transition flex items-center justify-center gap-1 underline"
                  >
                    Visualiser <BarChart2 size={20} />

                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
