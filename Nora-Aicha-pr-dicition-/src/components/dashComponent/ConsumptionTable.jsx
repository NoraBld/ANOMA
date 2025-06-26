import React, { useState, useEffect } from 'react';

const ConsumptionTable = () => {
  const [data, setData] = useState([]);
  const [searchMonth, setSearchMonth] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/consommations/toutes");
        if (!response.ok) throw new Error("Erreur de la requête");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = searchMonth
    ? data.filter(item => item.date.startsWith(searchMonth))
    : data;

  const sortedData = [...filteredData].sort((a, b) => a.code_client - b.code_client);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-[#2d3250] text-center">
        Données de consommation
      </h2>

      <input
        type="month"
        value={searchMonth}
        onChange={(e) => setSearchMonth(e.target.value)}
        className="mb-4 px-3 py-2 border rounded-md shadow-sm w-full text-sm text-[#2d3250]"
      />

      <div className="h-64 overflow-y-auto">
        <table className="min-w-full border text-sm text-left text-[#000000]">
          <thead className="bg-[#303658] text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">Code client</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Consommation (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{item.code_client}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.valeur}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                  Aucune donnée pour ce mois.
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
