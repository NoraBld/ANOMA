import React, { useState } from 'react';

const Spinner = () => (
  <div className="flex flex-col items-center my-4">
    <div className="w-8 h-8 border-4 border-[#FCB17A] border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[#162556] mt-2">Prédiction en cours...</p>
  </div>
);

const NewPredictionButton = ({ onNewPrediction }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [predictionPeriod, setPredictionPeriod] = useState('');
  const [exogFile, setExogFile] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [fileError, setFileError] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);

  const methodInfo = {
    SARIMA: { nom: 'SARIMA' },
    SARIMAX: { nom: 'SARIMAX' },
    GRU: { nom: 'GRU' },
  };

  const handleValidate = async () => {
    const formData = new FormData();
    const formData2 = new FormData();
    const methode = methodInfo[selectedMethod].nom;
    formData.append("periode", predictionPeriod);
    formData.append("nommethode", methode);

    let response = null;

    try {
      if (methode === "SARIMAX" && exogFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", exogFile);

        const uploadResponse = await fetch("http://localhost:8000/exogene/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadResponse.ok) {
          throw new Error("Erreur lors de l'import des données exogènes");
        }
      }

      setIsPredicting(true);

      if (methode === "SARIMA") {
        response = await fetch("http://localhost:8000/predict/sarima", {
          method: "POST",
          body: formData,
        });

      } else if (methode === "SARIMAX") {
        const sarimaResponse = await fetch("http://localhost:8000/predict/sarima", {
          method: "POST",
          body: formData,
        });

        if (!sarimaResponse.ok) throw new Error("Erreur SARIMA");

        const sarimaData = await sarimaResponse.json();
        sarimaData.dates.forEach(date => formData2.append("dates", date));
        sarimaData.valeurs.forEach(val => formData2.append("valeurs", val));
        formData2.append("periode", predictionPeriod);
        formData2.append("nommethode", methode);

        response = await fetch("http://localhost:8000/predict/sarimax", {
          method: "POST",
          body: formData2,
        });

      } else if (methode === "GRU") {
        response = await fetch("http://localhost:8000/predict/gru", {
          method: "POST",
          body: formData,
        });
      }

      if (!response || !response.ok) throw new Error("Échec de la prédiction");
      const data = await response.json();

      const predictionFormatted = {
        Date: data.dates,
        Valeurs: data.valeurs,
        methode: data.nom_de_la_methode,
        periode: predictionPeriod,
        len: data.data_len,
      };

      const selectFormatted = {
        methode: data.nom_de_la_methode,
        nommethode: data.nom_de_la_methode,
      };

      let sommaireFormatted = {};

      if (["SARIMA", "SARIMAX"].includes(data.nom_de_la_methode)) {
        sommaireFormatted = {
          erreur: data.taux_erreur_mape,
          p: data.meilleurs_parametres.p,
          d: data.meilleurs_parametres.d,
          q: data.meilleurs_parametres.q,
          P: data.meilleurs_parametres.P,
          D: data.meilleurs_parametres.D,
          Q: data.meilleurs_parametres.Q,
          AIC: data.aic_bestmodel,
          nommethode: data.nom_de_la_methode,
        };
      } else if (data.nom_de_la_methode === "GRU") {
        sommaireFormatted = {
          erreur: data.taux_erreur_mape,
          ...data.meilleurs_parametres,
          nommethode: data.nom_de_la_methode,
        };
      }

      onNewPrediction(predictionFormatted, sommaireFormatted, selectFormatted);

      // Stop le spinner avant l'affichage de l'alerte
      setIsPredicting(false);

      // Affiche l'alerte juste après
      setTimeout(() => {
        alert("Prédiction lancée avec succès !");
        setShowForm(false);
      }, 100);

    } catch (error) {
      console.error("Erreur réseau :", error);
      alert(error.message || "Une erreur est survenue lors de la prédiction.");
      setIsPredicting(false);
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-end mr-[6%]">
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white font-bold py-3 px-6 rounded-lg transition duration-300 bg-[#FCB17A]"
        >
          Lancer une nouvelle prédiction
        </button>
      </div>

      {showForm && (
        <div className="w-full flex flex-col items-center mt-6">
          <h2 className="text-xl font-bold mb-4 text-[#162556]">Choisissez une méthode</h2>
          <div className="flex space-x-6 mb-8 justify-center">
            {['SARIMA', 'SARIMAX', 'GRU'].map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-6 py-2 rounded-xl font-semibold transition shadow border ${
                  selectedMethod === method
                    ? 'bg-[#162556] text-white border-[#162556]'
                    : 'bg-white text-[#162556] border-[#162556] hover:bg-[#f1f1f1]'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && selectedMethod && (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#162556]">
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-[#162556] font-medium">Période de prédiction</label>
                <input
                  type="text"
                  value={predictionPeriod}
                  onChange={(e) => setPredictionPeriod(e.target.value)}
                  placeholder="ex: 12 mois"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#162556]"
                />
              </div>

              {selectedMethod === 'SARIMAX' && (
                <>
                  <div>
                    <label className="block mb-2 text-[#162556] font-medium">Type de fichier</label>
                    <select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        setExogFile(null);
                        setFileError('');
                      }}
                      className="w-full p-2 border rounded-xl text-[#0F1A3C]"
                    >
                      <option value="">-- Sélectionner un type --</option>
                      <option value="csv">Fichier CSV</option>
                      <option value="excel">Fichier Excel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[#162556] font-medium">Importer un fichier</label>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const isExcel = selectedType === 'excel' && file.name.endsWith('.xlsx');
                        const isCSV = selectedType === 'csv' && file.name.endsWith('.csv');
                        if (!isExcel && !isCSV) {
                          setFileError("Format de fichier invalide pour le type sélectionné.");
                          setExogFile(null);
                        } else {
                          setFileError("");
                          setExogFile(file);
                        }
                      }}
                      className="w-full p-2 border rounded-xl text-[#0F1A3C]"
                    />
                    {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                    {exogFile && <p className="text-green-600 text-sm mt-1">✅ {exogFile.name}</p>}
                  </div>
                </>
              )}

              {isPredicting && <Spinner />}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-semibold text-sm"
                  disabled={isPredicting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleValidate}
                  className="px-5 py-3 rounded-xl bg-[#FCB17A] text-white font-semibold text-sm hover:bg-[#f8a14e]"
                  disabled={isPredicting}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPredictionButton;
