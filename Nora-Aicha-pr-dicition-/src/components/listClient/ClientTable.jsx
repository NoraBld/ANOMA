import React from "react";
import { Pencil, Trash2, BarChart2 } from "lucide-react";

const ClientTable = ({ clients, onEdit, onDelete, onViewConsumption }) => {
  return (
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
            <th className="px-4 py-2 text-center">Modifier</th>
            <th className="px-4 py-2 text-center">Supprimer</th>
            <th className="px-4 py-2 text-center">Consommation</th> {/* Nouvelle colonne */}
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">
                Aucun client trouvé.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{client.id}</td>
                <td className="px-4 py-2">{client.nom}</td>
                <td className="px-4 py-2">{client.prenom}</td>
                <td className="px-4 py-2">{client.adresse}</td>
                <td className="px-4 py-2">{client.telephone}</td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(client)}
                    className="text-orange-500 hover:text-orange-700 transition"
                    title="Modifier"
                  >
                    <Pencil size={20} />
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onDelete(client.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Supprimer"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onViewConsumption(client)}
                    className="text-blue-600 hover:text-blue-800 transition underline"
                    title="Visualiser les consommations"
                  >
                    Visualiser
                    <BarChart2 size={18} className="inline ml-1" />
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
