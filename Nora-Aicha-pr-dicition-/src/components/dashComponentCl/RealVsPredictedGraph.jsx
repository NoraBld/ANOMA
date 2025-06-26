
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const RealVsPredictedGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/comparaison_prediction_reel')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur de la requête');
        }
        return response.json();
      })
      .then(data => {
        setGraphData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      className="w-full bg-[#2d3250] text-white mt-6 px-4 py-6 shadow-md rounded-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-center mb-4">
        Comparaison des dernières données prédites avec les données réelles
      </h3>

      {loading ? (
        <p className="text-center text-gray-300">Chargement en cours...</p>
      ) : graphData.length === 0 ? (
        <p className="text-center text-red-300">Aucune donnée disponible</p>
      ) : (
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
      )}
    </motion.div>
  );
};

export default RealVsPredictedGraph;
