import React, { useEffect, useState } from 'react';

const GraphStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/stats/globales')
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error("Erreur stats :", err));
  }, []);

  const cardStyle = "bg-[#636785] text-white p-4 rounded-sm shadow-md mb-4 text-center";

  if (!stats) {
    return <p className="text-black ml-10">Chargement des statistiques...</p>;
  }

  return (
    <div className="flex flex-col h-full ml-10 mt-0 mb-0">
      {/* 1. Nombre total des clients */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold">Nombre total des clients</div>
        <div className="text-lg font-bold">{stats.total_clients}</div>
      </div>

      {/* 2. Consommation moyenne par année */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold">Consommation moyenne par année</div>
        <div className="text-lg font-bold">{stats.moyenne_par_annee} W</div>
      </div>

      {/* 3. Consommation moyenne par mois */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold">Consommation moyenne par mois</div>
        <div className="text-lg font-bold">{stats.moyenne_par_mois} W</div>
      </div>
    </div>
  );
};

export default GraphStats;
