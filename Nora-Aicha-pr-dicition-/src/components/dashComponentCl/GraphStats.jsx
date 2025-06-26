
import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, TrendingUp, LineChart } from 'lucide-react';

const GraphStats = () => {
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [lastPredictionDate, setLastPredictionDate] = useState(null);
  const [lastPredictionDuration, setLastPredictionDuration] = useState(null);
  const [totalPredictionValue, setTotalPredictionValue] = useState(0);

  // Nombre total de prédictions
  useEffect(() => {
    fetch('http://localhost:8000/prediction/count')
      .then(res => res.json())
      .then(data => setTotalPredictions(data.total_predictions))
      .catch(err => console.error('Erreur fetch /prediction/count :', err));
  }, []);

  // Date de la dernière prédiction
  useEffect(() => {
    fetch('http://localhost:8000/prediction/last-date')
      .then(res => res.json())
      .then(data => setLastPredictionDate(data.last_date))
      .catch(err => console.error('Erreur fetch /prediction/last-date :', err));
  }, []);

  // Durée et énergie totale de la dernière prédiction
  useEffect(() => {
    fetch('http://localhost:8000/prediction/mensuelle')
      .then(res => res.json())
      .then(data => {
        setLastPredictionDuration(data.length); // nombre de mois
        const total = data.reduce((sum, d) => sum + (d.valeur || 0), 0);
        setTotalPredictionValue(total);
      })
      .catch(err => console.error('Erreur fetch /prediction/mensuelle :', err));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date)) return 'Date invalide';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options); // Exemple : 15 juin 2025
  };

  const cardStyle = "bg-[#636785] text-white p-4 rounded-md shadow-md mb-4 text-center";

  return (
    <div className="flex flex-col h-full ml-10">
      {/* Total des prédictions */}
      <div className={cardStyle}>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <TrendingUp size={18} />
          Nombre total de prédictions
        </div>
        <div className="text-lg font-bold">{totalPredictions}</div>
      </div>

      {/* Date de la dernière prédiction */}
      <div className={cardStyle}>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <CalendarDays size={18} />
          Date de la dernière prédiction
        </div>
        <div className="text-lg font-bold">{formatDate(lastPredictionDate)}</div>
      </div>

      {/* Durée de la dernière prédiction */}
      <div className={cardStyle}>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Clock size={18} />
          Durée de la prédiction
        </div>
        <div className="text-lg font-bold">
          {lastPredictionDuration !== null ? `${lastPredictionDuration} mois` : 'N/A'}
        </div>
      </div>

      {/* Énergie totale prédite */}
      <div className={cardStyle}>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <LineChart size={18} />
          Énergie prédite totale
        </div>
        <div className="text-lg font-bold">
          {totalPredictionValue.toFixed(2)} kWh
        </div>
      </div>
    </div>
  );
};

export default GraphStats;
