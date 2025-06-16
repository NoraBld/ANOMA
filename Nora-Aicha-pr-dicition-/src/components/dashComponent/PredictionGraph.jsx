import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,

  CartesianGrid
} from 'recharts';
import GraphStats from './GraphStats';

const PredictionGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/consommation/mensuelle')
      .then((response) => {
        if (!response.ok) throw new Error('Erreur réseau');
        return response.json();
      })
      .then(setData)
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  const valeurs = data.filter(d => d.valeur !== undefined).map(d => d.valeur);
  const total = valeurs.reduce((a, b) => a + b, 0);
  const max = Math.max(...valeurs);
  const min = Math.min(...valeurs);
  const moyenne = (total / valeurs.length).toFixed(2);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split("-");
    const moisNom = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return `${moisNom[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="bg-[#f3f4fa] text-white p-4 shadow-md w-full">
      <div className="flex flex-col lg:flex-row">

        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid stroke="#878fad" />
              <XAxis dataKey="date" stroke="#424769" />
              <YAxis stroke="#424769" />


              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const point = payload[0].payload;
                    return (
                      <div className="bg-white text-[#2D3250] p-2 rounded shadow border border-gray-200 text-sm">
                        📅 <strong>Date :</strong> {formatDate(point.date)} <br />
                        ⚡ <strong>Consommation :</strong> {point.valeur} W
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="valeur"
                name="Consommation"
                stroke="#424769"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>


        <div className="mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/3">
          <GraphStats data={data} />
        </div>
      </div>


      <p className="text-sm text-black italic mt-4 ml-2 flex items-center gap-2">
        <TrendingUp size={16} className="text-[#FCB17A]" />
        Vous allez produire <strong>{total.toFixed(0)} W</strong> d’énergie.
      </p>

    </div>
  );
};

export default PredictionGraph;
