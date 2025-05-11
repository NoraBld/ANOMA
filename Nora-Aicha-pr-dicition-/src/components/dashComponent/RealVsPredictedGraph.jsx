import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const graphData = [
  { date: 'Jan', real: 100, predicted: 95 },
  { date: 'Feb', real: 120, predicted: 118 },
  { date: 'Mar', real: 130, predicted: 125 },
  { date: 'Apr', real: 90, predicted: 92 },
  { date: 'May', real: 110, predicted: 105 },
];

const RealVsPredictedGraph = () => {
  return (
    <motion.div
      className="w-full bg-[#2d3250] text-white mt-6 px-4 py-6 shadow-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-center mb-4">Comparaison des dernières données prédites avec les  données réelles </h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#424769" />
            <XAxis dataKey="date" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="real"
              stroke="#8D91AB"
              strokeWidth={2}
              dot
              name="Réel"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#f9b17a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot
              name="Prévu"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RealVsPredictedGraph;
