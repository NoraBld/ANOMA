
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/histoComponent/SearchBar';
import PredictionDisplay from '../components/histoComponent/PredictionDisplay';
import CustomSidebar from '../components/CustomSidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';

const Historique = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/predictions')
      .then(res => res.json())
      .then(data => setPredictions(data))
      .catch(err => console.error('Erreur lors du chargement des prédictions:', err));
  }, []);

  return (
    <div className="flex h-screen">
      <ProSidebarProvider>
        <CustomSidebar />
      </ProSidebarProvider>

      {/* Contenu principal */}
      <div
        className="flex-1 overflow-auto bg-cover bg-center"
       
      >
        <div className="flex flex-col items-center justify-start min-h-screen bg-white/60 p-8 backdrop-blur-md">

          {/* Barre de recherche toujours visible */}
          <div className="w-full max-w-4xl text-center mb-4">
            <h1 className="text-3xl font-bold text-[#2D3250] mb-6">Recherche de Prédictions</h1>
            <SearchBar predictions={predictions} onSelect={setSelectedPrediction} />
          </div>

          {/* Bouton retour si une prédiction est sélectionnée */}
          {selectedPrediction && (
            <>
              <div className="w-full max-w-4xl mt-4">
                <PredictionDisplay prediction={selectedPrediction} />
              </div>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="mt-6 text-sm text-blue-700 hover:underline"
              >
                ← Retour à la liste des prédictions
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Historique;
