import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const PredictionTable = () => {
  const [predictions, setPredictions] = useState([]);

  const fetchPredictions = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/admin/predictions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des prédictions", error);
    }
  };

  const deletePrediction = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Confirmer la suppression de cette prédiction ?")) return;

    try {
      const res = await fetch(`http://localhost:8000/admin/prediction/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setPredictions(predictions.filter((p) => p.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-4 border border-[#1D2D66]">
      <h2 className="text-lg font-semibold mb-4 text-[#2D3250]">Liste des Prédictions</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs uppercase bg-[#303658] text-[#FFFFFF]">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Méthode</th>
            <th className="px-4 py-2">MAPE (%)</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">{new Date(p.date_creation).toLocaleDateString()}</td>
              <td className="px-4 py-2">{p.methode}</td>
              <td className="px-4 py-2">{p.mape?.toFixed(2)}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => deletePrediction(p.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Supprimer"
                >
                  <FaTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
          {predictions.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                Aucune prédiction disponible.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionTable;
