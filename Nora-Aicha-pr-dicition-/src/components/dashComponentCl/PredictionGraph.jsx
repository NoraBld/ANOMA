import React from 'react';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import GraphStats from './GraphStats';

const data = [
  { date: '2024-01', valeur: 120 },
  { date: '2024-02', valeur: 130 },
  { date: '2024-03', valeur: 125 },
  { date: '2024-04', valeur: 135 },
  { date: '2024-05', valeur: 140 },
  { date: '2024-06', valeur: 138 },
  { date: '2024-07', valeur: 142 },
  { date: '2024-08', valeur: 145 },
  { date: '2024-09', prediction: 148 },
  { date: '2024-10', prediction: 152 },
  { date: '2024-11', prediction: 158 },
  { date: '2024-12', prediction: 161 },
];

const PredictionGraph = () => {
  const valeurs = data.filter((d) => d.valeur !== undefined).map((d) => d.valeur);
  const max = Math.max(...valeurs);
  const min = Math.min(...valeurs);
  const moyenne = (valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(2);

  return (
    <div className="bg-[#f3f4fa] text-white p-4  shadow-md w-full">
      {/* <h2 className="text-xl font-bold mb-4">Consommation & Prédictions</h2> */}

      <div className="flex flex-col lg:flex-row">
        {/* Graphique */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid stroke="#878fad" />
              <XAxis dataKey="date" stroke="#424769" />
              <YAxis stroke="#424769" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="valeur"
                name="Valeur réelle"
                stroke="#424769"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="prediction"
                name="Prédiction (périodes futures)"
                stroke="#f9b17a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-sm text-black italic mt-4 ml-2">
            🔶 La lignes orange représentent les valeurs prédites pour les prochaines périodes.
          </p>

          <div className="ml-4 mt-16 space-y-4 text-sm">
 
</div>
        </div>

        {/* Statistiques à droite */}
        <div className="mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/3">
          <GraphStats data={data} />
        </div>
      </div>
    </div>
  );
};

export default PredictionGraph;
