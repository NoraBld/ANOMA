import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', consommation: 120 },
  { month: 'Fév', consommation: 130 },
  { month: 'Mar', consommation: 125 },
  { month: 'Avr', consommation: 135 },
  { month: 'Mai', consommation: 140 },
  { month: 'Juin', consommation: 138 },
  { month: 'Juil', consommation: 142 },
  { month: 'Août', consommation: 145 },
  { month: 'Sep', consommation: 148 },
  { month: 'Oct', consommation: 152 },
  { month: 'Nov', consommation: 158 },
  { month: 'Déc', consommation: 161 },
];

const ConsumptionBarChart = () => {
  return (
    <div className="bg-[#f3f4fa] text-black p-4 shadow-md rounded-md w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center text-[#424769]">
        📊 Consommation mensuelle en histogramme
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" stroke="#424769" />
          <YAxis stroke="#424769" />
          <Tooltip />
          <Bar dataKey="consommation" fill="#f9b17a" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionBarChart;
