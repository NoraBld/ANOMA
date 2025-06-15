import React from 'react';

const GraphStats = ({ data }) => {
  const predictions = data.filter(d => d.prediction !== undefined);
  const total = predictions.length;
  const lastDate = predictions[predictions.length - 1]?.date || 'N/A';
  const duration = `${total} mois`;

  const cardStyle = "bg-[#636785] text-white p-4 rounded-sm shadow-md mb-4 text-center";

  return (
    <div className="flex flex-col  h-full  ml-10 mt-0 mb-0">
      <div className={cardStyle}>
        <div className=" bg-[#636785] text-sm font-semibold">Nombre total des clients</div>
        <div className="text-lg font-bold">{total}</div>
      </div>
      <div className={cardStyle}>
        <div className="text-sm font-semibold">Consommation moyenne par année</div>
        <div className="text-lg font-bold">{lastDate}</div>
      </div>
      <div className={cardStyle}>
        <div className="text-sm font-semibold">Consommation moyenne par mois</div>
        <div className="text-lg font-bold">{duration}</div>
      </div>
    </div>
  );
};

export default GraphStats;
