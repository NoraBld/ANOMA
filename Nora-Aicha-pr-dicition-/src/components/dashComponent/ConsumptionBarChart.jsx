import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const ConsumptionBarChart = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const moisNoms = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Charger les consommations par année
  useEffect(() => {
    fetch('http://localhost:8000/consommation/par-annee')
      .then(res => res.json())
      .then(data => setYearlyData(data))
      .catch(err => console.error("Erreur chargement par année:", err));
  }, []);

  // Charger les consommations mensuelles pour l'année sélectionnée
  useEffect(() => {
    if (selectedYear) {
      fetch('http://localhost:8000/consommation/mensuelle')
        .then(res => res.json())
        .then(data => {
          const filtered = data
            .filter(item => item.date.startsWith(selectedYear.toString()))
            .map(item => {
              const moisNum = parseInt(item.date.split('-')[1], 10);
              return {
                mois: moisNoms[moisNum - 1], // Affiche le nom du mois
                consommation: item.valeur
              };
            })
            .sort((a, b) => moisNoms.indexOf(a.mois) - moisNoms.indexOf(b.mois)); // Tri par ordre des mois

          setMonthlyData(filtered);
        })
        .catch(err => console.error("Erreur chargement mensuel:", err));
    }
  }, [selectedYear]);

  const handleBarClick = (data) => {
    if (!selectedYear && data?.annee) {
      setSelectedYear(data.annee);
    }
  };

  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      <h3 className="text-xl font-semibold text-[#2d3250] mb-4">
        {selectedYear ? `Consommation mensuelle - ${selectedYear}` : 'Consommation annuelle'}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={selectedYear ? monthlyData : yearlyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          onClick={(e) => handleBarClick(e?.activePayload?.[0]?.payload)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={selectedYear ? 'mois' : 'annee'}
            stroke="#2d3250"
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis stroke="#2d3250" />
          <Tooltip />
          <Bar dataKey={selectedYear ? 'consommation' : 'valeur'} fill="#f9b17a" />
        </BarChart>
      </ResponsiveContainer>

      {selectedYear && (
        <button
          onClick={() => setSelectedYear(null)}
          className="mt-4 px-4 py-2 bg-[#2d3250] text-white rounded"
        >
          Retour aux années
        </button>
      )}
    </div>
  );
};

export default ConsumptionBarChart;
