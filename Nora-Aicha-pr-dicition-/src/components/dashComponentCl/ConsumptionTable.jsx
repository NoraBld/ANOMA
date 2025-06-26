import React, { useEffect, useState } from 'react';

const ConsumptionTable = () => {
  const [data, setData] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/prediction/resultats')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('Erreur lors du chargement des prédictions', err));
  }, []);

  const filteredData = data.filter(item =>
    item.date_creation.includes(searchDate)
  );

  // Fonction pour formater le mois et l'année (ex : "07/2025")
  const formatPredictionDate = (mois, annee) => {
    const moisStr = mois.toString().padStart(2, '0');
    return `${moisStr}/${annee}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-[#2d3250] text-center">
        Valeurs prédites
      </h2>

      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="mb-4 px-3 py-2 border rounded-md shadow-sm w-full text-sm text-[#2d3250]"
      />

      <div className="max-h-64 overflow-y-auto rounded-md">
        <table className="min-w-full border text-sm text-left text-[#000000]">
          <thead className="bg-[#303658] text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">Date de création</th>
              <th className="px-4 py-2">Date prédite</th>
              <th className="px-4 py-2">Valeur prédite (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{item.date_creation}</td>
                  <td className="px-4 py-2">
                    {formatPredictionDate(item.mois, item.annee)}
                  </td>
                  <td className="px-4 py-2">{item.valeur}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                  Aucune prédiction pour cette date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsumptionTable;
