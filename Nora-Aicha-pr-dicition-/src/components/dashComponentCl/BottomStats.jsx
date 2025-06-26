

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ProgressCircle from './ProgressCircle'; // chemin à adapter selon ton projet

const BottomStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/last-prediction")
      .then((response) => response.json())
      .then((data) => setPredictionData(data))
      .catch((error) => {
        console.error("Erreur lors du chargement de la prédiction :", error);
      });
  }, []);

  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <div ref={ref} className="flex flex-col gap-4 mt-6">
      <motion.div
        className="bg-[#424769] text-white p-4 rounded-2xl shadow-md"
        variants={variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="h-auto">
          <h3 className="text-[#e7d5ac] text-lg font-semibold mb-4 border-b pb-2">
            Détail de la dernière prédiction
          </h3>
          {predictionData ? (
            <ul className="text-sm space-y-2 pl-2">
              <li>
                <span className="font-bold">Méthode utilisée :</span> {predictionData.method}
              </li>
<li className="flex items-center gap-4">
  <span className="font-bold">Taux d'erreur estimé :</span>
  <div className="w-[80px] h-[80px]">
    <ProgressCircle percentage={predictionData.params?.mape || 0} />
  </div>
</li>

<li>
  <span className="font-bold"> Paramètres utilisés :</span>
  <ul className="ml-4 list-disc space-y-1">
    {Object.entries(predictionData.params || {}).map(([key, value]) => (
      key !== "mape" && (
        <li key={key}>
          {key} : {value}
        </li>
      )
    ))}
  </ul>
</li>

            </ul>
          ) : (
            <p>Chargement...</p>
          )}
        </div>
      </motion.div>

   
    </div>
  );
};

export default BottomStats;
