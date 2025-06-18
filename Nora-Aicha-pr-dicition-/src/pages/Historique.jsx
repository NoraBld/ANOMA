// // src/pages/Historique.jsx

// import React, { useState } from 'react';
// import SearchBar from '../components/histoComponent/SearchBar';
// import PredictionDisplay from '../components/histoComponent/PredictionDisplay';
// import { predictions } from '../data/predictionData';
// import CustomSidebar from '../components/CustomSidebar';
// import { ProSidebarProvider } from 'react-pro-sidebar'; // Assure-toi d'avoir installé react-pro-sidebar

// const Historique = () => {
//   const [selectedPrediction, setSelectedPrediction] = useState(null);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <ProSidebarProvider>
//         <CustomSidebar />
//       </ProSidebarProvider>

//       <div className="flex-1 p-8 overflow-auto bg-neutral-200">

        

//         <SearchBar
//           predictions={predictions}
//           onSelect={setSelectedPrediction}
//         />

//         {selectedPrediction && (
//           <PredictionDisplay prediction={selectedPrediction} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Historique;




import React, { useEffect, useState } from 'react';
import SearchBar from '../components/histoComponent/SearchBar';
import PredictionDisplay from '../components/histoComponent/PredictionDisplay';
import CustomSidebar from '../components/CustomSidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';

const Historique = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/predictions') // adapte l'URL si besoin
      .then(res => res.json())
      .then(data => setPredictions(data))
      .catch(err => console.error('Erreur lors du chargement des prédictions:', err));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <ProSidebarProvider>
        <CustomSidebar />
      </ProSidebarProvider>

      <div className="flex-1 p-8 overflow-auto bg-neutral-200">
        <SearchBar
          predictions={predictions}
          onSelect={setSelectedPrediction}
        />
        {selectedPrediction && (
          <PredictionDisplay prediction={selectedPrediction} />
        )}
      </div>
    </div>
  );
};

export default Historique;
