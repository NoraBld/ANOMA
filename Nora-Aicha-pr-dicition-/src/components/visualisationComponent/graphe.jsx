import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const formatXAxis = (tickItem) => {
  const parts = tickItem.split('-');
  if (parts.length === 2) {
    const monthIndex = parseInt(parts[1], 10) - 1;
    return monthNames[monthIndex] || tickItem;
  }
  return tickItem;
};

const Graphe = () => {
  const [graphData, setGraphData] = useState([]);
  const [moyenne, setMoyenne] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/client/mes-consommations-pred", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const consoData = res.consommations.map(item => ({
          date: `${item.annee}-${String(item.mois).padStart(2, '0')}`,
          valeur: item.valeur,
          prediction: null, // important pour affichage propre
        }));

        const predData = res.predictions.map(item => ({
          date: `${item.annee}-${String(item.mois).padStart(2, '0')}`,
          valeur: null,
          prediction: item.prediction,
        }));

        const mergedData = [...consoData, ...predData];

        setGraphData(mergedData);

        const valeurs = consoData.map(d => d.valeur);
        if (valeurs.length > 0) {
          setMax(Math.max(...valeurs));
          setMin(Math.min(...valeurs));
          setMoyenne((valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(2));
        }
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des données :", err);
      });
  }, []);

  return (
    <div className="bg-[#f3f4fa] text-black p-4 shadow-md w-full rounded-md">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="#878fad" />
              <XAxis dataKey="date" stroke="#424769" tickFormatter={formatXAxis} />
              <YAxis stroke="#424769" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="valeur"
                name="Consommation réelle"
                stroke="#2D3250"
                strokeWidth={2}
                dot={({ payload, cx, cy }) =>
                  payload.valeur !== null ? <circle cx={cx} cy={cy} r={4} fill="#2D3250" /> : null
                }
              />

              <Line
                type="monotone"
                dataKey="prediction"
                name="Prédiction"
                stroke="#fcb17a"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-sm italic mt-4 ml-2">
             Moyenne : <span className="font-bold">{moyenne}</span> | Min : <span className="font-bold">{min}</span> | Max : <span className="font-bold">{max}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Graphe;