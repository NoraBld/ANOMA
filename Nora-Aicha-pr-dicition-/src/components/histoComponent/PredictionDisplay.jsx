import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Activity,
  Percent,
  Settings,
  CalendarDays,
  CalendarCheck,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

const PredictionDisplay = ({ prediction }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRealData, setShowRealData] = useState(false);

  const data = prediction.predicted.map((value, index) => ({
    day: `Jour ${index + 1}`,
    predicted: value,
    real: prediction.real[index]
  }));

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-[#2D3250] flex items-center gap-2">
        <Activity className="text-[#2D3250]" size={24} /> {prediction.title}
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#8D91AB',
              borderRadius: '10px',
              border: '1px solid #8D91AB',
              color: '#fff',
              fontWeight: 500,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#2D3250"
            name="Prédiction"
            strokeWidth={2}
          />
          {showRealData && (
            <Line
              type="monotone"
              dataKey="real"
              stroke="#f59e0b"
              name="Données réelles"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-4 mt-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-[#FCB17A] hover:bg-[#fda65b] text-white px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-2"
        >
          <Info size={18} />
          {showDetails ? 'Masquer les détails' : 'Voir les détails'}
        </button>

        <button
          onClick={() => setShowRealData(!showRealData)}
          className="bg-[#FCB17A] hover:bg-[#fda65b] text-white px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-2"
        >
          {showRealData ? <EyeOff size={18} /> : <Eye size={18} />}
          {showRealData ? 'Masquer les données réelles' : 'Afficher les données réelles'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-6 p-5 bg-[#F8F9FC] rounded-xl border border-gray-100 shadow-sm space-y-3 text-[#2D3250] text-sm transition-all duration-300">
          <p className="flex items-center gap-2">
            <Activity size={16} className="text-[#FCB17A]" />
            <span className="font-semibold">Méthode :</span> {prediction.method}
          </p>
          <p className="flex items-center gap-2">
            <Percent size={16} className="text-[#FCB17A]" />
            <span className="font-semibold">Taux d'erreur :</span> {prediction.errorRate}
          </p>
          <p className="flex items-center gap-2">
            <Settings size={16} className="text-[#FCB17A]" />
            <span className="font-semibold">Paramètres :</span>
            <code className="bg-white px-2 py-1 rounded-md text-sm font-mono shadow-sm">
              {JSON.stringify(prediction.params)}
            </code>
          </p>
          <p className="flex items-center gap-2">
            <CalendarCheck size={16} className="text-[#FCB17A]" />
            <span className="font-semibold">Date de prédiction :</span> {prediction.date}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[#FCB17A]" />
            <span className="font-semibold">Période :</span> {prediction.period}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;
