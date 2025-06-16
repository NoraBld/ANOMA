import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const ConsumptionBarChart = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/client/mes-consommations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const transformed = data.map(item => ({
          date: `${item.annee}-${String(item.mois).padStart(2, '0')}-${String(item.jour || 1).padStart(2, '0')}`,
          consommation: item.valeur,
        }));
        setData(transformed);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des données :", error);
      });
  }, []);

  const yearlyData = data.reduce((acc, item) => {
    const year = new Date(item.date).getFullYear();
    acc[year] = (acc[year] || 0) + item.consommation;
    return acc;
  }, {});

  const yearlyChartData = Object.entries(yearlyData).map(([year, total]) => ({
    year,
    consommation: total,
  }));

  const monthlyChartData = selectedYear
    ? (() => {
        const monthlyMap = {};

        data.forEach(item => {
          const date = new Date(item.date);
          const year = date.getFullYear();
          const month = date.getMonth();

          if (year === parseInt(selectedYear)) {
            monthlyMap[month] = (monthlyMap[month] || 0) + item.consommation;
          }
        });

        return MONTHS.map((label, index) => ({
          month: label,
          consommation: monthlyMap[index] || 0,
        }));
      })()
    : [];

  return (
    <div className="bg-[#f3f4fa] text-black p-4 shadow-md rounded-md w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center text-[#424769]">
        {selectedYear
          ? ` Consommation mensuelle pour ${selectedYear}`
          : ' Consommation annuelle (cliquer sur une année)'}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={selectedYear ? monthlyChartData : yearlyChartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          onClick={({ activeLabel }) => {
            if (!selectedYear && activeLabel) {
              setSelectedYear(activeLabel);
            }
          }}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey={selectedYear ? 'month' : 'year'} stroke="#424769" />
          <YAxis stroke="#424769" />
          <Tooltip />
          <Bar
            dataKey="consommation"
            fill="#f9b17a"
            barSize={selectedYear ? 30 : 150}
          />
        </BarChart>
      </ResponsiveContainer>

      {selectedYear && (
        <div className="text-center mt-4">
          <button
            onClick={() => setSelectedYear(null)}
            className="bg-[#424769] text-white px-4 py-1 rounded hover:bg-[#2d3250] transition"
          >
            Retour aux années
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsumptionBarChart;
