import React, { useEffect, useState } from 'react';

const GraphStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/stats/globales')
      .then(res => {
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Données stats reçues :", data); // Pour debug
        setStats(data);
      })
      .catch(err => console.error("Erreur stats :", err));
  }, []);

 const cardStyle = "bg-[#636785] text-white p-2 rounded-md shadow-sm text-center flex flex-col justify-center h-[60px]";

  if (!stats) {
    return <p className="text-black ml-10">Chargement des statistiques...</p>;
  }

  const formatDate = (mois, annee) => {
    if (!mois || !annee) return '';
    const date = new Date(annee, mois - 1);
    return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full ml-10 mt-0 mb-0 space-y-4">
      <br />
      <div className={cardStyle}>

        <div className="text-base font-semibold">Nombre total des clients</div>
        <div className="text font-bold">{stats.total_clients}</div>
      </div>

      <div className={cardStyle}>
        <div className="text-base font-semibold">Consommation moyenne par année</div>
        <div className="text font-bold">{stats.moyenne_par_annee} W</div>
      </div>

      <div className={cardStyle}>
        <div className="text-base font-semibold">Consommation moyenne par mois</div>
        <div className="text font-bold">{stats.moyenne_par_mois} W</div>
      </div>

      <div className={cardStyle}>
        <div className="text-base font-semibold">Consommation maximale</div>
        {stats.consommation_max ? (
        
            <div className="text-sm font-semibold text mt-1">
        {stats.consommation_max.valeur} W – {formatDate(stats.consommation_max.mois, stats.consommation_max.annee)} – Code client : {stats.consommation_max.codeClient}
      </div>

  
        ) : <div className="text-sm">Aucune donnée</div>}
      </div>

      <div className={cardStyle}>
        <div className="text-base font-semibold">Consommation minimale</div>
        {stats.consommation_min ? (



  <div className="text-sm font-semibold text mt-1">
        {stats.consommation_min.valeur} W – {formatDate(stats.consommation_min.mois, stats.consommation_min.annee)} – Code client : {stats.consommation_min.codeClient}
      </div>
          
        
        ) : <div className="text-sm">Aucune donnée</div>}
      </div>
    </div>
  );
};

export default GraphStats;
