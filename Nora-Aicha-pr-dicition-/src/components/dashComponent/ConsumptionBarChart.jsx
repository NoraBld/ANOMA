// components/visualisationComponent/ConsumptionBarChart.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { mois: 'Jan', consommation: 120 },
  { mois: 'Fév', consommation: 130 },
  { mois: 'Mar', consommation: 125 },
  { mois: 'Avr', consommation: 135 },
  { mois: 'Mai', consommation: 140 },
  { mois: 'Juin', consommation: 138 },
  { mois: 'Juil', consommation: 142 },
  { mois: 'Août', consommation: 145 },
];

const ConsumptionBarChart = () => {
  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      <h3 className="text-xl font-semibold text-[#2d3250] mb-4">Consommation mensuelle</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" stroke="#2d3250" />
          <YAxis stroke="#2d3250" />
          <Tooltip />
          <Bar dataKey="consommation" fill="#f9b17a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionBarChart;
